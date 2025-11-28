import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; 

// Import các Components dùng trong Layout User
import Navbar from './Navbar.jsx'; 
import AuthModal from '../auth/AuthModal.jsx';
import Footer from './Footer.jsx';

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
    const { isAuthenticated, userRole } = useAuth(); // LẤY TRẠNG THÁI TỪ CONTEXT

    // State dùng chung cho Layout User
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); 
    const location = useLocation(); 

    // LOGIC ĐÓNG AUTH MODAL KHI ĐĂNG NHẬP THÀNH CÔNG
    useEffect(() => {
        if (isAuthenticated) {
            // Nếu người dùng đã đăng nhập, đảm bảo Modal Auth được đóng
            setIsAuthModalOpen(false);
        }
    }, [isAuthenticated]); // Chạy mỗi khi isAuthenticated thay đổi

    return (
        <div className="App font-sans">
            <ScrollToTop /> 
            
            {/* 1. Navbar */}
            <Navbar 
                setIsAuthModalOpen={setIsAuthModalOpen} 
                currentPage={location.pathname}
            />

            {/* 2. MAIN CONTENT (Nơi các trang con được render) */}
            <main className="min-h-screen flex-grow">
                {/* Dùng <Outlet /> để hiển thị nội dung của Route con (HomePage, MenuPage,...) */}
                <Outlet /> 
            </main>
            
            {/* 3. Modals/Sidebars */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            
            {/* 4. Footer */}
            <Footer /> 
        </div>
    );
};

export default UserLayout;
