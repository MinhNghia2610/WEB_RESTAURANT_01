// models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", userSchema);
export default User;