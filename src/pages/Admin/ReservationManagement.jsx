import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Calendar, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

const ReservationManagement = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [showStats, setShowStats] = useState(true); 

    // =========================================================================
    // 🏆 KHẮC PHỤC LỖI: Lấy Token trực tiếp từ key 'token'
    // =========================================================================
    const getToken = () => {
        // Lấy Token trực tiếp từ key 'token' theo logic của AuthContext.jsx
        return localStorage.getItem('token');
    };
    
    // Đã loại bỏ useMemo(config) vì config nên được tạo lại với Token mới nhất
    // trước mỗi lần fetch.

    useEffect(() => {
        // Kiểm tra xem user đã đăng nhập chưa
        if (!getToken()) {
            console.error("Lỗi: Người dùng chưa đăng nhập. Không thể tải danh sách đặt bàn.");
            setLoading(false);
            return;
        }
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        setLoading(true);
        const token = getToken(); // Lấy Token mới nhất
        
        if (!token) {
            console.error("Lỗi: Token không tồn tại. Yêu cầu đăng nhập.");
            setLoading(false);
            return;
        }

        // Tạo config với Token mới nhất
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            // 💡 SỬA LỖI: Thêm config chứa Authorization Header
            const response = await axios.get('http://localhost:5000/api/reservations', config);
            setReservations(response.data);
            console.log("Tải đặt bàn thành công!");
        } catch (error) {
            console.error("Lỗi fetch:", error);
            // Nếu lỗi 401 (Unauthorized), thông báo cần đăng nhập lại
            if (error.response && error.response.status === 401) {
                alert("Phiên làm việc hết hạn hoặc không có quyền. Vui lòng đăng nhập lại!");
                localStorage.removeItem('token'); 
                localStorage.removeItem('role'); 
                // window.location.href = '/login'; // Chuyển hướng về trang login nếu dùng router
            } else if (error.response && error.response.status === 500) {
                 alert("Lỗi server 500: Lỗi này thường do Backend chưa được thiết lập đúng cách (ví dụ: lỗi Database hoặc lỗi trong Auth Middleware).");
            } else {
                 alert("Lỗi mạng hoặc lỗi server không xác định.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const action = newStatus === 'Confirmed' ? 'DUYỆT' : 'HỦY';
        
        if (!window.confirm(`Bạn chắc chắn muốn ${action} đơn này? Email sẽ được gửi tự động.`)) return;
        
        const token = getToken(); // Lấy Token mới nhất
        if (!token) {
             alert("Không có Token. Vui lòng đăng nhập lại.");
             return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        
        try {
            setReservations(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
            await axios.put(`http://localhost:5000/api/reservations/${id}/status`, { status: newStatus }, config);
            alert(`Đã ${action} thành công và gửi email!`);
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            alert("Lỗi cập nhật trạng thái! Vui lòng kiểm tra console hoặc đăng nhập lại.");
            fetchReservations();
        }
    };

    // --- 1. XỬ LÝ DỮ LIỆU CHO BIỂU ĐỒ (Frontend Logic) ---
    const chartData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const trendData = last7Days.map(date => {
            const dayRes = reservations.filter(r => r.date && r.date.startsWith(date));
            return {
                date: new Date(date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'}),
                count: dayRes.length,
                guests: dayRes.reduce((sum, r) => sum + r.guests, 0)
            };
        });

        const statusCounts = {
            Pending: reservations.filter(r => r.status === 'Pending').length,
            Confirmed: reservations.filter(r => r.status === 'Confirmed').length,
            Cancelled: reservations.filter(r => r.status === 'Cancelled').length,
        };
        const pieData = [
            { name: 'Chờ duyệt', value: statusCounts.Pending },
            { name: 'Đã duyệt', value: statusCounts.Confirmed },
            { name: 'Đã hủy', value: statusCounts.Cancelled },
        ];

        return { trendData, pieData, statusCounts };
    }, [reservations]);

    const COLORS = ['#d97706', '#16a34a', '#dc2626']; // Amber, Green, Red

    // Lọc danh sách bảng
    const filteredList = filterStatus === 'All' 
        ? reservations 
        : reservations.filter(r => r.status === filterStatus);

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-10">
            
            {/* HEADER */}
            <div className="bg-gray-900 text-white shadow-lg border-b-4 border-amber-500">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Đặt Bàn</h1>
                            <p className="text-gray-400 text-sm">Hệ thống quản lý <span className="text-amber-500 font-semibold">L'ESSENCE</span></p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowStats(!showStats)}
                                className="bg-gray-800 hover:bg-gray-700 text-amber-500 px-4 py-2 rounded-lg text-sm font-bold border border-gray-700 transition-all"
                            >
                                {showStats ? 'Ẩn Thống Kê' : 'Hiện Thống Kê'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 -mt-4 space-y-8">

                {/* --- PHẦN THỐNG KÊ (BIỂU ĐỒ) --- */}
                {showStats && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-down">
                        
                        {/* Card 1: Tổng quan số liệu */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
                            <div>
                                <h3 className="text-gray-500 text-xs font-bold uppercase mb-4">Tổng quan hôm nay</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-amber-500 text-white p-2 rounded-full"><Clock size={16}/></div>
                                            <span className="text-gray-700 font-medium">Chờ duyệt</span>
                                        </div>
                                        <span className="text-xl font-bold text-amber-600">{chartData.statusCounts.Pending}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-600 text-white p-2 rounded-full"><CheckCircle size={16}/></div>
                                            <span className="text-gray-700 font-medium">Đã xác nhận</span>
                                        </div>
                                        <span className="text-xl font-bold text-green-600">{chartData.statusCounts.Confirmed}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-gray-400 text-center">Dữ liệu được cập nhật realtime</div>
                        </div>

                        {/* Card 2: Biểu đồ Xu hướng (Area Chart) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                            <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                                <Calendar size={18} className="text-amber-600"/> Xu Hướng Đặt Bàn (7 Ngày)
                            </h3>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData.trendData}>
                                        <defs>
                                            <linearGradient id="colorGuests" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
                                        <XAxis dataKey="date" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                                        <YAxis hide />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff'}}
                                            itemStyle={{color: '#fbbf24'}}
                                        />
                                        <Area type="monotone" dataKey="guests" stroke="#d97706" fillOpacity={1} fill="url(#colorGuests)" name="Số khách" />
                                        <Area type="monotone" dataKey="count" stroke="#4b5563" fill="transparent" name="Số đơn" strokeDasharray="5 5"/>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- PHẦN DANH SÁCH (TABLE) --- */}
                <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
                    {/* Filter Tabs */}
                    <div className="flex border-b border-gray-200 bg-gray-50 p-1 overflow-x-auto">
                        {['All', 'Pending', 'Confirmed', 'Cancelled'].map(status => {
                            const labels = { All: 'Tất cả', Pending: 'Chờ duyệt', Confirmed: 'Đã duyệt', Cancelled: 'Đã hủy' };
                            const isActive = filterStatus === status;
                            return (
                                <button 
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-6 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap
                                        ${isActive 
                                            ? 'bg-white text-amber-600 shadow-sm ring-1 ring-gray-200' 
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                                >
                                    {labels[status]}
                                </button>
                            );
                        })}
                    </div>

                    {/* Table */}
                    {loading ? <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div> : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="p-5 font-semibold">Khách hàng</th>
                            <th className="p-5 font-semibold">Thời gian</th>
                            <th className="p-5 font-semibold text-center">Số khách</th>
                            <th className="p-5 font-semibold">Trạng thái</th>
                            <th className="p-5 font-semibold text-right">Hành động</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {filteredList.length === 0 ? (
                            <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">Không có đơn đặt bàn nào.</td></tr>
                          ) : (
                            filteredList.map((item) => (
                              <tr key={item._id} className="hover:bg-amber-50/30 transition-colors duration-150 group">
                                <td className="p-5">
                                    <div className="font-bold text-gray-900">{item.name}</div>
                                    <div className="text-amber-600 text-xs font-medium mt-1">{item.phone}</div>
                                    {item.note && <div className="mt-2 bg-yellow-50 text-yellow-800 text-xs p-2 rounded border border-yellow-100 max-w-xs">📝 {item.note}</div>}
                                </td>
                                <td className="p-5">
                                    <div className="text-gray-700 font-medium">📅 {new Date(item.date).toLocaleDateString('vi-VN')}</div>
                                    <div className="text-gray-500 text-xs mt-1">⏰ {item.time}</div>
                                </td>
                                <td className="p-5 text-center">
                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 font-bold rounded-full text-xs">
                                        {item.guests}
                                    </span>
                                </td>
                                <td className="p-5">
                                    {item.status === 'Pending' && <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-bold">⏳ Chờ xử lý</span>}
                                    {item.status === 'Confirmed' && <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">✅ Đã duyệt</span>}
                                    {item.status === 'Cancelled' && <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold">❌ Đã hủy</span>}
                                </td>
                                <td className="p-5 text-right">
                                    {item.status === 'Pending' ? (
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => handleStatusChange(item._id, 'Confirmed')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold shadow-sm">Duyệt</button>
                                            <button onClick={() => handleStatusChange(item._id, 'Cancelled')} className="bg-white border border-gray-300 text-gray-600 hover:text-red-600 px-3 py-1.5 rounded text-xs font-bold shadow-sm">Hủy</button>
                                        </div>
                                    ) : item.status === 'Confirmed' ? (
                                        <button onClick={() => handleStatusChange(item._id, 'Cancelled')} className="text-red-400 hover:text-red-600 text-xs underline">Hủy đơn này</button>
                                    ) : <span className="text-gray-300 text-xs">Đã đóng</span>}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationManagement;