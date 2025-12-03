import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Dish from '../models/Dish.js';
// Import Service VNPay
import { generateVnpayUrl, verifyVnpayReturn } from '../services/vnpayService.js';
// Import Utility gửi email
import sendEmail from '../utils/sendEmail.js';

// =========================================================
// 1. CÁC HÀM XỬ LÝ ĐƠN HÀNG CƠ BẢN
// =========================================================

// @desc    Tạo đơn hàng COD/Chuyển khoản thường
// @route   POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, customerInfo, paymentMethod, isPaid } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('Không có món ăn nào trong giỏ hàng');
    }

    // --- Tính toán giá tiền từ DB để bảo mật ---
    const dishIds = orderItems.map((item) => item.dish); 
    const dishesFromDB = await Dish.find({ _id: { $in: dishIds } });
    const priceMap = dishesFromDB.reduce((map, dish) => {
        map[dish._id.toString()] = dish.price;
        return map;
    }, {});

    let calculatedTotalPrice = 0;
    const sanitizedOrderItems = orderItems.map((item) => {
        const realPrice = priceMap[item.dish]; 
        if (!realPrice) {
            res.status(404);
            throw new Error(`Không tìm thấy món ăn với ID: ${item.dish}`);
        }
        calculatedTotalPrice += realPrice * item.quantity;
        return {
            name: item.name,
            quantity: item.quantity,
            price: realPrice,
            dish: item.dish,
        };
    });

    const order = new Order({
        user: userId, 
        orderItems: sanitizedOrderItems,
        customerInfo: customerInfo,
        totalPrice: calculatedTotalPrice,
        status: 'Đang chờ xử lý',
        paymentMethod: paymentMethod || 'COD',
        isPaid: isPaid || false,
        paidAt: isPaid ? Date.now() : null,
    });

    const createdOrder = await order.save();

    // 👇 GỬI EMAIL XÁC NHẬN (HTML)
    if (customerInfo && customerInfo.email) {
        try {
            await sendEmail({
                email: customerInfo.email,
                subject: "Xác nhận đơn hàng tại L'Essence",
                message: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h3 style="color: #d35400;">Xin chào ${customerInfo.name},</h3>
                        <p>Cảm ơn bạn đã đặt hàng tại <b>L'Essence</b>. Đơn hàng của bạn đang được hệ thống xử lý.</p>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <p><b>Mã đơn hàng:</b> ${createdOrder._id}</p>
                            <p><b>Tổng tiền:</b> <span style="color: #c0392b; font-weight: bold;">${calculatedTotalPrice.toLocaleString()} VNĐ</span></p>
                            <p><b>Phương thức thanh toán:</b> ${paymentMethod || 'COD'}</p>
                        </div>
                        <p>Chúng tôi sẽ sớm liên hệ lại để xác nhận đơn hàng.</p>
                        <hr style="border: none; border-top: 1px solid #eee;" />
                        <p style="font-size: 12px; color: #777;">Trân trọng,<br/>L'Essence Team</p>
                    </div>
                `
            });
        } catch (error) {
            console.error("Lỗi gửi email đặt hàng:", error);
            // Không throw error để tránh làm hỏng quy trình đặt hàng của khách
        }
    }

    res.status(201).json({
        success: true,
        message: 'Đặt hàng thành công!',
        data: createdOrder,
    });
});

// @desc    Lấy đơn hàng của tôi
// @route   GET /api/orders/my-orders
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
});

// @desc    Lấy tất cả đơn hàng (Admin)
// @route   GET /api/orders
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
});

// @desc    Cập nhật trạng thái đơn hàng (Admin)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ['Đang chờ xử lý', 'Đã xác nhận', 'Đã hoàn thành', 'Đã hủy'];
    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error('Trạng thái không hợp lệ');
    }

    const order = await Order.findById(orderId);

    if (order) {
        // Cập nhật trạng thái
        order.status = status;
        
        // Tự động set đã thanh toán nếu hoàn thành
        if (status === 'Đã hoàn thành' && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = Date.now();
        }
        
        const updatedOrder = await order.save();

        // 👇 GỬI EMAIL THÔNG BÁO CẬP NHẬT TRẠNG THÁI (HTML)
        if (order.customerInfo && order.customerInfo.email) {
            try {
                // Chọn màu sắc cho trạng thái
                let statusColor = '#3498db'; // Blue (Mặc định)
                if (status === 'Đã hoàn thành') statusColor = '#27ae60'; // Green
                if (status === 'Đã hủy') statusColor = '#e74c3c'; // Red

                const message = `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h3>Xin chào ${order.customerInfo.name},</h3>
                        <p>Trạng thái đơn hàng <b>#${order._id}</b> của bạn đã được cập nhật.</p>
                        <div style="padding: 10px; border-left: 4px solid ${statusColor}; background: #f4f6f7; margin: 15px 0;">
                            <p style="margin: 0;">Trạng thái mới: <b style="color: ${statusColor}; font-size: 18px;">${status}</b></p>
                        </div>
                        <p>Cảm ơn bạn đã sử dụng dịch vụ của L'Essence!</p>
                        <br/>
                        <p style="font-size: 12px; color: #777;">Trân trọng,<br/>L'Essence Team</p>
                    </div>
                `;
                
                await sendEmail({
                    email: order.customerInfo.email,
                    subject: `Cập nhật đơn hàng #${order._id}: ${status}`,
                    message: message
                });
            } catch (error) {
                console.error("Lỗi gửi email cập nhật trạng thái:", error);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái đơn hàng thành công!',
            data: updatedOrder,
        });
    } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});

// =========================================================
// 2. CÁC HÀM THANH TOÁN ONLINE (VNPAY)
// =========================================================

// @desc    Tạo URL thanh toán VNPay
// @route   POST /api/orders/create_payment_url
export const createPaymentUrl = asyncHandler(async (req, res) => {
    const userId = req.user._id; 
    const { customerInfo, orderItems, totalPrice } = req.body;

    if (totalPrice < 1000) {
        res.status(400);
        throw new Error('Tổng tiền phải lớn hơn 1000 VNĐ');
    }

    // --- Tính lại tiền (Logic bảo mật giống createOrder) ---
    const dishIds = orderItems.map((item) => item.dish);
    const dishesFromDB = await Dish.find({ _id: { $in: dishIds } });
    const priceMap = dishesFromDB.reduce((map, dish) => {
        map[dish._id.toString()] = dish.price;
        return map;
    }, {});

    let calculatedTotalPrice = 0;
    const sanitizedOrderItems = orderItems.map((item) => {
        const realPrice = priceMap[item.dish];
        if (!realPrice) throw new Error(`Món ăn không tồn tại: ${item.dish}`);
        calculatedTotalPrice += realPrice * item.quantity;
        return { ...item, price: realPrice };
    });

    // Tạo đơn hàng "Tạm" (Chưa thanh toán)
    const newOrder = new Order({
        user: userId,
        customerInfo,
        orderItems: sanitizedOrderItems,
        totalPrice: calculatedTotalPrice,
        paymentMethod: 'VNPAY',
        isPaid: false
    });
    const savedOrder = await newOrder.save();

    // --- Xử lý IP Address ---
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    if (ipAddr === '::1' || ipAddr === '::ffff:127.0.0.1') {
        ipAddr = '127.0.0.1';
    }

    // Gọi Service VNPay
    try {
        const paymentUrl = generateVnpayUrl({
            ipAddr: ipAddr,
            orderId: savedOrder._id.toString(),
            amount: calculatedTotalPrice,
            orderInfo: `Thanh toan don hang ${savedOrder._id}`,
            returnUrl: process.env.VNPAY_RETURN_URL
        });

        res.status(200).json({ paymentUrl });
    } catch (error) {
        console.error("Lỗi tạo URL VNPay:", error);
        res.status(500);
        throw new Error("Không thể tạo URL thanh toán");
    }
});

// @desc    Xử lý Return từ VNPay (Callback)
// @route   GET /api/orders/vnpay_return
export const vnpayReturn = asyncHandler(async (req, res) => {
    const verifyResult = verifyVnpayReturn(req.query);

    // 1. Kiểm tra chữ ký (Checksum)
    if (!verifyResult.isValid) {
        return res.redirect(`${process.env.FRONTEND_URL}/checkout?vnpay=failure&code=97`);
    }

    const { rspCode, orderId, transactionNo } = verifyResult;

    // 2. Kiểm tra mã lỗi từ VNPay
    if (rspCode !== '00') {
        return res.redirect(`${process.env.FRONTEND_URL}/checkout?vnpay=failure&code=${rspCode}`);
    }

    // 3. Tìm đơn hàng
    const order = await Order.findById(orderId);
    if (!order) {
        return res.redirect(`${process.env.FRONTEND_URL}/checkout?vnpay=failure&code=04`);
    }

    // 4. Cập nhật trạng thái "Đã thanh toán" (Nếu chưa)
    if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
             id: transactionNo,
             status: rspCode,
             update_time: Date.now().toString(),
             email_address: order.customerInfo?.email
        };
        await order.save();

        // 👇 GỬI EMAIL XÁC NHẬN THANH TOÁN THÀNH CÔNG (HTML)
        if (order.customerInfo && order.customerInfo.email) {
            try {
                const message = `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h3 style="color: #27ae60;">Thanh toán thành công!</h3>
                        <p>Xin chào ${order.customerInfo.name},</p>
                        <p>Đơn hàng <b>#${order._id}</b> của bạn đã được thanh toán thành công qua cổng <b>VNPay</b>.</p>
                        <div style="background: #eafaf1; padding: 15px; border-radius: 5px; border: 1px solid #27ae60; margin: 15px 0;">
                            <p><b>Tổng tiền đã thanh toán:</b> ${order.totalPrice.toLocaleString()} VNĐ</p>
                            <p><b>Mã giao dịch VNPay:</b> ${transactionNo}</p>
                        </div>
                        <p>Chúng tôi sẽ sớm chuẩn bị món ăn cho bạn.</p>
                        <br/>
                        <p style="font-size: 12px; color: #777;">Trân trọng,<br/>L'Essence Team</p>
                    </div>
                `;

                await sendEmail({
                    email: order.customerInfo.email,
                    subject: "Thanh toán thành công - L'Essence",
                    message: message
                });
            } catch (error) {
                console.error("Lỗi gửi email thanh toán:", error);
            }
        }
    }

    // 5. Chuyển hướng về trang thành công (Frontend)
    const successUrl = `${process.env.FRONTEND_URL}/order-success?orderId=${orderId}`;
    return res.redirect(successUrl);
});