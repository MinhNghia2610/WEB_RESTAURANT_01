// be/routes/dishRoutes.js (ĐÃ ĐƯỢC BẢO VỆ)
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
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================================
// ⭐️ ROUTE CÔNG KHAI (CHO KHÁCH HÀNG XEM) ⭐️
// ==========================================================
// Các route này không cần 'protect' vì ai cũng được xem thực đơn
router.get("/categories", getCategories);
router.get("/full-menu", getMenu);
router.get("/", getAllDishes);
router.get("/:id", getDishById);

// ==========================================================
// ⭐️ ROUTE BẢO VỆ (CHỈ CHO ADMIN) ⭐️
// ==========================================================

// 2. THÊM protect VÀ adminOnly VÀO CÁC ROUTE SAU:

// @route   POST /api/dishes
// @desc    Tạo món ăn mới (Admin)
router.post("/", protect, adminOnly, addMenuItem);

// @route   PUT /api/dishes/:id
// @desc    Cập nhật món ăn (Admin)
router.put("/:id", protect, adminOnly, updateDish);

// @route   DELETE /api/dishes/:id
// @desc    Xóa món ăn (Admin)
router.delete("/:id", protect, adminOnly, deleteDish);

export default router;