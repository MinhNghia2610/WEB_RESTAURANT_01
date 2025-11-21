import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

// Giả định: Các model đã được import đúng đường dẫn
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';
import Order from '../models/Order.js'; 
import Dish from '../models/Dish.js'; 


// @desc    Lấy số liệu thống kê tổng quan (Dashboard)
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getSummaryData = asyncHandler(async (req, res) => {
    // --- BẮT ĐẦU VỚI TRY/CATCH ĐỂ BẮT LỖI 500 ---
    try {
        // 1. Đếm số lượng người dùng và món ăn
        const totalCustomers = await User.countDocuments({});
        const totalDishes = await Dish.countDocuments({}); 

        // 2. Đếm số lượng đặt bàn và đặt bàn chờ xử lý
        const totalReservations = await Reservation.countDocuments({});
        // >> KIỂM TRA LỖI 500: Đảm bảo tên trường `status` và giá trị `'Chờ duyệt'` là đúng
        const pendingReservations = await Reservation.countDocuments({ status: 'Chờ duyệt' }); 

        // 3. Tính tổng Doanh thu và tổng Đơn hàng (dựa trên các đơn hàng ĐÃ THANH TOÁN)
        const revenueStats = await Order.aggregate([
            // >> KIỂM TRA LỖI 500: Đảm bảo tên trường `isPaid` là đúng
            { $match: { isPaid: true } }, 
            { 
                $group: {
                    _id: null,
                    // >> KIỂM TRA LỖI 500: Đảm bảo tên trường `totalPrice` là đúng
                    totalRevenue: { $sum: '$totalPrice' }, 
                    totalOrders: { $sum: 1 }, 
                }
            }
        ]);

        const totalRevenue = revenueStats[0]?.totalRevenue || 0;
        const totalOrders = revenueStats[0]?.totalOrders || 0;

        // 4. Lấy các đặt bàn mới nhất
        const recentReservations = await Reservation.find({})
            .sort({ createdAt: -1 }) 
            .limit(8)
            .select('name phone date time guests status createdAt'); 
            
        // 5. Trả về dữ liệu
        res.json({
            success: true,
            stats: { 
                revenue: totalRevenue, 
                orders: totalOrders, 
                customers: totalCustomers,
                reservations: totalReservations,
                dishes: totalDishes,
                pendingReservations: pendingReservations,
            },
            recentReservations: recentReservations
        });
    } catch (error) {
        console.error('Lỗi khi tải thống kê Dashboard (Summary):', error);
        // Trả về lỗi 500 để client biết có vấn đề ở server
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tải dữ liệu tổng quan.', error: error.message });
        // Không cần throw new Error trong asyncHandler nếu đã dùng res.status(500)
    }
});


// @desc    Lấy DỮ LIỆU BÁO CÁO & BIỂU ĐỒ cho Dashboard bằng Aggregation
// @route   GET /api/dashboard/reports
// @access  Private/Admin
export const getReportsData = asyncHandler(async (req, res) => {
    // --- BẮT ĐẦU VỚI TRY/CATCH ĐỂ BẮT LỖI TỪ AGGREGATE ---
    try {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        // --- 1. Doanh thu theo ngày (30 ngày gần nhất) ---
        const revenueByDate = await Order.aggregate([
            { $match: { 
                // >> KIỂM TRA LỖI 500: Đảm bảo `isPaid` và `createdAt` là đúng
                isPaid: true, 
                createdAt: { $gte: thirtyDaysAgo } 
            }},
            { $group: {
                _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } }, 
                // >> KIỂM TRA LỖI 500: Đảm bảo `totalPrice` là đúng
                total: { $sum: '$totalPrice' } 
            }},
            { $sort: { _id: 1 } } 
        ]);
        
        // --- 2. Thống kê trạng thái Đơn hàng (Pie Chart) ---
        const orderStatusStats = await Order.aggregate([
            // >> KIỂM TRA LỖI 500: Đảm bảo tên trường `status` là đúng
            { $group: {
                _id: '$status', 
                count: { $sum: 1 } 
            }},
            { $project: {
                _id: '$_id',
                count: 1
            }}
        ]);

        // --- 3. Top Món Ăn Bán Chạy (Bar Chart) ---
        const topDishes = await Order.aggregate([
            // >> KIỂM TRA LỖI 500: Đảm bảo `isPaid` là đúng
            { $match: { isPaid: true } }, 
            // >> KIỂM TRA LỖI 500: Đảm bảo tên mảng món ăn `orderItems` là đúng
            { $unwind: '$orderItems' }, 
            { $group: {
                // >> KIỂM TRA LỖI 500: Đảm bảo tên trường `orderItems.name` và `orderItems.qty` là đúng
                _id: '$orderItems.name', 
                count: { $sum: '$orderItems.qty' } 
            }},
            { $sort: { count: -1 } }, 
            { $limit: 5 } 
        ]);

        // --- 4. Xu hướng Đặt Bàn (30 ngày gần nhất) ---
        const reservationTrend = await Reservation.aggregate([
            // >> KIỂM TRA LỖI 500: Đảm bảo `createdAt` là đúng
            { $match: { createdAt: { $gte: thirtyDaysAgo } }},
            { $group: {
                _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
                // Giả định trường số lượng khách là `guests`
                count: { $sum: '$guests' } 
            }},
            { $sort: { _id: 1 } }
        ]);

        // Trả về đối tượng chứa TẤT CẢ các dữ liệu báo cáo
        res.json({
            success: true,
            revenueByDate,
            topDishes,
            orderStatusStats,
            reservationTrend,
        });
    } catch (error) {
        console.error('Lỗi khi tải báo cáo Dashboard (Reports):', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tải dữ liệu báo cáo.', error: error.message });
    }
});