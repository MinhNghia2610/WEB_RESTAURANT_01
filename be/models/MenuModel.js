// be/models/MenuModel.js (Phiên bản PHẲNG đã sửa lỗi Collection Name)
import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true }, // Tên danh mục (ví dụ: "Khai Vị")
    imageURL: { type: String, default: '' },
    unit: { type: String, default: 'VNĐ' }, 
    itemCode: { type: String, unique: true }, 
    status: { type: String, default: 'available' }
}, {
    timestamps: true
});

// THAY ĐỔI TẠI ĐÂY: Dòng cuối cùng của file
// Tham số thứ 3 là tên Collection chính xác trong DB: 'menus'
const MenuItem = mongoose.model('MenuItem', MenuItemSchema, 'menus'); 
export default MenuItem;