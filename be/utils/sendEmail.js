import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Kiểm tra cấu hình (Debug)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ LỖI: Chưa cấu hình EMAIL_USER hoặc EMAIL_PASS trong file .env");
    return;
  }

  // 2. Tạo transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true cho port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 3. Cấu hình nội dung email
  const message = {
    from: `"L'ESSENCE Restaurant" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    
    // ⚠️ QUAN TRỌNG: Phải gán nội dung vào 'html', KHÔNG gán vào 'text'
    // Nếu gán vào 'text', nó sẽ hiện ra code như hình bạn gửi.
    html: options.message, 
    
    // Fallback: Nếu trình đọc mail không hỗ trợ HTML (rất hiếm), hiện dòng này
    text: "Vui lòng xem email này trên trình duyệt hỗ trợ HTML." 
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