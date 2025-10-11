import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// ĐÃ SỬA: Thay đổi từ '../context/AuthContext.jsx' thành '../../context/AuthContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'; 

// Import các Components dùng trong Layout User
import Navbar from './Navbar'; 
import CartSidebar from './CartSidebar';
import AuthModal from './AuthModal';
import Footer from './Footer';

// Component để buộc cuộn lên đầu trang
const ScrollToTop = () => {
    const { pathname } = useLocation();
    
    useEffect(() => {
        // Cuộn lên đầu trang mỗi khi đường dẫn thay đổi
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; 
};

// Component chính của Layout User
const UserLayout = () => {
    // Lấy trạng thái từ Context
    const { isAuthenticated, userRole } = useAuth(); // <<< 2. LẤY TRẠNG THÁI TỪ CONTEXT

    // State dùng chung cho Layout User (Cart, Auth Modal)
    const [isCartOpen, setIsCartOpen] = useState(false); 
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); 
    const location = useLocation(); 

    // 3. LOGIC ĐÓNG AUTH MODAL KHI ĐĂNG NHẬP THÀNH CÔNG
    useEffect(() => {
        if (isAuthenticated) {
            // Nếu người dùng đã đăng nhập, đảm bảo Modal Auth được đóng
            setIsAuthModalOpen(false);
        }
    }, [isAuthenticated]); // Chạy mỗi khi isAuthenticated thay đổi

    return (
        <div className="App font-sans">
            <ScrollToTop /> 
            
            {/* 1. Navbar (Hiển thị cố định) */}
            <Navbar 
                setIsCartOpen={setIsCartOpen} 
                setIsAuthModalOpen={setIsAuthModalOpen} 
                currentPage={location.pathname}
            />

            {/* 2. MAIN CONTENT (Nơi các trang con được render) */}
            <main className="min-h-screen flex-grow">
                {/* Dùng <Outlet /> để hiển thị nội dung của Route con (HomePage, MenuPage,...) */}
                <Outlet /> 
            </main>
            
            {/* 3. Modals/Sidebars (Hiển thị cố định) */}
            <CartSidebar isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            
            {/* 4. Footer (Hiển thị cố định) */}
            <Footer /> 
        </div>
    );
};

export default UserLayout;