import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; 

// *************** IMPORTS LAYOUTS ***************
import UserLayout from './components/UserComponents/UserLayout.jsx'; // Đảm bảo UserComponents là PascalCase
// AdminLayout được import bên trong ProtectedRoute
import ProtectedRoute from './components/AdminComponents/ProtectedRoute.jsx'; // Đảm bảo AdminComponents là PascalCase

// *************** IMPORTS AUTH PAGES ***************
import AuthModal from './components/usercomponents/AuthModal.jsx';

// *************** IMPORTS USER PAGES ***************
import HomePageContent from './pages/User/HomePageContent.jsx'; // Đảm bảo User là PascalCase
import GioiThieuPage from './pages/User/AboutUs.jsx'; // Đảm bảo User là PascalCase
import MenuPage from './pages/User/MenuPage.jsx'; // Đảm bảo User là PascalCase
import ReservationPage from './pages/User/ReservationPage.jsx'; // Đảm bảo User là PascalCase

// *************** IMPORTS ADMIN PAGES ***************
// LƯU Ý: Đảm bảo đường dẫn import không bị sai chữ hoa/thường (pages/Admin)
import DashboardPage from './pages/admin/DashboardPage.jsx'; 
import MenuManagement from './pages/admin/MenuManagement.jsx'; 
import ReservationManagement from './pages/Admin/ReservationManagement.jsx'; 


function App() {
    return (
        <BrowserRouter>
            {/* BỌC TẤT CẢ ROUTES BẰNG AuthProvider */}
            <AuthProvider>
            <Routes>
                
                {/* III. ROUTES XÁC THỰC (AUTH) */}
                <Route path="/auth" element={<AuthModal isOpen={true} onClose={() => {}} />} />

                {/* I. ROUTES CÔNG KHAI (USER) */}
                <Route path="/" element={<UserLayout />}>
                    <Route index element={<HomePageContent />} /> 
                    <Route path="gioi-thieu" element={<GioiThieuPage />} />
                    <Route path="thuc-don" element={<MenuPage />} />
                    <Route path="dat-ban" element={<ReservationPage />} /> 
                    {/* 404 cho User Layout */}
                    <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
                </Route>

                {/* II. ROUTES QUẢN TRỊ (ADMIN) - BẢO VỆ BẰNG ProtectedRoute */}
                {/* ProtectedRoute đã có AdminLayout bên trong và xử lý bảo mật */}
                <Route path="/admin" element={<ProtectedRoute />}> 
                    {/* Đường dẫn index sẽ là /admin */}
                    <Route index element={<DashboardPage />} />
                    
                    {/* ĐÃ SỬA: path="reservations" (có 's') */}
                    <Route path="reservations" element={<ReservationManagement />} /> 

                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="menu" element={<MenuManagement />} />
                    
                    {/* Thêm các route khác nếu cần (Quản lý Đơn hàng, Báo cáo...) */}
                    <Route path="orders" element={<h1>Quản lý Đơn hàng Placeholder</h1>} />
                    <Route path="reports" element={<h1>Báo cáo & Thống kê Placeholder</h1>} />

                    {/* Route catch-all cho /admin/* */}
                    <Route path="*" element={<h1>404 - Trang Admin không tìm thấy</h1>} />
                </Route>
                
            </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
