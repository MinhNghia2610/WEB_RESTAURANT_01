import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, ShoppingCart } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext.jsx'; 

// Thêm setIsAuthModalOpen vào props
const Navbar = ({ setIsCartOpen, setIsAuthModalOpen, currentPage }) => {
    // 1. Lấy trạng thái Auth và hàm logout từ Context
    const { isAuthenticated, userRole, logout } = useAuth();
    
    // Hàm tạo class CSS cho Link để đánh dấu trang hiện tại
    const getLinkClass = (path) => {
        const baseClasses = "hover:text-amber-500 transition duration-300";
        const activeClass = "text-amber-500 font-bold border-b-2 border-amber-500 pb-1"; // Thêm border bottom cho hiệu ứng nổi bật
        const inactiveClass = "text-gray-300";
        
        // Kiểm tra xem path có phải là trang hiện tại không
        return `${baseClasses} ${currentPage === path ? activeClass : inactiveClass}`;
    };

    // Hàm xử lý click đăng nhập để mở Modal (Pop-up)
    const handleLoginClick = () => {
        // Gọi hàm để mở Modal/Pop-up
        if (setIsAuthModalOpen) {
            setIsAuthModalOpen(true);
        } else {
            // Đây là fallback nếu component cha chưa truyền prop này (chỉ xảy ra khi debug)
            console.error("Lỗi: setIsAuthModalOpen prop chưa được truyền. Không thể mở Modal.");
        }
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
                    
                    {/* 👇 THÊM MỤC ĐẶT MÓN ONLINE MỚI 👇 */}
                    <Link to="/dat-mon" className={getLinkClass('/dat-mon')}>
                        <span className="text-red-400 font-extrabold">ĐẶT MÓN ONLINE</span> {/* Dùng class để làm nổi bật */}
                    </Link>
                    {/* 👆 KẾT THÚC THÊM MỤC MỚI 👆 */}

                    <Link to="/dat-ban" className={getLinkClass('/dat-ban')}>
                        Đặt Bàn
                    </Link>
                    <Link to="/gioi-thieu" className={getLinkClass('/gioi-thieu')}>
                        Giới Thiệu
                    </Link>
                    {/* Hiển thị link Admin nếu người dùng là Admin */}
                    {isAuthenticated && userRole === 'admin' && (
                        <Link to="/admin" className={getLinkClass('/admin')}>
                            Quản Lý (Admin)
                        </Link>
                    )}
                </div>

                {/* CÁC NÚT CHỨC NĂNG (Đăng nhập/Đăng xuất & Giỏ hàng) */}
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        // HIỂN THỊ NẾU ĐÃ ĐĂNG NHẬP
                        <>
                            {/* Hiển thị vai trò (Tên người dùng giả lập) */}
                            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-300">
                                <User className="h-5 w-5 text-amber-500"/>
                                <span className="text-amber-300 font-semibold uppercase">{userRole}</span>
                                <span className="text-gray-400">|</span>
                            </div>

                            {/* Nút Đăng Xuất (Logout) */}
                            <button 
                                onClick={logout} // Gọi hàm logout từ Context
                                className="flex items-center text-gray-300 hover:text-red-500 transition duration-300 p-2 rounded-full sm:block font-medium text-sm"
                                aria-label="Đăng xuất"
                            >
                                <LogOut className="h-6 w-6 mr-1" />
                                <span className='hidden lg:block'>Đăng Xuất</span>
                            </button>
                        </>
                    ) : (
                        // HIỂN THỊ NẾU CHƯA ĐĂNG NHẬP
                        <button 
                            onClick={handleLoginClick} // Gọi hàm mở Modal (Pop-up)
                            className="text-gray-300 hover:text-amber-500 transition duration-300 p-2 rounded-full hidden sm:block"
                            aria-label="Đăng nhập"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.938 13.938 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    )}
                    
                    {/* Nút Giỏ hàng (Không thay đổi) */}
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="relative text-gray-300 hover:text-amber-500 transition duration-300 p-2 rounded-full"
                        aria-label="Giỏ hàng"
                    >
                        <ShoppingCart className="h-6 w-6" strokeWidth={2}/>
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