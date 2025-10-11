import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { LogOut } from 'lucide-react'; // Thêm icon Đăng xuất
import { useAuth } from '../../context/AuthContext.jsx'; // Thêm useAuth

const navItems = [
    { name: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { name: 'Quản lý Đặt bàn', icon: '🗓️', path: '/admin/reservations' },
    { name: 'Quản lý Thực đơn', icon: '🍽️', path: '/admin/menu' },
    { name: 'Quản lý Đơn hàng', icon: '🧾', path: '/admin/orders' },
    { name: 'Báo cáo & Thống kê', icon: '📈', path: '/admin/reports' },
    { name: 'Cài đặt', icon: '⚙️', path: '/admin/settings' },
];

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Khởi tạo useNavigate (Giữ lại để đảm bảo không có lỗi tham chiếu)
    const { logout } = useAuth(); // Lấy hàm logout từ Context

    const handleLogout = () => {
        // Chỉ cần gọi logout(). Logic chuyển hướng về '/auth' đã nằm trong AuthContext.jsx
        logout(); 
    };

    return (
        <div className="flex flex-col w-64 bg-gray-800 text-white min-h-screen fixed top-0 left-0 z-20">
            {/* Logo/Tên dự án */}
            <div className="flex items-center justify-center h-16 bg-gray-900 shadow-lg">
                <span className="text-xl font-extrabold uppercase tracking-wider text-yellow-400">
                    L'ESSENCE Admin
                </span>
            </div>
            
            {/* Thanh điều hướng */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link 
                        key={item.name}
                        to={item.path} 
                        // Đánh dấu mục đang hoạt động (active link)
                        className={`
                            flex items-center p-3 rounded-lg transition duration-150 text-base
                            ${location.pathname.startsWith(item.path) // Dùng startsWith để xử lý các path con (ví dụ: /admin/dashboard/metrics)
                                ? 'bg-yellow-500 text-gray-900 font-semibold' 
                                : 'hover:bg-gray-700 text-gray-300'
                            }
                        `}
                    >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>
            
            {/* Đăng xuất */}
            <div className="p-4 border-t border-gray-700">
                <button 
                    onClick={handleLogout} // Gắn hàm xử lý đăng xuất
                    className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition duration-150 font-medium"
                >
                    <LogOut className="mr-3 h-5 w-5" /> 
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
