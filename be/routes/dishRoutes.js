// be/routes/dishRoutes.js
import express from "express";
import {
  getMenu,
  getAllDishes,
  getCategories,
  getDishById,
  addMenuItem,
  updateDish,
  deleteDish,
} from "../controllers/dishController.js";

// 1. IMPORT MIDDLEWARE BẢO VỆ
// ⚠️ QUAN TRỌNG: Phải import là 'admin' (khớp với file authMiddleware.js vừa sửa)
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================================
// ⭐️ ROUTE CÔNG KHAI (CHO KHÁCH HÀNG XEM) ⭐️
// ==========================================================
router.get("/categories", getCategories);
router.get("/full-menu", getMenu);
router.get("/", getAllDishes);
router.get("/:id", getDishById);

// ==========================================================
// ⭐️ ROUTE BẢO VỆ (CHỈ CHO ADMIN) ⭐️
// ==========================================================

// 2. THÊM protect VÀ admin VÀO CÁC ROUTE SAU:
// (Đã đổi tên từ adminOnly -> admin)

// @route   POST /api/dishes
// @desc    Tạo món ăn mới (Admin)
router.post("/", protect, admin, addMenuItem);

// @route   PUT /api/dishes/:id
// @desc    Cập nhật món ăn (Admin)
router.put("/:id", protect, admin, updateDish);

// @route   DELETE /api/dishes/:id
// @desc    Xóa món ăn (Admin)
router.delete("/:id", protect, admin, deleteDish);

export default router;