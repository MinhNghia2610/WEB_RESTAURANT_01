import mongoose from 'mongoose';

// Schema cho TỪNG MÓN HÀNG bên trong giỏ hàng
const orderItemSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    trim: true,
  },
  quantity: { 
    type: Number,
    required: true,
    min: [1, 'Số lượng phải ít nhất là 1.'],
  },
  price: { 
    type: Number,
    required: true,
    min: [0, 'Giá phải là số dương.'],
  },
  dish: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Dish', 
  },
}, { 
    _id: false // Tối ưu: Không tạo ID cho sub-document này
});

// Schema cho TOÀN BỘ ĐƠN HÀNG
const orderSchema = new mongoose.Schema(
  {
    // 1. NGƯỜI DÙNG (Khách hàng đã đăng nhập)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, 
      ref: 'User', 
      index: true // Tối ưu: Index cho việc lọc đơn hàng theo người dùng
    },
    
    // 2. DANH SÁCH MÓN HÀNG
    orderItems: {
        type: [orderItemSchema],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'Đơn hàng không được để trống.',
        },
    },

    // 3. THÔNG TIN KHÁCH HÀNG (Dùng cho cả user đã đăng nhập và khách vãng lai)
    customerInfo: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, default: '', trim: true },
      email: { type: String, trim: true }, 
      note: { type: String, default: '', maxlength: 500 },
    },

    // 4. GIÁ CẢ
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
      min: 0,
    },
    
    // 5. TRẠNG THÁI
    status: {
      type: String,
      required: true,
      enum: ['Đang chờ xử lý', 'Đã xác nhận', 'Đang giao hàng', 'Đã hoàn thành', 'Đã hủy'], // Thêm 'Đang giao hàng'
      default: 'Đang chờ xử lý',
      index: true // Tối ưu: Index cho việc lọc đơn hàng theo trạng thái
    },
    
    // 6. THANH TOÁN
    paymentMethod: { 
      type: String, 
      enum: ['COD', 'Banking', 'VNPAY', 'MoMo'], // Thêm MoMo
      default: 'COD' 
    },
    isPaid: { 
      type: Boolean, 
      default: false 
    },
    paidAt: { 
      type: Date 
    },
  },
  {
    timestamps: true, 
    versionKey: false 
  }
);

// --- HOOKS ---

// 1. Tính toán TotalPrice trước khi lưu
orderSchema.pre('save', function(next) {
    if (this.orderItems && this.orderItems.length > 0) {
        // Tính tổng giá trị của tất cả order items
        this.totalPrice = this.orderItems.reduce((acc, item) => 
            acc + (item.price * item.quantity), 0
        );
    }
    next();
});

// 2. Cập nhật paidAt khi isPaid thay đổi thành true
orderSchema.pre('save', function(next) {
    // Chỉ chạy khi tài liệu được sửa đổi và isPaid được chuyển thành true
    if (this.isModified('isPaid') && this.isPaid === true) {
        this.paidAt = Date.now();
    }
    // Nếu isPaid chuyển thành false (ví dụ: hoàn tiền), ta có thể xóa paidAt (optional)
    if (this.isModified('isPaid') && this.isPaid === false) {
        this.paidAt = undefined;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema, 'orders'); // Đặt tên collection rõ ràng

export default Order;