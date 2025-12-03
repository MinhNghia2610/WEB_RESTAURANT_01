import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true, 
        trim: true,
        // Tối ưu: Thêm index để tăng tốc tìm kiếm/lọc theo tên
        index: true 
    },
    description: { 
        type: String, 
        default: "",
        maxlength: 500 // Giới hạn độ dài mô tả
    },
    price: { 
        type: Number, 
        required: true, 
        min: [0, 'Giá không thể nhỏ hơn 0.'] 
    },
    category: { 
        type: String, 
        required: true,
        trim: true,
        // Tối ưu: Dùng enum để chuẩn hóa các lựa chọn lọc/tìm kiếm
        enum: ["Main Course", "Starter", "Dessert", "Beverage", "Special"] 
    },
    imageURL: { 
        type: String, 
        default: "/images/placeholder_dish.png" // Thêm giá trị mặc định hình ảnh
    },
    unit: { 
        type: String, 
        default: "VNĐ" 
    },
    itemCode: { 
        type: String, 
        unique: true, 
        sparse: true,
        uppercase: true, // Item code thường viết hoa
        trim: true
    },
    status: { 
        type: String, 
        enum: ["available", "unavailable"], 
        default: "available",
        index: true // Tối ưu: Index cho việc lọc món còn/hết
    },
  },
  { timestamps: true, versionKey: false } // Thêm versionKey: false cho gọn
);

// Tối ưu hóa itemCode generation
dishSchema.pre("save", function (next) {
  // Chỉ tạo itemCode nếu đây là tài liệu mới HOẶC itemCode chưa được cung cấp
  if (this.isNew || !this.itemCode) {
    // Tối ưu: Sử dụng một chuỗi ngẫu nhiên kết hợp với timestamp (ít nguy cơ trùng hơn)
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.itemCode = `DISH-${Date.now().toString().slice(-4)}${randomSuffix}`;
  }
  next();
});

const Dish = mongoose.model("Dish", dishSchema, "menus");
export default Dish;