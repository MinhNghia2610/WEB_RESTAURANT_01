import React from 'react';
import { Link } from 'react-router-dom'; // <--- Đã thêm import Link

const Navbar = ({ setIsCartOpen, setIsAuthModalOpen, currentPage }) => {

    // Hàm tạo class CSS cho Link để đánh dấu trang hiện tại
    const getLinkClass = (path) => {
        const baseClasses = "hover:text-amber-500 transition duration-300";
        const activeClass = "text-amber-500 font-bold border-b-2 border-amber-500 pb-1"; // Thêm border bottom cho hiệu ứng nổi bật
        const inactiveClass = "text-gray-300";
        
        // Kiểm tra xem path có phải là trang hiện tại không
        return `${baseClasses} ${currentPage === path ? activeClass : inactiveClass}`;
    };

    return (
        <header className="sticky top-0 z-50 bg-gray-900 bg-opacity-95 shadow-lg">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                
                {/* LOGO - Chuyển thành Link về trang chủ */}
                <Link to="/" className="text-2xl font-serif text-amber-500 tracking-wider hover:text-amber-600 transition duration-300">
                    L'ESSENCE
                </Link>

                {/* MENU CHÍNH - Đã chuyển từ <a> sang <Link> */}
                <div className="hidden md:flex space-x-8 text-sm font-medium uppercase">
                    <Link to="/" className={getLinkClass('/')}>
                        Trang Chủ
                    </Link>
                    <Link to="/thuc-don" className={getLinkClass('/thuc-don')}>
                        Thực Đơn
                    </Link>
                    <Link to="/dat-ban" className={getLinkClass('/dat-ban')}>
                        Đặt Bàn
                    </Link>
                    <Link to="/gioi-thieu" className={getLinkClass('/gioi-thieu')}>
                        Giới Thiệu
                    </Link>
                </div>

                {/* CÁC NÚT CHỨC NĂNG (Đăng nhập & Giỏ hàng) - Giữ nguyên là <button> */}
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setIsAuthModalOpen(true)}
                        className="text-gray-300 hover:text-amber-500 transition duration-300 p-2 rounded-full hidden sm:block"
                        aria-label="Đăng nhập"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.938 13.938 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="relative text-gray-300 hover:text-amber-500 transition duration-300 p-2 rounded-full"
                        aria-label="Giỏ hàng"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {/* Ví dụ về số lượng món hàng trong giỏ */}
                        <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            3
                        </span>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
