import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Dish from '../models/Dish.js';

// --- VNPAY IMPORTS VÀ HÀM TIỆN ÍCH MỚI ---
import moment from 'moment'; 
import crypto from 'crypto'; 
import qs from 'qs'; 

// Hàm tiện ích: Sắp xếp các tham số VNPAY theo thứ tự A-Z
function sortObject(obj) {
    let sorted = {};
    let keys = Object.keys(obj).sort();
    for (let key of keys) {
        sorted[key] = obj[key];
    }
    return sorted;
}
// ------------------------------------------

// @desc    Tạo một đơn hàng mới (Dùng cho COD/Banking thủ công)
// ... (Hàm createOrder giữ nguyên)
export const createOrder = asyncHandler(async (req, res) => {
  // ... (Giữ nguyên nội dung hàm createOrder)
    const { 
    orderItems, 
    customerInfo, 
    paymentMethod, 
    isPaid        
  } = req.body;

  // 2. Xử lý User ID 
  const userId = req.user ? req.user._id : null;

  // 3. Kiểm tra giỏ hàng
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Không có món ăn nào trong giỏ hàng');
  }

  // 4. Lấy ID của tất cả các món ăn
  const dishIds = orderItems.map((item) => item.dish); 

  // 5. Lấy giá GỐC từ database để bảo mật
  const dishesFromDB = await Dish.find({ _id: { $in: dishIds } });

  // Tạo map giá để tra cứu nhanh
  const priceMap = dishesFromDB.reduce((map, dish) => {
    map[dish._id.toString()] = dish.price;
    return map;
  }, {});

  // 6. Tính toán lại tổng tiền ở Backend
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
      price: realPrice, // Dùng giá thật từ DB
      dish: item.dish,
    };
  });

  // 7. Tạo đối tượng Đơn hàng
  const order = new Order({
    user: userId, 
    orderItems: sanitizedOrderItems,
    customerInfo: customerInfo,
    totalPrice: calculatedTotalPrice,
    status: 'Đang chờ xử lý',
    
    // --- THÔNG TIN THANH TOÁN MỚI ---
    paymentMethod: paymentMethod || 'COD',
    isPaid: isPaid || false,
    paidAt: isPaid ? Date.now() : null,
  });

  // 8. Lưu vào database
  const createdOrder = await order.save();

  // 9. Trả về kết quả
  res.status(201).json({
    success: true,
    message: 'Đặt hàng thành công!',
    data: createdOrder,
  });
});


// ... (Các hàm getMyOrders, getAllOrders, updateOrderStatus giữ nguyên)

export const getMyOrders = asyncHandler(async (req, res) => {
  // Chỉ tìm đơn hàng của user đang đăng nhập
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    data: orders,
  });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email') // Lấy thông tin user nếu có
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    data: orders,
  });
});

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
    order.status = status;

    // Tự động cập nhật đã thanh toán nếu đơn hàng hoàn thành 
    if (status === 'Đã hoàn thành' && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
    }

    const updatedOrder = await order.save();
    
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
// --- HÀM CONTROLLER MỚI CHO VNPAY (ĐÃ SỬA LỖI IP VÀ BUFFER) ---
// =========================================================

// @desc    Sinh ra URL VNPAY
// @route   POST /api/orders/create_payment_url
// @access  Private
export const createPaymentUrl = async (req, res) => {
    try {
        // Kiểm tra và xử lý dữ liệu đơn hàng (Giữ nguyên)
        const userId = req.user._id; 
        const { customerInfo, orderItems, totalPrice } = req.body;

        if (totalPrice < 1000) {
            return res.status(400).json({ message: 'Tổng tiền phải lớn hơn 1000 VNĐ' });
        }
        
        // ... (Phần tạo đơn hàng tạm trong DB giữ nguyên) ...
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


        const newOrder = new Order({
            customerInfo: customerInfo,
            orderItems: sanitizedOrderItems,
            totalPrice: calculatedTotalPrice,
            paymentMethod: 'VNPAY', // Cập nhật phương thức
            isPaid: false, // Chưa thanh toán
            user: userId
        });

        const savedOrder = await newOrder.save();
        const orderIdTxn = savedOrder._id; // Dùng Order ID làm mã giao dịch
        
        // >>> BƯỚC SỬA LỖI IP <<<
        // Logic lấy IP người dùng: ưu tiên 'x-forwarded-for' (nếu dùng proxy/hosting), 
        // sau đó là địa chỉ kết nối. Nếu không tìm thấy, dùng '127.0.0.1' làm mặc định.
        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress || 
            '127.0.0.1'; // Giá trị mặc định an toàn
        
        // Nếu địa chỉ là IPv6 (::ffff:127.0.0.1), chuyển thành IPv4
        if (ipAddr.includes('::ffff:')) {
            ipAddr = ipAddr.split('::ffff:')[1];
        }
        
        // BƯỚC 2: Cấu hình VNPAY
        const tmnCode = process.env.VNP_TMN_CODE;
        const hashSecret = process.env.VNP_HASH_SECRET;
        const vnpUrl = process.env.VNP_URL;
        const returnUrl = process.env.VNP_RETURN_URL;

        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
        
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn'; 
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderIdTxn.toString(); // Mã giao dịch là Order ID (String)
        vnp_Params['vnp_OrderInfo'] = `Thanh toan don hang ${orderIdTxn}`;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = calculatedTotalPrice * 100; // Số tiền * 100 (đơn vị: xu)
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr; // Đã sửa lỗi: Dùng biến IP đã xử lý
        vnp_Params['vnp_CreateDate'] = createDate;

        // BƯỚC 3: Tạo chữ ký bảo mật (SecureHash)
        vnp_Params = sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha512', hashSecret);
        // Buffer.from(...) đã là cú pháp chính xác (không cần sửa thêm)
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;

        // BƯỚC 4: Sinh ra URL và trả về Frontend
        let paymentUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });
        
        res.status(200).json({ paymentUrl });

    } catch (error) {
        console.error("VNPAY URL creation error:", error);
        res.status(500).json({ message: 'Lỗi server khi tạo URL thanh toán.' });
    }
};

// @desc    Xử lý kết quả trả về từ VNPAY (Callback)
// ... (Hàm vnpayReturn giữ nguyên)
export const vnpayReturn = async (req, res) => {
    try {
        let vnp_Params = req.query;

        let secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        const hashSecret = process.env.VNP_HASH_SECRET;
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha512', hashSecret);
        // Buffer.from(...) đã là cú pháp chính xác (không cần sửa thêm)
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        // Lấy thông tin cần thiết
        const rspCode = vnp_Params['vnp_ResponseCode']; 
        const orderId = vnp_Params['vnp_TxnRef'];       

        // --- Xử lý kết quả ---
        if (secureHash === signed) {
            // Chữ ký hợp lệ
            if (rspCode === '00') {
                // Thanh toán thành công (00)
                const order = await Order.findById(orderId);
                
                if (order && !order.isPaid) {
                     // Cập nhật trạng thái đơn hàng thành Đã thanh toán
                     await Order.findByIdAndUpdate(orderId, { 
                         isPaid: true, 
                         paymentMethod: 'VNPAY',
                         paidAt: new Date(),
                         vnpTransactionId: vnp_Params['vnp_TransactionNo'] 
                     });
                     
                    // Chuyển hướng về Frontend báo thành công
                    return res.redirect(`${process.env.FRONTEND_URL}/dat-hang-thanh-cong?vnpay=success&orderId=${orderId}`);

                } else if (order && order.isPaid) {
                    // Đơn hàng đã được thanh toán trước đó (tránh trùng lặp)
                    return res.redirect(`${process.env.FRONTEND_URL}/dat-hang-thanh-cong?vnpay=success&orderId=${orderId}`);
                }
                
                // Không tìm thấy đơn hàng
                return res.redirect(`${process.env.FRONTEND_URL}/checkout?vnpay=failure&code=04`);

            } else {
                // Thanh toán thất bại (Mã lỗi khác 00)
                // Đơn hàng vẫn giữ trạng thái cũ (isPaid: false)
                return res.redirect(`${process.env.FRONTEND_URL}/checkout?vnpay=failure&code=${rspCode}`);
            }
        } else {
            // Chữ ký không hợp lệ (Lỗi bảo mật)
            return res.redirect(`${process.env.FRONTEND_URL}/checkout?vnpay=failure&code=97`);
        }
    } catch (error) {
        console.error("VNPAY Return Handling Error:", error);
        return res.redirect(`${process.env.FRONTEND_URL}/checkout?vnpay=failure&code=99`);
    }
};