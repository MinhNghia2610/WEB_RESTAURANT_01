import express from "express";
import { 
    getSummaryData,
    getReportsData, 
} from "../controllers/dashboardController.js"; 
// 1. SỬA DÒNG NÀY: adminOnly -> admin
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 2. SỬA CÁC DÒNG DƯỚI: adminOnly -> admin

// 1. Endpoint lấy DỮ LIỆU TỔNG QUAN (Stats)
// URL: /api/dashboard/stats
router.route('/stats')
    .get(protect, admin, getSummaryData);

// 2. Endpoint lấy DỮ LIỆU BÁO CÁO & BIỂU ĐỒ (Reports)
// URL: /api/dashboard/reports
router.route('/reports') 
    .get(protect, admin, getReportsData);

export default router;