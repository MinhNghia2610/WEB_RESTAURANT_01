// be/routes/reservationRoutes.js
import express from "express";
// CẬP NHẬT: Đổi tên và thêm các hàm mới
import { 
    createReservation, 
    getAllReservations, 
    updateReservationStatus, 
    getReservationById, 
    deleteReservation 
} from "../controllers/reservationController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Khách hàng đặt bàn
router.post("/", createReservation); 

// Admin: Lấy tất cả đặt bàn
router.get("/", protect, adminOnly, getAllReservations); 

// Private/Admin: Lấy chi tiết đặt bàn (cần kiểm tra quyền truy cập)
router.get("/:id", protect, getReservationById);

// Private/Admin: Cập nhật trạng thái đặt bàn (và gửi mail)
router.put("/:id/status", protect, adminOnly, updateReservationStatus);

// Private/Admin: Xóa đặt bàn
router.delete("/:id", protect, adminOnly, deleteReservation); 

export default router;