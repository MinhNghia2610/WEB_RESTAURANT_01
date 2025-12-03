import express from 'express';
import { 
    createOrder, 
    getAllOrders, 
    getMyOrders, 
    updateOrderStatus, 
    createPaymentUrl, // Hàm mới
    vnpayReturn       // Hàm mới
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.route('/my-orders').get(protect, getMyOrders);
router.route('/:id').put(protect, admin, updateOrderStatus);
// 1. Route cập nhật trạng thái (Khớp với Frontend gọi .../status)
router.put('/:id/status', protect, admin, updateOrderStatus);

// 2. Route mặc định theo ID (Để dự phòng hoặc dùng cho việc khác)
router.route('/:id').put(protect, admin, updateOrderStatus);

// --- ROUTES VNPAY ---
router.post('/create_payment_url', protect, createPaymentUrl);
router.get('/vnpay_return', vnpayReturn); // Route nhận callback từ VNPay

export default router;