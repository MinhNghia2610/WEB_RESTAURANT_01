import express from 'express';
import { getUserCart, updateUserCart } from '../controllers/cartController.js';
// Import middleware bảo vệ để đảm bảo chỉ user đã đăng nhập mới truy cập được
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Gom nhóm các route có cùng đường dẫn '/'
router.route('/')
  .get(protect, getUserCart)    // GET /api/cart - Lấy giỏ hàng về
  .put(protect, updateUserCart); // PUT /api/cart - Cập nhật/Lưu giỏ hàng lên server

export default router;