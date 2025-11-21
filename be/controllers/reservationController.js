import asyncHandler from 'express-async-handler';
import Reservation from '../models/Reservation.js';
import sendEmail from '../utils/sendEmail.js';

// Hàm helper để xây dựng thông báo đặt bàn
const buildConfirmationEmail = (reservation) => {
    // Nội dung HTML đơn giản hóa
    return `
        <h1>Xác nhận Đặt Bàn Thành công</h1>
        <p>Cảm ơn ${reservation.name}, chúng tôi đã nhận được yêu cầu đặt bàn của bạn.</p>
        <h2>Chi tiết đặt bàn:</h2>
        <ul>
            <li><strong>Tên:</strong> ${reservation.name}</li>
            <li><strong>Email:</strong> ${reservation.email}</li>
            <li><strong>Điện thoại:</strong> ${reservation.phone}</li>
            <li><strong>Ngày:</strong> ${new Date(reservation.date).toLocaleDateString('vi-VN')}</li>
            <li><strong>Giờ:</strong> ${reservation.time}</li>
            <li><strong>Số khách:</strong> ${reservation.guests}</li>
            <li><strong>Ghi chú:</strong> ${reservation.note || 'Không có'}</li>
        </ul>
        <p style="color: red;">Đơn đặt bàn của bạn đang ở trạng thái CHỜ DUYỆT. Chúng tôi sẽ liên hệ để xác nhận trong thời gian sớm nhất.</p>
    `;
};

// @desc   Tạo đặt bàn mới (Public)
// @route POST /api/reservations
export const createReservation = asyncHandler(async (req, res) => {
    const { name, email, phone, date, time, guests, note } = req.body;

    // 💡 KHẮC PHỤC: Sử dụng res.status(400).json() thay vì throw new Error()
    if (!name || !email || !phone || !date || !time || !guests) {
        return res.status(400).json({ 
            message: 'Vui lòng điền đầy đủ Tên, Email, Số điện thoại, Ngày, Giờ và Số lượng khách.' 
        });
    }

    try {
        const reservation = await Reservation.create({
            name, email, phone, date, time, guests, note
        });

        // Gửi email xác nhận cho khách hàng
        const emailContent = buildConfirmationEmail(reservation);
        await sendEmail({
            email: email,
            subject: 'Xác nhận yêu cầu đặt bàn tại L’ESSENCE',
            html: emailContent,
        });

        res.status(201).json({
            message: 'Đặt bàn thành công. Vui lòng kiểm tra email để nhận thông tin xác nhận.',
            reservation,
        });
    } catch (error) {
        // Lỗi Mongoose hoặc lỗi Server khác (Ví dụ: Mongoose Validation, DB connection)
        console.error("Lỗi khi tạo đặt bàn:", error);
        // Chuyển tiếp lỗi để được xử lý bởi errorHandler
        throw new Error(error.message || 'Lỗi Server khi tạo đặt bàn.');
    }
});

// @desc   Lấy tất cả đặt bàn (Admin Only)
// @route GET /api/reservations
export const getAllReservations = asyncHandler(async (req, res) => {
    // Sắp xếp theo ngày tạo mới nhất (createdAt)
    const reservations = await Reservation.find({}).sort({ createdAt: -1 });
    res.json(reservations);
});

// @desc   Lấy chi tiết đặt bàn (Private/Admin)
// @route GET /api/reservations/:id
export const getReservationById = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
        // Kiểm tra quyền: Chỉ chủ sở hữu hoặc Admin mới được xem chi tiết
        if (req.user.role === 'admin' || (reservation.user && reservation.user.toString() === req.user.id.toString())) {
            res.json(reservation);
        } else {
            res.status(403).json({ message: 'Bạn không có quyền truy cập đặt bàn này.' });
        }
    } else {
        res.status(404).json({ message: 'Không tìm thấy đặt bàn.' });
    }
});

// @desc   Cập nhật trạng thái đặt bàn (Admin Only)
// @route PUT /api/reservations/:id/status
export const updateReservationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body; // status: 'Pending', 'Confirmed', 'Cancelled'
    
    if (!status) {
        return res.status(400).json({ message: 'Vui lòng cung cấp trạng thái mới.' });
    }

    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
        reservation.status = status;
        const updatedReservation = await reservation.save();

        // Gửi email thông báo cập nhật trạng thái cho khách hàng (Tùy chọn)
        const emailMessage = `Đơn đặt bàn của bạn cho ngày ${new Date(updatedReservation.date).toLocaleDateString('vi-VN')} đã được cập nhật trạng thái thành: <strong>${status}</strong>.`;
        
        await sendEmail({
            email: updatedReservation.email,
            subject: `Cập nhật trạng thái đặt bàn (${status})`,
            html: emailMessage,
        });

        res.json({
            message: 'Cập nhật trạng thái thành công và đã gửi email thông báo.',
            reservation: updatedReservation
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy đặt bàn.' });
    }
});

// @desc   Xóa đặt bàn (Admin Only)
// @route DELETE /api/reservations/:id
export const deleteReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
        await Reservation.deleteOne({ _id: reservation._id });
        res.json({ message: 'Đặt bàn đã được xóa thành công.' });
    } else {
        res.status(404).json({ message: 'Không tìm thấy đặt bàn.' });
    }
});