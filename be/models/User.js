// be/models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },

    password: {
      type: String,
      required: true,
      select: false, // Ẩn password khi query
    },

    passwordResetToken: String,
    passwordResetExpires: Date,

    phone: { type: String, required: true, trim: true },

    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },

    // ---- Giỏ hàng ----
    cart: [
      {
        dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
        name: String,
        price: Number,
        imageURL: String,
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

// ---- HASH PASSWORD TRƯỚC KHI LƯU ----
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---- METHOD KIỂM TRA PASSWORD ----
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
