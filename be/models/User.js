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

const User = mongoose.model("User", userSchema);
export default User;