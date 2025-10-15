import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
// Nếu bạn sử dụng dotenv, hãy đảm bảo JWT_SECRET được tải từ .env
const JWT_SECRET = process.env.JWT_SECRET || "secret_key"; 

// ---------------- REGISTER ----------------
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body; 

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại" });
    
    // LƯU Ý: MẬT KHẨU ĐƯỢC LƯU DƯỚI DẠNG CHUỖI THUẦN (KHÔNG KHUYẾN KHÍCH)
    const newUser = await User.create({ name, email, password, phone }); 

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone, 
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("REGISTER error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm người dùng
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    // 2. KIỂM TRA MẬT KHẨU: So sánh chuỗi trực tiếp vì không dùng hash.
    // ĐÃ SỬA: Thay thế await user.comparePassword(password) bằng so sánh chuỗi đơn giản.
    const isMatch = user.password === password; 
    if (!isMatch) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    // 3. Tạo JWT (Token)
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d", // Token hết hạn sau 1 ngày
    });

    // 4. Gửi phản hồi thành công
    res.status(200).json({
      message: "Đăng nhập thành công",
      token, 
      role: user.role, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};