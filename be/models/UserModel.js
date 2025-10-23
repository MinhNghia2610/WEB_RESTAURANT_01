import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true // Loại bỏ khoảng trắng thừa ở đầu và cuối
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, // Đảm bảo email là duy nhất
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true,
    trim: true,
  },
  role: { 
    type: String, 
    enum: ["admin", "customer"],
    default: "customer"
  },
}, { 
    timestamps: true,
    versionKey: false
});


const User = mongoose.model("User", userSchema);

export default User;
