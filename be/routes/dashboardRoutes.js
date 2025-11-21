import express from "express";
import { 
    getSummaryData,
    // Đổi tên hàm để khớp với việc lấy NHIỀU loại báo cáo
    getReportsData, 
} from "../controllers/dashboardController.js"; 
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Endpoint lấy DỮ LIỆU TỔNG QUAN (Stats)
// URL: /api/dashboard/stats
router.route('/stats')
    .get(protect, adminOnly, getSummaryData);

// 2. Endpoint lấy DỮ LIỆU BÁO CÁO & BIỂU ĐỒ (Reports)
// URL: /api/dashboard/reports  <-- Đã khớp với Frontend
router.route('/reports') 
    .get(protect, adminOnly, getReportsData);

export default router;