import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Dish from '../models/Dish.js'; // <-- Import Dish để kiểm tra giá

// ==========================================================
// HÀM CHO KHÁCH HÀNG (GIỮ NGUYÊN)
// ==========================================================

// @desc    Tạo một đơn hàng mới
// @route   POST /api/orders
// @access  Private (Cần đăng nhập)
export const createOrder = asyncHandler(async (req, res) => {
  // 1. Lấy dữ liệu từ body và từ middleware (req.user)
  const { orderItems, customerInfo } = req.body;
  const userId = req.user._id;

  // 2. Kiểm tra xem có món hàng không
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Không có món ăn nào trong giỏ hàng');
  }

  // 3. Lấy ID của tất cả các món ăn
  const dishIds = orderItems.map((item) => item._id);

  // 4. Lấy giá GỐC từ database để đảm bảo an toàn
  const dishesFromDB = await Dish.find({ _id: { $in: dishIds } });

  // 5. Tạo một bản đồ (map) để tra cứu giá
  const priceMap = dishesFromDB.reduce((map, dish) => {
    map[dish._id.toString()] = dish.price;
    return map;
  }, {});

  // 6. Tính toán lại tổng tiền ở Backend
  let calculatedTotalPrice = 0;

  const sanitizedOrderItems = orderItems.map((item) => {
    const realPrice = priceMap[item._id]; // Lấy giá thật
    
    if (!realPrice) {
      res.status(404);
      throw new Error(`Không tìm thấy món ăn với ID: ${item._id}`);
    }

    calculatedTotalPrice += realPrice * item.quantity; // Tính tổng tiền

    return {
      name: item.name,
      quantity: item.quantity,
      price: realPrice, // SỬ DỤNG GIÁ THẬT
      dish: item._id,   // Tham chiếu ID
    };
  });

  // 7. Tạo đối tượng Đơn hàng (Order) mới
  const order = new Order({
    user: userId,
    orderItems: sanitizedOrderItems,
    customerInfo: customerInfo,
    totalPrice: calculatedTotalPrice,
    // Trạng thái (status) sẽ mặc định là 'Đang chờ xử lý'
  });

  // 8. Lưu vào database
  const createdOrder = await order.save();

  // 9. Trả về đơn hàng đã tạo
  res.status(201).json({
    success: true,
    message: 'Đặt hàng thành công!',
    data: createdOrder,
  });
});

// @desc    Lấy các đơn hàng của tôi
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    data: orders,
  });
});


// ==========================================================
// ⭐️ HÀM MỚI DÀNH CHO ADMIN ⭐️
// ==========================================================

// @desc    Lấy TẤT CẢ đơn hàng (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  // Lấy tất cả đơn hàng, sắp xếp mới nhất lên đầu
  // Populate: Lấy kèm thông tin 'name' và 'email' từ 'User' model
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    data: orders,
  });
});


// @desc    Cập nhật trạng thái đơn hàng (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // Lấy trạng thái mới từ body
  const orderId = req.params.id; // Lấy ID từ URL

  // Kiểm tra xem trạng thái gửi lên có hợp lệ không (enum trong Model)
  const validStatuses = ['Đang chờ xử lý', 'Đã xác nhận', 'Đã hoàn thành', 'Đã hủy'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Trạng thái không hợp lệ');
  }

  const order = await Order.findById(orderId);

  if (order) {
    order.status = status;
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