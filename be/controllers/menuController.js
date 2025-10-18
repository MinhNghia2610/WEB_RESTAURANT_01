// be/controllers/menuController.js
import MenuItem from '../models/MenuModel.js'; 

// Lấy toàn bộ thực đơn (Gom nhóm theo Category)
export const getMenu = async (req, res) => {
    try {
        const menu = await MenuItem.aggregate([
            {
                $group: {
                    _id: "$category", // Gom nhóm theo trường 'category'
                    items: { $push: "$$ROOT" } 
                }
            },
            {
                $project: {
                    _id: 0, 
                    categoryName: "$_id", // Ánh xạ tên danh mục
                    items: 1
                }
            },
            { 
                $sort: { categoryName: 1 } 
            }
        ]);
        
        res.status(200).json({ success: true, data: menu });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Thêm một món ăn mới
export const addMenuItem = async (req, res) => {
    try {
        const newItem = await MenuItem.create(req.body);
        res.status(201).json({ success: true, data: newItem });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};