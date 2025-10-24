// be/routes/orderRoutes.js (PHIÊN BẢN HOÀN CHỈNH - CÓ ADMIN)
import express from 'express';
const router = express.Router();

import {
  // Hàm cho User
  createOrder,
  getMyOrders,
  
  // ⭐️ 1. IMPORT THÊM 2 HÀM ADMIN
  getAllOrders,
  updateOrderStatus,

} from '../controllers/orderController.js';

// 2. Import middleware của bạn (Giữ nguyên)
import { protect, adminOnly } from '../middleware/authMiddleware.js';

// ==========================================================
// ⭐️ CÁC ROUTE CHO KHÁCH HÀNG (Giữ nguyên) ⭐️
// ==========================================================

// @route   POST /api/orders
// @desc    Tạo đơn hàng mới
router.post('/', protect, createOrder); 

// @route   GET /api/orders/my-orders
// @desc    Lấy danh sách đơn hàng của user đang đăng nhập
router.get('/my-orders', protect, getMyOrders);

// ==========================================================
// ⭐️ 3. CÁC ROUTE MỚI DÀNH CHO ADMIN ⭐️
// ==========================================================

// @route   GET /api/orders
// @desc    Lấy TẤT CẢ đơn hàng (Admin)
// @access  Private/Admin
router.get('/', protect, adminOnly, getAllOrders);

// @route   PUT /api/orders/:id/status
// @desc    Cập nhật trạng thái đơn hàng (Admin)
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, updateOrderStatus);


export default router;