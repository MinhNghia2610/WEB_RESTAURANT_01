import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    // 1. NGƯỜI DÙNG (Optional)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, 
        ref: 'User', 
        index: true 
    },
    
    // 2. THÔNG TIN KHÁCH HÀNG
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    
    // 3. THỜI GIAN (QUAN TRỌNG: Thêm date và time để lưu chuỗi gốc)
    date: { type: String, required: true }, // VD: "22/11/2025"
    time: { type: String, required: true }, // VD: "18:30"

    // Trường này dùng để Code xử lý logic (Sort, Filter)
    reservationDateTime: { 
        type: Date, 
        required: [true, 'Thời gian đặt bàn (reservationDateTime) là bắt buộc.'],
        index: true 
    },

    guests: { 
        type: Number, 
        required: [true, 'Số lượng khách là bắt buộc.'], 
        min: [1, 'Số lượng khách tối thiểu là 1.'] 
    },

    note: { type: String, default: '', maxlength: 300 },

    // 4. TRẠNG THÁI
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Seated', 'No-show', 'Cancelled'],
        default: 'Pending',
        index: true
    },
    
}, { 
    timestamps: true, 
    versionKey: false
});

const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);

export default Reservation;