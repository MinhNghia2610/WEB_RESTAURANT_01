import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Middleware bảo vệ route (Kiểm tra JWT Token)
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Tìm user dựa trên ID trong token
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                res.status(401);
                throw new Error('Người dùng không tồn tại.');
            }

            req.user = user;
            next();

        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Token không hợp lệ hoặc đã hết hạn.');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Không có token, vui lòng đăng nhập.');
    }
});

// Middleware kiểm tra quyền Admin
// --- SỬA TÊN TỪ adminOnly THÀNH admin ĐỂ KHỚP VỚI ROUTES ---
export const admin = (req, res, next) => {
    // Lưu ý: Kiểm tra xem Database của bạn lưu là 'role': 'admin' hay 'isAdmin': true
    // Code hiện tại của bạn đang check theo 'role'
    if (req.user && (req.user.role === 'admin' || req.user.isAdmin === true)) { 
        next();
    } else {
        res.status(403); // 403 Forbidden: Không có quyền
        throw new Error('Không có quyền truy cập Admin.');
    }
};