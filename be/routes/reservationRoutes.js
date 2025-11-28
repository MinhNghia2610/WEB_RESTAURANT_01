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

// 1. SỬA DÒNG IMPORT: adminOnly -> admin
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Khách hàng đặt bàn
router.post("/", createReservation); 

// Admin: Lấy tất cả đặt bàn
// 2. SỬA: adminOnly -> admin
router.get("/", protect, admin, getAllReservations); 

// Private/Admin: Lấy chi tiết đặt bàn (cần kiểm tra quyền truy cập)
router.get("/:id", protect, getReservationById);

// Private/Admin: Cập nhật trạng thái đặt bàn (và gửi mail)
// 3. SỬA: adminOnly -> admin
router.put("/:id/status", protect, admin, updateReservationStatus);

// Private/Admin: Xóa đặt bàn
// 4. SỬA: adminOnly -> admin
router.delete("/:id", protect, admin, deleteReservation); 

export default router;