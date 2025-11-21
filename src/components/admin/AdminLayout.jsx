// src/components/AdminComponents/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import Sidebar component để sử dụng trong layout
import { useAuth } from '../../context/AuthContext'; // Import useAuth để dùng logout

const AdminLayout = () => {
    const { logout } = useAuth(); // Lấy hàm logout

    return (
        // Nền tối cho toàn bộ trang Admin
        <div className="flex bg-gray-900 min-h-screen text-gray-200">
            
            {/* 1. Sidebar */}
            <Sidebar />

            {/* 2. Main Content Container (ml-64 khớp với width của Sidebar) */}
            <div className="flex-1 flex flex-col ml-64 overflow-hidden"> 
                
                {/* 3. Header (Theme tối) */}
                <header className="flex items-center justify-between h-16 bg-gray-800 shadow-lg px-6 border-b border-gray-700 z-10">
                    <h1 className="text-xl font-bold text-amber-500 font-serif">
                        Trang Quản trị L'ESSENCE
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-300">Xin chào, Admin!</span>
                        <button 
                            onClick={logout}
                            className="text-red-400 hover:text-red-300 font-medium hover:underline"
                        >
                            (Đăng xuất)
                        </button>
                    </div>
                </header>
                
                {/* 4. Content Area (Nền 900, tự động cuộn nếu nội dung dài) */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
                    <Outlet /> {/* Đây là nơi các trang (OrderManagement...) hiển thị */}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;