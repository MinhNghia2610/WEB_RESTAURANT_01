// be/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.cookies?.token;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Không có token, truy cập bị từ chối" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Chỉ admin mới được phép" });
};
