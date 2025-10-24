// be/routes/authRoutes.js
import express from "express";
// Cần import cả hai hàm mới vào đây
import { register, login, forgotPassword, resetPassword } from "../controllers/authController.js"; 
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// THÊM ROUTES CHO CHỨC NĂNG QUÊN/ĐẶT LẠI MẬT KHẨU
router.post("/forgot-password", forgotPassword); // Endpoint yêu cầu gửi link reset
router.post("/reset-password", resetPassword);   // Endpoint xử lý cập nhật mật khẩu

export default router;