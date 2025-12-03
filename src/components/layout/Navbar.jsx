import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, ShoppingBag, ClipboardList, Menu, X } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext.jsx'; 
import { useCart } from '../../context/CartContext.jsx'; 

const Navbar = ({ setIsAuthModalOpen }) => {
  const { isAuthenticated, userRole, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Hiệu ứng đổi màu Navbar khi cuộn
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper: Class cho Link
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
      isActive ? 'text-amber-500' : 'text-gray-300 hover:text-white'
    }`;
  };

  // Helper: Dấu gạch chân dưới Link khi active
  const ActiveIndicator = ({ path }) => {
    return location.pathname === path ? (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] transform scale-x-100 transition-transform duration-300"></span>
    ) : (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
    );
  };

  const handleLoginClick = () => {
    if (setIsAuthModalOpen) setIsAuthModalOpen(true);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-amber-500/20 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        {/* 1. LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 border-2 border-amber-500 rounded-full flex items-center justify-center group-hover:bg-amber-500 transition-all duration-500">
                <span className="font-serif text-xl font-bold text-amber-500 group-hover:text-gray-900">L</span>
            </div>
            <span className="text-2xl font-serif font-bold text-white tracking-widest group-hover:text-amber-500 transition-colors">
                L'ESSENCE
            </span>
        </Link>

        {/* 2. DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={getLinkClass('/')}>
                Trang Chủ <ActiveIndicator path="/" />
            </Link>
            <Link to="/thuc-don" className={getLinkClass('/thuc-don')}>
                Thực Đơn <ActiveIndicator path="/thuc-don" />
            </Link>
            <Link to="/dat-mon-online" className={getLinkClass('/dat-mon-online')}>
                Đặt Món <ActiveIndicator path="/dat-mon-online" />
            </Link>
            <Link to="/dat-ban" className={getLinkClass('/dat-ban')}>
                Đặt Bàn <ActiveIndicator path="/dat-ban" />
            </Link>
            <Link to="/gioi-thieu" className={getLinkClass('/gioi-thieu')}>
                Giới Thiệu <ActiveIndicator path="/gioi-thieu" />
            </Link>
            
            {isAuthenticated && userRole === 'admin' && (
                <Link to="/admin/dashboard" className="px-4 py-1.5 rounded-full border border-amber-500/50 text-amber-500 text-xs font-bold uppercase hover:bg-amber-500 hover:text-gray-900 transition-all">
                    Admin Panel
                </Link>
            )}
        </div>

        {/* 3. ACTIONS (Giỏ hàng & User) */}
        <div className="flex items-center space-x-5">
            
            {/* Nút Giỏ Hàng */}
            <button onClick={openCart} className="relative group">
                <ShoppingBag className="text-gray-300 group-hover:text-amber-500 transition-colors" size={24} />
                {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce-short">
                        {itemCount}
                    </span>
                )}
            </button>

            <div className="h-6 w-[1px] bg-gray-700 hidden md:block"></div>

            {/* User / Login */}
            {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/lich-su-don-hang" className="text-gray-300 hover:text-amber-500 transition-colors" title="Lịch sử đơn hàng">
                        <ClipboardList size={22} />
                    </Link>
                    <button onClick={logout} className="text-gray-300 hover:text-red-500 transition-colors" title="Đăng xuất">
                        <LogOut size={22} />
                    </button>
                </div>
            ) : (
                <button 
                    onClick={handleLoginClick} 
                    className="hidden md:flex items-center gap-2 text-sm font-bold text-amber-500 hover:text-white transition-colors"
                >
                    <User size={18} /> ĐĂNG NHẬP
                </button>
            )}

            {/* Mobile Menu Button */}
            <button 
                className="md:hidden text-white hover:text-amber-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>
      </nav>

      {/* 4. MOBILE MENU (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 absolute top-full left-0 w-full shadow-2xl animate-fade-in-down">
            <div className="flex flex-col p-4 space-y-3">
                <Link to="/" className="text-gray-300 hover:text-amber-500 py-2 border-b border-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Trang Chủ</Link>
                <Link to="/thuc-don" className="text-gray-300 hover:text-amber-500 py-2 border-b border-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Thực Đơn</Link>
                <Link to="/dat-mon-online" className="text-amber-500 font-bold py-2 border-b border-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Đặt Món Online</Link>
                <Link to="/dat-ban" className="text-gray-300 hover:text-amber-500 py-2 border-b border-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Đặt Bàn</Link>
                <Link to="/gioi-thieu" className="text-gray-300 hover:text-amber-500 py-2 border-b border-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Giới Thiệu</Link>
                
                {isAuthenticated ? (
                    <>
                        <Link to="/lich-su-don-hang" className="text-gray-300 hover:text-amber-500 py-2 border-b border-gray-800 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                            <ClipboardList size={18}/> Lịch sử đơn hàng
                        </Link>
                        <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-400 hover:text-red-300 py-2 flex items-center gap-2 text-left w-full">
                            <LogOut size={18}/> Đăng xuất
                        </button>
                    </>
                ) : (
                    <button onClick={() => { handleLoginClick(); setIsMobileMenuOpen(false); }} className="bg-amber-600 text-white py-3 rounded-lg font-bold mt-2 hover:bg-amber-700">
                        ĐĂNG NHẬP / ĐĂNG KÝ
                    </button>
                )}
            </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;