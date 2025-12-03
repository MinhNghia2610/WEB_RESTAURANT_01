import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; 
import { 
    LogOut, 
    LayoutDashboard, 
    CalendarClock, 
    BookMarked, 
    ClipboardList, 
    Settings 
} from 'lucide-react';

// THAY ĐỔI: Đã xóa mục 'Báo cáo' khỏi danh sách này
const navItems = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
  { name: 'Đặt bàn', icon: <CalendarClock size={20} />, path: '/admin/reservations' },
  { name: 'Thực đơn', icon: <BookMarked size={20} />, path: '/admin/menu' },
  { name: 'Đơn hàng', icon: <ClipboardList size={20} />, path: '/admin/orders' },
  // { name: 'Báo cáo', icon: <BarChart3 size={20} />, path: '/admin/reports' }, <-- Đã xóa dòng này
  // { name: 'Cài đặt', icon: <Settings size={20} />, path: '/admin/settings' },
];

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth(); 

    const handleLogout = () => {
        logout(); 
    };

    return (
        <div className="flex flex-col w-64 bg-gray-800 text-white min-h-screen fixed top-0 left-0 z-20 border-r border-gray-700">
            {/* Logo/Tên dự án */}
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <span className="text-xl font-bold uppercase tracking-wider text-amber-500 font-serif">
                    L'ESSENCE ADMIN
                </span>
            </div>
            
            {/* Thanh điều hướng */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link 
                        key={item.name}
                        to={item.path} 
                        className={`
                            flex items-center p-3 rounded-lg transition duration-150
                            ${location.pathname.startsWith(item.path)
                                ? 'bg-amber-600 text-gray-900 font-bold'
                                : 'hover:bg-gray-700 text-gray-300'
                            }
                        `}
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>
            
            {/* Đăng xuất */}
            <div className="p-4 border-t border-gray-700">
                <button 
                    onClick={handleLogout} A
                    className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-red-700 hover:text-white transition duration-150 font-medium"
                >
                    <LogOut className="mr-3 h-5 w-5" /> 
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default Sidebar;