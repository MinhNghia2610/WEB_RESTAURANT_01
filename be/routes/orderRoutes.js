import express from "express";
import { 
    createOrder, 
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    createPaymentUrl,
    vnpayReturn,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ----------------------------------------------------------------------
// CÁC ROUTE VNPAY PUBLIC (Callback URL phải là Public)
// ----------------------------------------------------------------------

// @route   GET /api/orders/vnpay_return
// @desc    Xử lý kết quả trả về từ VNPAY (Public, VNPAY gọi đến)
router.get("/vnpay_return", vnpayReturn);


// ----------------------------------------------------------------------
// CÁC ROUTE KHÁCH HÀNG (Yêu cầu đăng nhập: protect)
// ----------------------------------------------------------------------

// @route   POST /api/orders
// @desc    Tạo đơn hàng mới (Dùng cho COD/Thanh toán thủ công) (Protect)
router.post("/", protect, createOrder);

// @route   POST /api/orders/create_payment_url
// @desc    Tạo URL thanh toán VNPAY (Protect)
router.post("/create_payment_url", protect, createPaymentUrl);

// @route   GET /api/orders/myorders
// @desc    Xem danh sách đơn hàng của tôi (Protect)
router.get("/myorders", protect, getMyOrders);


// ----------------------------------------------------------------------
// CÁC ROUTE QUẢN LÝ (Yêu cầu Admin: protect, adminOnly)
// ----------------------------------------------------------------------

// @route   GET /api/orders
// @desc    Lấy TẤT CẢ đơn hàng (Admin)
router.get("/", protect, adminOnly, getAllOrders);

// @route   PUT /api/orders/:id/status
// @desc    Cập nhật trạng thái đơn hàng (Admin)
router.put("/:id/status", protect, adminOnly, updateOrderStatus);


export default router;