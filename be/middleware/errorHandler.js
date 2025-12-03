/**
 * @desc Global Error Handler Middleware
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const errorHandler = (err, req, res, next) => {
  // 1. Log lỗi chi tiết trên Server
  console.error("--- Global Error Caught ---");
  console.error(`Path: ${req.path}`);
  console.error(`Method: ${req.method}`);
  console.error(err);
  console.error("---------------------------");

  let statusCode = err.statusCode || 500;
  let message = err.message || "Lỗi máy chủ nội bộ (Internal Server Error)";

  // --- 2. Xử lý các loại lỗi Mongoose cụ thể ---

  // Lỗi ID không hợp lệ (ví dụ: User.findById('12345'))
  if (err.name === 'CastError') {
    message = `Tài nguyên không hợp lệ. ID: ${err.value}`;
    statusCode = 404; // Not Found / Bad Request
  }

  // Lỗi Validation (ví dụ: thiếu required field khi save)
  if (err.name === 'ValidationError') {
    // Tạo chuỗi lỗi từ tất cả các trường bị lỗi
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    statusCode = 400; // Bad Request
  }

  // Lỗi trùng lặp (ví dụ: email đã tồn tại) - Mã lỗi 11000 của MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    message = `Dữ liệu trùng lặp: ${field} đã tồn tại.`;
    statusCode = 409; // Conflict
  }
 
  // Lỗi JWT hết hạn hoặc không hợp lệ (thường đã được xử lý trong authMiddleware,
  // nhưng đây là fallback an toàn)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    message = 'Truy cập bị từ chối. Token không hợp lệ hoặc đã hết hạn.';
    statusCode = 401; // Unauthorized
  }


  // --- 3. Gửi Response cuối cùng ---
  res.status(statusCode).json({
    success: false,
    message: message,
    // Chỉ hiển thị stack trace khi không phải production
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};