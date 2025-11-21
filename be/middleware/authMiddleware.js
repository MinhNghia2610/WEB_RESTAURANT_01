import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Middleware bảo vệ route (Kiểm tra JWT Token)
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Kiểm tra Token trong Header Authorization
    // Định dạng: "Bearer <token>"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Lấy token từ Header
            token = req.headers.authorization.split(' ')[1];

            // 2. Giải mã Token và lấy User ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Tìm người dùng (Loại bỏ mật khẩu)
            // 💡 QUAN TRỌNG: Chỉ tìm người dùng dựa trên ID trong Token.
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                res.status(401);
                throw new Error('Người dùng không tồn tại.');
            }

            // Gắn thông tin người dùng vào request
            req.user = user;
            
            next();

        } catch (error) {
            console.error(error);
            res.status(401);
            // Dùng throw new Error để lỗi được chuyển tới errorHandler
            throw new Error('Token không hợp lệ hoặc đã hết hạn.');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Không có token, vui lòng đăng nhập.');
    }
});


// Middleware kiểm tra quyền Admin
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403); // Forbidden
        throw new Error('Không có quyền truy cập Admin.');
    }
};