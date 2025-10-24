// src/components/UserComponents/Navbar.jsx (ĐÃ THÊM LINK LỊCH SỬ ĐƠN HÀNG)

import React from 'react';
import { Link } from 'react-router-dom';
// ⭐️ 1. IMPORT ICON MỚI
import { LogOut, User, ShoppingBag, ClipboardList } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext.jsx'; 
import { useCart } from '../../context/CartContext.jsx'; 

const Navbar = ({ setIsAuthModalOpen, currentPage }) => {
    const { isAuthenticated, userRole, logout } = useAuth();
    const { itemCount, openCart } = useCart();

    const getLinkClass = (path) => {
        const baseClasses = "hover:text-amber-500 transition duration-300";
        const activeClass = "text-amber-500 font-bold border-b-2 border-amber-500 pb-1";
        const inactiveClass = "text-gray-300";
        return `${baseClasses} ${currentPage === path ? activeClass : inactiveClass}`;
    };

    const handleLoginClick = () => {
        if (setIsAuthModalOpen) {
            setIsAuthModalOpen(true);
        } else {
            console.error("Lỗi: setIsAuthModalOpen prop chưa được truyền.");
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-gray-900 bg-opacity-95 shadow-lg">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                
                {/* LOGO (Giữ nguyên) */}
                <Link to="/" className="text-2xl font-serif text-amber-500 tracking-wider hover:text-amber-600 transition duration-300">
                    L'ESSENCE
                </Link>

                {/* MENU CHÍNH (Giữ nguyên) */}
                <div className="hidden md:flex space-x-8 text-sm font-medium uppercase">
                    <Link to="/" className={getLinkClass('/')}>Trang Chủ</Link>
                    <Link to="/thuc-don" className={getLinkClass('/thuc-don')}>Thực Đơn</Link>
                    <Link to="/dat-mon-online" className={getLinkClass('/dat-mon-online')}> 
                        <span className="text-red-400 font-extrabold">ĐẶT MÓN ONLINE</span>
                    </Link>
                    <Link to="/dat-ban" className={getLinkClass('/dat-ban')}>Đặt Bàn</Link>
                    <Link to="/gioi-thieu" className={getLinkClass('/gioi-thieu')}>Giới Thiệu</Link>
                    {isAuthenticated && userRole === 'admin' && (
                        <Link to="/admin" className={getLinkClass('/admin')}>
                            Quản Lý (Admin)
                        </Link>
                    )}
                </div>

                {/* CÁC NÚT CHỨC NĂNG */}
                <div className="flex items-center space-x-4">
                    
                    {/* NÚT GIỎ HÀNG (Giữ nguyên) */}
                    <button
                        onClick={openCart} 
                        className="relative text-gray-300 hover:text-amber-500 transition-colors"
                        aria-label="Mở giỏ hàng"
                    >
                        <ShoppingBag className="h-6 w-6" />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white text-xs
                                             font-bold rounded-full flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    {isAuthenticated ? (
                        // ĐÃ ĐĂNG NHẬP
                        <>
                            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-300">
                                <User className="h-5 w-5 text-amber-500"/>
                                <span className="text-amber-300 font-semibold uppercase">{userRole}</span>
                                {/* ⭐️ 2. XÓA DẤU GẠCH ĐỨNG ( | ) để có thêm không gian */}
                            </div>

                            {/* ⭐️ 3. THÊM LINK LỊCH SỬ ĐƠN HÀNG */}
                            <Link 
                                to="/lich-su-don-hang"
                                className="flex items-center text-gray-300 hover:text-amber-500 transition duration-300 p-2 rounded-full sm:block font-medium text-sm"
                                aria-label="Lịch sử đơn hàng"
                            >
                                <ClipboardList className="h-6 w-6 mr-1" />
                                <span className='hidden lg:block'>Đơn hàng</span>
                            </Link>

                            {/* Nút Đăng xuất (Giữ nguyên) */}
                            <button 
                                onClick={logout}
                                className="flex items-center text-gray-300 hover:text-red-500 transition duration-300 p-2 rounded-full sm:block font-medium text-sm"
                                aria-label="Đăng xuất"
                            >
                                <LogOut className="h-6 w-6 mr-1" />
                                <span className='hidden lg:block'>Đăng Xuất</span>
                            </button>
                        </>
                    ) : (
                        // CHƯA ĐĂNG NHẬP (Giữ nguyên)
                        <button 
                            onClick={handleLoginClick} 
                            className="text-gray-300 hover:text-amber-500 transition duration-300 p-2 rounded-full hidden sm:block"
                            aria-label="Đăng nhập"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.938 13.938 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;