import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* 1. Sidebar (Cố định 256px) */}
            <Sidebar />

            {/* 2. Main Content Container (Đảm bảo lề trái để nội dung không bị Sidebar che) */}
            <div className="flex-1 flex flex-col ml-64 overflow-hidden"> 
                
                {/* 3. Header */}
                <header className="flex items-center justify-between h-16 bg-white shadow-md px-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">Trang Quản trị Nhà hàng L'ESSENCE</h1>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">🔔</button>
                        <span className="text-gray-700">Xin chào, Quản lý!</span>
                    </div>
                </header>
                
                {/* 4. Content Area (Khu vực thay đổi theo Route) */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;