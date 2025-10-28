import React from 'react';
import { Routes, Route } from 'react-router-dom';

// *************** IMPORTS LAYOUTS ***************
import UserLayout from './components/UserComponents/UserLayout.jsx'; 
import ProtectedRoute from './components/AdminComponents/ProtectedRoute.jsx'; 

// *************** IMPORTS AUTH PAGES ***************
import AuthModal from './components/UserComponents/AuthModal.jsx';

// *************** IMPORTS USER PAGES ***************
import HomePageContent from './pages/User/HomePageContent.jsx'; 
import GioiThieuPage from './pages/User/AboutUs.jsx'; 
import MenuPage from './pages/User/MenuPage.jsx'; 
import ReservationPage from './pages/User/ReservationPage.jsx'; 
import OrderOnlinePage from './pages/User/OrderOnlinePage.jsx'; 

// *************** IMPORTS ADMIN PAGES ***************
import DashboardPage from './pages/Admin/DashboardPage.jsx';
import MenuManagement from './pages/Admin/MenuManagement.jsx';
import ReservationManagement from './pages/Admin/ReservationManagement.jsx';

// *************** IMPORTS CHATBOT ***************
import ChatBot from "./components/ChatBot.jsx";

function App() {
    return (
        <>
            {/* ROUTES CHÍNH */}
            <Routes>
                {/* AUTH ROUTE */}
                <Route path="/auth" element={<AuthModal isOpen={true} onClose={() => {}} />} />

                {/* USER ROUTES */}
                <Route path="/" element={<UserLayout />}>
                    <Route index element={<HomePageContent />} /> 
                    <Route path="gioi-thieu" element={<GioiThieuPage />} />
                    <Route path="thuc-don" element={<MenuPage />} />
                    <Route path="dat-mon" element={<OrderOnlinePage />} />
                    <Route path="dat-ban" element={<ReservationPage />} /> 
                    <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
                </Route>

                {/* ADMIN ROUTES */}
                <Route path="/admin" element={<ProtectedRoute />}> 
                    <Route index element={<DashboardPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="menu" element={<MenuManagement />} />
                    <Route path="reservations" element={<ReservationManagement />} /> 
                    <Route path="orders" element={<h1>Quản lý Đơn hàng Placeholder</h1>} />
                    <Route path="reports" element={<h1>Báo cáo & Thống kê Placeholder</h1>} />
                    <Route path="*" element={<h1>404 - Trang Admin không tìm thấy</h1>} />
                </Route>
            </Routes>

            {/* 👇 CHATBOT POPUP HIỂN THỊ TRÊN MỌI TRANG */}
            <ChatBot />
        </>
    );
}

export default App;
