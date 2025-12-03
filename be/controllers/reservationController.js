import asyncHandler from 'express-async-handler';
import Reservation from '../models/Reservation.js';
import sendEmail from '../utils/sendEmail.js';

// =====================================================================
// HÀM TIỆN ÍCH: Xây dựng nội dung email (HTML)
// =====================================================================
const buildConfirmationEmail = (reservation) => {
    // Xử lý hiển thị ngày giờ an toàn (Fallback nếu thiếu date/time gốc)
    const dateObj = new Date(reservation.reservationDateTime);
    const dateStr = reservation.date || dateObj.toLocaleDateString('vi-VN'); 
    const timeStr = reservation.time || dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    return `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
            <div style="text-align: center; border-bottom: 2px solid #d35400; padding-bottom: 10px; margin-bottom: 20px;">
                <h1 style="color: #d35400; margin: 0;">L'ESSENCE RESTAURANT</h1>
                <p style="margin: 5px 0 0; color: #777;">Tinh hoa ẩm thực</p>
            </div>
            <h2 style="color: #2c3e50;">Xác nhận Đặt Bàn Thành công</h2>
            <p>Xin chào <b>${reservation.name}</b>,</p>
            <p>Chúng tôi đã nhận được yêu cầu đặt bàn của bạn.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #d35400; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Chi tiết đặt bàn:</h3>
                <ul style="list-style-type: none; padding: 0; margin: 0;">
                    <li style="padding: 5px 0;">👤 <strong>Khách hàng:</strong> ${reservation.name}</li>
                    <li style="padding: 5px 0;">📞 <strong>SĐT:</strong> ${reservation.phone}</li>
                    <li style="padding: 5px 0;">📅 <strong>Ngày:</strong> ${dateStr}</li>
                    <li style="padding: 5px 0;">⏰ <strong>Giờ:</strong> ${timeStr}</li>
                    <li style="padding: 5px 0;">👥 <strong>Số khách:</strong> ${reservation.guests} người</li>
                    <li style="padding: 5px 0;">📝 <strong>Ghi chú:</strong> ${reservation.note || 'Không có'}</li>
                </ul>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <p style="font-weight: bold; color: #c0392b; background: #fadbd8; display: inline-block; padding: 10px 20px; border-radius: 50px;">Trạng thái: ĐANG CHỜ DUYỆT</p>
                <p>Nhân viên nhà hàng sẽ sớm liên hệ với bạn để xác nhận đơn đặt bàn này.</p>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #999; text-align: center;">Trân trọng,<br/>L'Essence Team</p>
        </div>
    `;
};

// =====================================================================
// CONTROLLERS
// =====================================================================

// @desc    Tạo đặt bàn mới (Public)
export const createReservation = asyncHandler(async (req, res) => {
    const { name, email, phone, date, time, guests, note } = req.body;

    if (!name || !email || !phone || !date || !time || !guests) {
        return res.status(400).json({ 
            message: 'Vui lòng điền đầy đủ: Tên, Email, SĐT, Ngày, Giờ và Số lượng khách.' 
        });
    }

    const dateTimeString = `${date} ${time}`; 
    const reservationDateTime = new Date(dateTimeString);

    if (isNaN(reservationDateTime.getTime())) {
        return res.status(400).json({ 
            message: 'Định dạng Ngày hoặc Giờ không hợp lệ. Vui lòng kiểm tra lại.' 
        });
    }

    try {
        const reservation = await Reservation.create({
            name, email, phone, guests, note,
            date,                
            time,                
            reservationDateTime, 
            status: 'Pending'
        });

        try {
            const emailContent = buildConfirmationEmail(reservation);
            await sendEmail({
                email: email,
                subject: "Xác nhận yêu cầu đặt bàn tại L'ESSENCE",
                message: emailContent 
            });
        } catch (mailError) {
            console.error("Lỗi gửi email đặt bàn:", mailError);
        }

        res.status(201).json({
            message: 'Đặt bàn thành công. Vui lòng kiểm tra email để nhận thông tin xác nhận.',
            reservation, 
        });

    } catch (error) {
        console.error("Lỗi khi tạo đặt bàn:", error);
        res.status(500).json({ 
            message: error.message || 'Lỗi Server khi tạo đặt bàn.' 
        });
    }
});

// @desc    Lấy tất cả đặt bàn (Admin Only)
export const getAllReservations = asyncHandler(async (req, res) => {
    // Trả về mảng để khớp với Frontend
    const reservations = await Reservation.find({}).sort({ reservationDateTime: -1 });
    res.json(reservations); 
});

// @desc    Lấy chi tiết đặt bàn (Private/Admin)
export const getReservationById = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (reservation) {
        const isAdmin = req.user && (req.user.role === 'admin' || req.user.isAdmin);
        const isOwner = reservation.user && req.user && reservation.user.toString() === req.user._id.toString();

        if (isAdmin || isOwner) {
            res.json(reservation);
        } else {
            res.status(403).json({ message: 'Bạn không có quyền xem thông tin này.' });
        }
    } else {
        res.status(404).json({ message: 'Không tìm thấy đặt bàn.' });
    }
});

// @desc    Cập nhật trạng thái đặt bàn (Admin Only)
export const updateReservationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body; 
    
    if (!status) {
        return res.status(400).json({ message: 'Vui lòng cung cấp trạng thái mới.' });
    }

    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
        reservation.status = status;
        const updatedReservation = await reservation.save();

        // Gửi email thông báo
        if (updatedReservation.email) {
            try {
                let statusColor = '#3498db'; 
                let statusTextVN = status;
                // Map trạng thái sang tiếng Việt
                if (status === 'Confirmed') { statusColor = '#27ae60'; statusTextVN = 'ĐÃ XÁC NHẬN'; }
                else if (status === 'Cancelled') { statusColor = '#e74c3c'; statusTextVN = 'ĐÃ HỦY'; }
                else if (status === 'Completed') { statusColor = '#2c3e50'; statusTextVN = 'HOÀN THÀNH'; }
                else if (status === 'No-show') { statusColor = '#7f8c8d'; statusTextVN = 'KHÁCH KHÔNG ĐẾN'; }

                // 🔥 XỬ LÝ AN TOÀN: Lấy ngày giờ từ reservationDateTime nếu date/time bị thiếu (cho đơn cũ)
                const dateObj = new Date(updatedReservation.reservationDateTime);
                const dateDisplay = updatedReservation.date || dateObj.toLocaleDateString('vi-VN');
                const timeDisplay = updatedReservation.time || dateObj.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});

                const emailMessage = `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                        <h2 style="color: #2c3e50; text-align: center;">Cập nhật Trạng thái Đặt bàn</h2>
                        <p>Xin chào <b>${updatedReservation.name}</b>,</p>
                        <p>Trạng thái đơn đặt bàn ngày <b>${dateDisplay}</b> lúc <b>${timeDisplay}</b> của bạn đã được cập nhật:</p>
                        <div style="text-align: center; padding: 20px; background-color: #f8f9fa; margin: 20px 0;">
                            <span style="font-size: 20px; font-weight: bold; color: white; background-color: ${statusColor}; padding: 10px 30px; border-radius: 5px;">
                                ${statusTextVN}
                            </span>
                        </div>
                        <p>Cảm ơn bạn đã lựa chọn L'Essence!</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                        <p style="font-size: 12px; color: #777; text-align: center;">L'Essence Team</p>
                    </div>
                `;
                
                await sendEmail({
                    email: updatedReservation.email,
                    subject: `Cập nhật trạng thái đặt bàn #${updatedReservation._id}`,
                    message: emailMessage,
                });
                
                // Log để bạn kiểm tra trong Terminal server
                console.log(`✅ Đã gửi mail cập nhật trạng thái ${status} tới ${updatedReservation.email}`);

            } catch (err) {
                console.error("❌ Lỗi gửi mail cập nhật:", err);
            }
        }

        // Trả về kết quả
        res.json({
            message: 'Cập nhật trạng thái thành công.',
            reservation: updatedReservation 
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy đặt bàn.' });
    }
});

// @desc    Xóa đặt bàn (Admin Only)
export const deleteReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
        await reservation.deleteOne();
        res.json({ message: 'Đã xóa đặt bàn thành công.' });
    } else {
        res.status(404).json({ message: 'Không tìm thấy đặt bàn.' });
    }
});