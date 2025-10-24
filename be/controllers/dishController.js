// be/controllers/dishController.js

import Dish from "../models/Dish.js";

// Lấy menu gom theo category (Giữ nguyên)
export const getMenu = async (req, res) => {
  try {
    const menu = await Dish.aggregate([
      { $match: {} },
      { $group: { _id: "$category", items: { $push: "$$ROOT" } } },
      { $project: { _id: 0, categoryName: "$_id", items: 1 } },
      { $sort: { categoryName: 1 } },
    ]);
    res.status(200).json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================================
// ⭐️ HÀM MỚI (BỊ THIẾU): Chỉ lấy danh sách các danh mục
// ==========================================================
export const getCategories = async (req, res) => {
  try {
    // Lấy tất cả các giá trị 'category' duy nhất từ collection
    const categories = await Dish.find().distinct("category");
    res.status(200).json({ success: true, data: categories.sort() }); // Sắp xếp A-Z
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================================
// ⭐️ HÀM ĐÃ SỬA: Lấy tất cả món ăn (có thể lọc)
// ==========================================================
export const getAllDishes = async (req, res) => {
  try {
    // 1. Tạo một đối tượng 'filter' rỗng
    const filter = {};

    // 2. Lấy 'category' từ query string (ví dụ: /api/dishes?category=Khai Vị)
    const { category } = req.query;

    // 3. Nếu có category, thêm nó vào đối tượng filter
    if (category) {
      filter.category = category;
    }
    
    // 4. Truyền filter vào Dish.find()
    const dishes = await Dish.find(filter).sort({ name: 1 });

    res.status(200).json({ success: true, data: dishes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- CÁC HÀM KHÁC GIỮ NGUYÊN ---

export const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ message: "Không tìm thấy món" });
    res.status(200).json(dish);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMenuItem = async (req, res) => {
  try {
    const newItem = await Dish.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateDish = async (req, res) => {
  try {
    const updated = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy món" });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const deleted = await Dish.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy món" });
    res.status(200).json({ message: "Xóa món thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};