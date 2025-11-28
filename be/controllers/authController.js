import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js"; 
import bcrypt from "bcryptjs"; 
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';
import asyncHandler from 'express-async-handler'; // 💡 QUAN TRỌNG: Cần thư viện này

// =========================================================================
// HÀM REGISTER (Đã bọc trong asyncHandler)
// =========================================================================
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
        // Trả về 409 Conflict hoặc 400 Bad Request
        return res.status(400).json({ message: "Email đã tồn tại. Vui lòng đăng nhập hoặc sử dụng email khác." });
    }

    // Nếu Mongoose Validation thất bại ở đây, asyncHandler sẽ chuyển lỗi đến errorHandler
    const user = await User.create({ name, email, password, phone }); 

    const token = generateToken(user._id);
    
    user.password = undefined; 
    res.status(201).json({ 
        message: "Đăng ký thành công", 
        token, 
        user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
});

// =========================================================================
// HÀM LOGIN (Đã bọc trong asyncHandler)
// =========================================================================
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });

    // Cần .select('+password') nếu bạn có cấu hình `select: false` trong Model
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    
    // Kiểm tra mật khẩu (Giả sử Mongoose có phương thức `matchPassword` hoặc dùng `bcrypt.compare`)
    // Vì bạn không dùng `user.matchPassword`, tôi giữ nguyên `bcrypt.compare`
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });

    const token = generateToken(user._id);
    
    user.password = undefined; 
    
    return res.status(200).json({ 
        message: "Đăng nhập thành công", 
        token, 
        user: { id: user._id, name: user.name, email: user.email, role: user.role, isAdmin: user.isAdmin || false } 
    });
});

// =========================================================================
// HÀM QUÊN MẬT KHẨU (Giữ lại try/catch để xử lý lỗi gửi email và rollback token)
// =========================================================================
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập Email để đặt lại mật khẩu." });
    }

    let user = null; // Khai báo user ở đây để có thể truy cập trong catch block

    try {
        user = await User.findOne({ email });

        if (!user) {
            // Trả về thông báo thành công giả để tránh lộ thông tin email nào tồn tại
            return res.status(200).json({ message: "Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi." });
        }

        // Tạo reset token và lưu vào Database
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash token trước khi lưu vào DB, chỉ lưu phiên bản hash
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 3600000; // Hết hạn sau 1 giờ (3600000 ms)

        await user.save({ validateBeforeSave: false }); 

        // Tạo URL đặt lại mật khẩu trỏ về Frontend
        // 💡 Đảm bảo biến môi trường FRONTEND_URL đã được cấu hình
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`; 
        
        const message = `
            <h1>Yêu cầu đặt lại mật khẩu</h1>
            <p>Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu của bạn:</p>
            <a href="${resetURL}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #f7a01d; color: white; text-decoration: none; border-radius: 5px;">Đặt Lại Mật Khẩu</a>
            <p style="margin-top: 20px;">Hoặc sử dụng liên kết: ${resetURL}</p>
            <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
            <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
        `;

        await sendEmail({
            email: user.email,
            subject: 'Đặt lại Mật khẩu Nhà hàng L’ESSENCE',
            message: message,
            html: message // Gửi HTML thay vì message
        });

        res.status(200).json({
            message: "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư."
        });

    } catch (err) {
        // Nếu có lỗi, rollback (xóa) token để người dùng có thể thử lại
        if (user) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
        }
        console.error("🛑 LỖI SERVER QUÊN MẬT KHẨU:", err);
        // Chuyển lỗi này cho errorHandler xử lý (thay vì tự trả về 500)
        // Nếu bạn muốn giữ nguyên 500: return res.status(500).json({ message: "Lỗi Server trong quá trình gửi email." });
        throw new Error('Lỗi trong quá trình xử lý Quên Mật khẩu.');
    }
};

// =========================================================================
// HÀM ĐẶT LẠI MẬT KHẨU (Đã bọc trong asyncHandler)
// =========================================================================
export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params; // Token từ URL
    const { password } = req.body; // Mật khẩu mới

    if (!password) {
        return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới." });
    }

    // 1. Hash token nhận được từ URL
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 2. Tìm người dùng bằng hashed token và đảm bảo token chưa hết hạn
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() } 
    });

    if (!user) {
        return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
    
    // 3. Cập nhật mật khẩu và xóa token
    user.password = password; // Sẽ được hash bởi middleware pre('save')
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save(); // Chạy middleware pre('save') để hash mật khẩu

    // 4. Tự động đăng nhập người dùng 
    const authToken = generateToken(user._id);

    res.status(200).json({
        message: "Đặt lại mật khẩu thành công. Bạn đã được đăng nhập.",
        token: authToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, isAdmin: user.isAdmin || false }
    });
});