import React, { useState } from 'react'; 
import { Routes, Route } from 'react-router-dom';
// Import thư viện Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// *************** IMPORTS LAYOUTS ***************
import UserLayout from './components/layout/UserLayout.jsx'; 
import ProtectedRoute from './components/admin/ProtectedRoute.jsx'; 

// *************** IMPORTS AUTH PAGES ***************
import AuthModal from './components/auth/AuthModal.jsx';
import ResetPasswordPage from './pages/User/ResetPasswordPage.jsx'; 

// *************** IMPORTS USER PAGES ***************
import HomePageContent from './pages/User/HomePageContent.jsx'; 
import GioiThieuPage from './pages/User/AboutUs.jsx'; 
import MenuPage from './pages/User/MenuPage.jsx'; 
import ReservationPage from './pages/User/ReservationPage.jsx'; 
import OrderOnlinePage from './pages/User/OrderOnlinePage.jsx'; 
import CheckoutPage from './pages/User/CheckoutPage.jsx'; 
import OrderSuccessPage from './pages/User/OrderSuccessPage.jsx'; 
import MyOrdersPage from './pages/User/MyOrdersPage.jsx'; 

// *************** IMPORTS ADMIN PAGES ***************
import DashboardPage from './pages/Admin/DashboardPage.jsx'; 
import MenuManagement from './pages/Admin/MenuManagement.jsx'; 
import ReservationManagement from './pages/Admin/ReservationManagement.jsx'; 
import OrderManagement from './pages/Admin/OrderManagement.jsx'; 

// *************** IMPORTS MODALS TOÀN CỤC ***************
import CartModal from './components/cart/CartModal.jsx'; 

// --- [MỚI] IMPORT CHATBOT ---
import ChatWidget from './components/chatbot/ChatWidget.jsx'; 

function App() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <> 
            {/* Container hiển thị thông báo toàn cục */}
            <ToastContainer position="top-right" autoClose={3000} />

            {/* --- [MỚI] HIỂN THỊ CHATBOT TOÀN CỤC --- */}
            <ChatWidget />

            <Routes>
                
                {/* 🏆 ROUTE ĐẶT LẠI MẬT KHẨU (Cần có tham số :token) */}
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> 
                
                {/* I. ROUTES CÔNG KHAI (USER) */}
                <Route path="/" element={<UserLayout setIsAuthModalOpen={setIsAuthModalOpen} />}>
                    <Route index element={<HomePageContent />} /> 
                    <Route path="gioi-thieu" element={<GioiThieuPage />} />
                    <Route path="thuc-don" element={<MenuPage />} />
                    <Route path="dat-mon-online" element={<OrderOnlinePage />} />
                    <Route path="dat-ban" element={<ReservationPage />} /> 
                    
                    {/* --- SỬA LỖI 404 VNPAY Ở ĐÂY --- */}
                    {/* 1. Route Thanh toán (Hỗ trợ cả tiếng Anh và tiếng Việt) */}
                    <Route path="thanh-toan" element={<CheckoutPage />} />
                    <Route path="checkout" element={<CheckoutPage />} /> {/* Backend redirect failure về đây */}

                    {/* 2. Route Thành công (Hỗ trợ cả tiếng Anh và tiếng Việt) */}
                    <Route path="dat-hang-thanh-cong" element={<OrderSuccessPage />} />
                    <Route path="order-success" element={<OrderSuccessPage />} /> {/* Backend redirect success về đây */}

                    <Route path="lich-su-don-hang" element={<MyOrdersPage />} />
                    <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
                </Route>

                {/* II. ROUTES QUẢN TRỊ (ADMIN) */}
                <Route path="/admin" element={<ProtectedRoute />}> 
                    <Route index element={<DashboardPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    
                    <Route path="reservations" element={<ReservationManagement />} /> 
                    <Route path="menu" element={<MenuManagement />} />
                    <Route path="orders" element={<OrderManagement />} /> 
                    
                    <Route path="*" element={<h1>404 - Trang Admin không tìm thấy</h1>} />
                </Route>
            </Routes>

            {/* MODALS TOÀN CỤC */}
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
            />
            <CartModal />
        </>
    );
}

export default App;