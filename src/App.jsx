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

// *************** IMPORTS ADMIN PAGES (ĐÃ THỐNG NHẤT CHỮ HOA/THƯỜNG) ***************
import DashboardPage from './pages/Admin/DashboardPage.jsx'; // SỬA: 'admin' -> 'Admin'
import MenuManagement from './pages/Admin/MenuManagement.jsx'; // SỬA: 'admin' -> 'Admin'
import ReservationManagement from './pages/Admin/ReservationManagement.jsx'; 


function App() {
    return (
        // <Routes> đã được bọc bởi <BrowserRouter> và <AuthProvider> trong main.jsx
        <Routes>
            
            {/* III. ROUTES XÁC THỰC (AUTH) */}
            {/* LƯU Ý: Tuyến đường này không dùng để hiển thị AuthModal thông thường. 
                 Nên dùng state/context để hiển thị modal. Nếu dùng như này, 
                 modal sẽ luôn hiển thị khi truy cập /auth và không bao giờ đóng. */}
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
            <Route path="/admin" element={<ProtectedRoute />}> 
                <Route index element={<DashboardPage />} />
                
                <Route path="reservations" element={<ReservationManagement />} /> 
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="menu" element={<MenuManagement />} />
                
                <Route path="orders" element={<h1>Quản lý Đơn hàng Placeholder</h1>} />
                <Route path="reports" element={<h1>Báo cáo & Thống kê Placeholder</h1>} />

                <Route path="*" element={<h1>404 - Trang Admin không tìm thấy</h1>} />
            </Route>
        </Routes>
    );
}

export default App;
