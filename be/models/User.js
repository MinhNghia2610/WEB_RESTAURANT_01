<<<<<<< HEAD
// be/models/User.js

=======
>>>>>>> a9bd4e7433c1fa34ae5dcb508148d7c1b296435c
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; 

const userSchema = new mongoose.Schema(
<<<<<<< HEAD
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { 
      type: String, 
      required: true,
      select: false, 
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    phone: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    } 
    
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

=======
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { 
      type: String, 
      required: true,
      select: false, // Mặc định ẩn password khi query user
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    phone: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },

    // --- 1. THÊM FIELD CART (GIỎ HÀNG) ---
    // Giúp lưu lại giỏ hàng của khách khi họ đăng xuất
    cart: [
      {
        dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }, // ID món ăn
        name: String,       // Lưu tên để hiển thị nhanh
        price: Number,      // Lưu giá
        imageURL: String,   // Lưu ảnh
        quantity: { type: Number, default: 1 }
      }
    ]
    // -------------------------------------
  },
  { timestamps: true, versionKey: false }
);

// Middleware: Mã hóa mật khẩu trước khi lưu (Hash Password)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    } 
    
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- 2. THÊM METHOD KIỂM TRA MẬT KHẨU ---
// (Bắt buộc phải có để AuthController sử dụng khi đăng nhập)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

>>>>>>> a9bd4e7433c1fa34ae5dcb508148d7c1b296435c
const User = mongoose.model("User", userSchema);
export default User;