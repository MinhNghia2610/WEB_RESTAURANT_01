// src/App.jsx (ĐÃ THAY THẾ ROUTE "orders" CỦA ADMIN)

import React, { useState } from 'react'; 
import { Routes, Route } from 'react-router-dom';

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

// ⭐️ 1. IMPORT TRANG QUẢN LÝ ĐƠN HÀNG MỚI
import OrderManagement from './pages/Admin/OrderManagement.jsx'; 

// *************** IMPORTS MODALS TOÀN CỤC ***************
import CartModal from './components/cart/CartModal.jsx'; 

function App() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <> 
            <Routes>
                
                <Route path="/reset-password" element={<ResetPasswordPage />} /> 

                {/* I. ROUTES CÔNG KHAI (USER) */}
                <Route path="/" element={<UserLayout setIsAuthModalOpen={setIsAuthModalOpen} />}>
                    <Route index element={<HomePageContent />} /> 
                    <Route path="gioi-thieu" element={<GioiThieuPage />} />
                    <Route path="thuc-don" element={<MenuPage />} />
                    <Route path="dat-mon-online" element={<OrderOnlinePage />} />
                    <Route path="dat-ban" element={<ReservationPage />} /> 
                    <Route path="thanh-toan" element={<CheckoutPage />} />
                    <Route path="dat-hang-thanh-cong" element={<OrderSuccessPage />} />
                    <Route path="lich-su-don-hang" element={<MyOrdersPage />} />
                    <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
                </Route>

                {/* II. ROUTES QUẢN TRỊ (ADMIN) */}
                <Route path="/admin" element={<ProtectedRoute />}> 
                    <Route index element={<DashboardPage />} />
                    <Route path="reservations" element={<ReservationManagement />} /> 
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="menu" element={<MenuManagement />} />
                    
                    {/* ⭐️ 2. THAY THẾ PLACEHOLDER BẰNG TRANG MỚI */}
                    <Route path="orders" element={<OrderManagement />} /> 
                    
                    <Route path="reports" element={<h1>Báo cáo & Thống kê Placeholder</h1>} />
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