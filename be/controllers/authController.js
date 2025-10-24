// be/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 
import { generateToken } from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js"; 

// =========================================================================
// HÀM ĐĂNG KÝ (Giữ nguyên)
// =========================================================================
export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email đã tồn tại" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, phone });

        const token = generateToken(user._id);
        res.status(201).json({ message: "Đăng ký thành công", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =========================================================================
// HÀM ĐĂNG NHẬP (ĐÃ CẬP NHẬT LOGIC MÃ HÓA CHẬM)
// =========================================================================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });

        let valid = false;
        
        // ******************************************************
        // LOGIC MÃ HÓA CHẬM (LAZY HASHING)
        // ******************************************************
        
        // Kiểm tra xem mật khẩu có phải là mật khẩu cũ (chưa được hash) không.
        // Mật khẩu Bcrypt thường dài hơn 60 ký tự. Nếu ngắn hơn, đó là plaintext.
        if (user.password && user.password.length < 60) { 
            // CASE 1: Mật khẩu là PLAINTEXT (chưa hash)
            
            // 1a. So sánh mật khẩu plaintext
            if (password === user.password) {
                valid = true;
                
                // 1b. MÃ HÓA NGAY LẬP TỨC và LƯU vào DB
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                await user.save(); 
            }

        } else if (user.password) { 
            // CASE 2: Mật khẩu đã được HASH (Mã hóa)
            
            // 2. So sánh mật khẩu hash thông thường
            valid = await bcrypt.compare(password, user.password);
        }
        
        // ******************************************************
        // KẾT THÚC LOGIC MÃ HÓA CHẬM
        // ******************************************************

        if (!valid) return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });

        const token = generateToken(user._id);
        res.status(200).json({ message: "Đăng nhập thành công", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =========================================================================
// HÀM QUÊN MẬT KHẨU (FORGOT PASSWORD) - Giữ nguyên
// =========================================================================
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Luôn trả về thông báo chung để tránh tiết lộ email tồn tại
    if (!user) {
        return res.status(200).json({ message: "Nếu tài khoản tồn tại, một email đặt lại mật khẩu đã được gửi." });
    }

    try {
        // 1. TẠO TOKEN ĐẶT LẠI MẬT KHẨU (Thời hạn 15 phút)
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // 2. TẠO LINK ĐẶT LẠI
        const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
        
        const message = `
            <h1>Yêu cầu đặt lại mật khẩu</h1>
            <p>Xin chào ${user.name},</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào liên kết sau để hoàn tất quá trình:</p>
            <a href="${resetURL}" style="display: inline-block; padding: 10px 20px; background-color: #d63031; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">Đặt lại Mật khẩu của tôi</a>
            <p>Liên kết này sẽ hết hạn sau 15 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        `;

        // 3. GỬI EMAIL
        await sendEmail({
            email: user.email,
            subject: 'Đặt lại Mật khẩu L\'ESSENCE',
            message,
        });

        res.status(200).json({
            message: "Email đặt lại mật khẩu đã được gửi thành công. Vui lòng kiểm tra hộp thư đến của bạn."
        });
    } catch (error) {
        console.error("Lỗi gửi email đặt lại mật khẩu:", error);
        return res.status(500).json({ message: 'Lỗi máy chủ khi gửi email. Vui lòng thử lại sau.' });
    }
};

// =========================================================================
// HÀM ĐẶT LẠI MẬT KHẨU (RESET PASSWORD) - Giữ nguyên
// =========================================================================
export const resetPassword = async (req, res) => {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
        return res.status(400).json({ message: "Dữ liệu đặt lại mật khẩu không đầy đủ." });
    }

    try {
        // 1. XÁC MINH TOKEN (Kiểm tra hết hạn, chữ ký)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 2. TÌM NGƯỜI DÙNG
        const user = await User.findOne({ _id: decoded.id, email: email });

        if (!user) {
            return res.status(400).json({ message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." });
        }
        
        // 3. HASH VÀ CẬP NHẬT MẬT KHẨU MỚI
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save(); 

        res.status(200).json({ message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới." });

    } catch (error) {
        // Lỗi xảy ra khi jwt.verify() thất bại (Token hết hạn, chữ ký sai,...)
        return res.status(400).json({ message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." });
    }
};