import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
    // Đảm bảo JWT_SECRET có giá trị trong file .env
    return jwt.sign({ id: userId }, process.env['JWT_SECRET'], { expiresIn: "7d" });
};