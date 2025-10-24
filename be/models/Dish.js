// be/models/Dish.js (Dán code này vào)

import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    imageURL: { type: String, default: "" },
    unit: { type: String, default: "VNĐ" },
    itemCode: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ["available", "unavailable"], default: "available" },
  },
  { timestamps: true }
);

// optional: auto-generate itemCode if not provided
dishSchema.pre("save", function (next) {
  if (!this.itemCode) {
    this.itemCode = `ITEM-${Date.now().toString().slice(-6)}`;
  }
  next();
});

const Dish = mongoose.model("Dish", dishSchema, "menus");
export default Dish;