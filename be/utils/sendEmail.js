// be/utils/sendEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (options) => {
    // Tạo đối tượng Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // Sử dụng false cho cổng 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Định nghĩa nội dung email
    const mailOptions = {
        from: `L'ESSENCE <${process.env.EMAIL_USER}>`, 
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;