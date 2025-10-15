import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  
  role: { 
    type: String, 
    enum: ["admin", "customer"],
    default: "customer"
  },
}, { 
    timestamps: true,
    versionKey: false
});


export default mongoose.model("User", userSchema);