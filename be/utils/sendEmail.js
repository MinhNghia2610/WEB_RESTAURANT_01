import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Kiểm tra biến môi trường (Debug)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ LỖI: Chưa cấu hình EMAIL_USER hoặc EMAIL_PASS trong file .env");
    return;
  }

  // 2. Tạo transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER, // Đã sửa cho khớp với .env của bạn
      pass: process.env.EMAIL_PASS, // Đã sửa cho khớp với .env của bạn
    },
  });

  // 3. Cấu hình email
  const message = {
    from: `"L'ESSENCE Restaurant" <${process.env.EMAIL_USER}>`,
    to: options.email, 
    subject: options.subject,
    html: options.message, 
  };

  // 4. Gửi email
  try {
    const info = await transporter.sendMail(message);
    console.log('✅ Email đã gửi thành công: %s', info.messageId);
  } catch (error) {
    console.error("❌ Lỗi khi gửi email:", error);
  }
};

export default sendEmail;