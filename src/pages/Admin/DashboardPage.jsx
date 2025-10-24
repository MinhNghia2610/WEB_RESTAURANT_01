// src/pages/Admin/DashboardPage.jsx
import React from 'react';

// Component Thẻ KPI đơn giản
const KPICard = ({ title, value, change, icon, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-${color}-500 transition hover:shadow-xl`}>
        <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
            <span className={`text-xl font-bold text-${color}-500`}>{icon}</span>
        </div>
        <div className="mt-1 flex items-baseline">
            <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
            <span className={`ml-2 text-sm font-semibold text-${change.startsWith('+') ? 'green' : 'red'}-600`}>
                {change}
            </span>
        </div>
    </div>
);


const DashboardPage = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-900">📊 Dashboard Tổng quan</h1>
            
            {/* Hàng KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                    title="Doanh thu Hôm nay" 
                    value="25,500,000đ" 
                    change="+12.5%" 
                    icon="💰" 
                    color="green" 
                />
                <KPICard 
                    title="Số lượng Đặt bàn" 
                    value="18" 
                    change="+3" 
                    icon="🗓️" 
                    color="yellow" 
                />
                <KPICard 
                    title="Khách hàng Mới" 
                    value="45" 
                    change="+5%" 
                    icon="👤" 
                    color="blue" 
                />
                <KPICard 
                    title="Món bán chạy" 
                    value="Bò Wellington" 
                    change="" 
                    icon="⭐" 
                    color="indigo" 
                />
            </div>
            
            {/* Biểu đồ và Bảng tóm tắt */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Biểu đồ Doanh thu (Column 1 & 2) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg h-96">
                    <h2 className="text-xl font-semibold mb-4">Biểu đồ Doanh thu 7 ngày qua (Tĩnh)</h2>
                    {/* Khu vực placeholder cho biểu đồ */}
                    <div className="text-center text-gray-400 h-2/3 flex items-center justify-center border border-dashed p-4">
                        [Placeholder cho Biểu đồ Line Chart]
                    </div>
                </div>

                {/* Danh sách Đặt bàn gần nhất (Column 3) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">🗓️ Đặt bàn Cần Xác nhận</h2>
                    <ul className="space-y-3">
                        {['19:00 - A. Dũng (4 khách)', '20:00 - C. Ngọc (2 khách)'].map((item, index) => (
                            <li key={index} className="flex justify-between items-center border-b pb-2 text-gray-700">
                                <span>{item}</span>
                                <button className="text-xs text-yellow-600 hover:text-yellow-800">Xem chi tiết</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;