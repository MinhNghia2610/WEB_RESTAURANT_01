// be/routes/menuRoutes.js
import express from 'express';
import { getMenu, addMenuItem } from '../controllers/menuController.js'; 

const router = express.Router();

// Lấy toàn bộ thực đơn
router.get('/', getMenu);

// Thêm một món ăn mới
router.post('/item', addMenuItem); 

export default router;