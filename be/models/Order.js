import mongoose from 'mongoose';

// Đây là Schema cho TỪNG MÓN HÀNG bên trong giỏ hàng
const orderItemSchema = new mongoose.Schema({
  name: { // Tên món (lưu lại phòng trường hợp món ăn bị xóa)
    type: String,
    required: true,
  },
  quantity: { // Số lượng
    type: Number,
    required: true,
    min: 1,
  },
  price: { // Giá (lưu lại tại thời điểm đặt hàng)
    type: Number,
    required: true,
  },
  dish: { // Tham chiếu đến món ăn gốc
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Dish', // Tên Model 'Dish' mà bạn đã tạo
  },
});

// Đây là Schema cho TOÀN BỘ ĐƠN HÀNG
const orderSchema = new mongoose.Schema(
  {
    // 1. NGƯỜI DÙNG (Lấy từ authMiddleware)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Tên Model 'User'
    },
    
    // 2. DANH SÁCH MÓN HÀNG (Sử dụng schema con ở trên)
    orderItems: [orderItemSchema],

    // 3. THÔNG TIN KHÁCH HÀNG (Lấy từ Form)
    customerInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, default: '' },
      note: { type: String, default: '' },
      // (Bạn có thể thêm 'tableNumber' nếu là đặt tại bàn)
    },

    // 4. GIÁ CẢ (Backend sẽ tự tính toán)
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    // 5. TRẠNG THÁI (Giống trong ảnh của bạn)
    status: {
      type: String,
      required: true,
      enum: ['Đang chờ xử lý', 'Đã xác nhận', 'Đã hoàn thành', 'Đã hủy'],
      default: 'Đang chờ xử lý',
    },
    
    // (Chúng ta có thể thêm thông tin thanh toán sau)
    // paymentMethod: { type: String, required: true, default: 'COD' },
    // isPaid: { type: Boolean, required: true, default: false },
    // paidAt: { type: Date },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Mongoose sẽ tự động tìm collection tên là 'orders' (số nhiều của 'Order')
const Order = mongoose.model('Order', orderSchema); 

export default Order;