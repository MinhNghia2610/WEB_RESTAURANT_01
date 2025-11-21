import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    // 1. NGƯỜI DÙNG (Khách hàng đã đăng nhập - Optional)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, 
        ref: 'User', 
        index: true // Tối ưu: Index cho việc lọc theo người dùng
    },
    
    // 2. THÔNG TIN KHÁCH HÀNG (REQUIRED)
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true,
        trim: true,
        lowercase: true
    },
    phone: { 
        type: String, 
        required: true,
        trim: true
    },
    
    // 3. THỜI GIAN ĐẶT BÀN (Gộp Date và Time)
    reservationDateTime: { 
        type: Date, 
        required: [true, 'Thời gian đặt bàn là bắt buộc.'],
        index: true // Tối ưu: Index để truy vấn các đặt bàn sắp tới
    },
    guests: { 
        type: Number, 
        required: [true, 'Số lượng khách là bắt buộc.'], 
        min: [1, 'Số lượng khách tối thiểu là 1.'] 
    },

    note: { 
        type: String, 
        default: '',
        maxlength: 300
    },

    // 4. TRẠNG THÁI
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Seated', 'No-show', 'Cancelled'],
        default: 'Pending',
        index: true
    },
    
}, { 
    timestamps: true, // Bao gồm createdAt và updatedAt
    versionKey: false
});

// Cơ chế an toàn để tránh lỗi ghi đè Model khi hot-reload:
// Sử dụng Model đã tồn tại nếu có, nếu không thì tạo mới.
const Reservation = mongoose.models.Reservation 
    ? mongoose.models.Reservation 
    : mongoose.model('Reservation', reservationSchema, 'reservations');

export default Reservation;