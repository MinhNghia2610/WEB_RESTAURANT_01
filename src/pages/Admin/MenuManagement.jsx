// src/pages/Admin/MenuManagement.jsx
import React from 'react';
import DataTable from '../../components/AdminComponents/DataTable';

const sampleMenu = [
    {
        id: 'M001',
        name: 'Soupe à l\'Oignon',
        category: 'Khai vị',
        price: '180,000đ',
        status: 'Hiển thị'
    },
    {
        id: 'M002',
        name: 'Thịt Bò Wellington',
        category: 'Món chính',
        price: '850,000đ',
        status: 'Hiển thị'
    },
    {
        id: 'M003',
        name: 'Crème brûlée',
        category: 'Tráng miệng',
        price: '150,000đ',
        status: 'Hết hàng'
    },
];

const MenuManagement = () => {
    const columns = ['Mã món', 'Tên món', 'Danh mục', 'Giá', 'Trạng thái'];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-gray-900">🍽️ Quản lý Thực đơn</h1>
            
            {/* Thanh công cụ và nút thêm */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm món ăn..." 
                    className="border border-gray-300 rounded-lg p-2 w-80 focus:ring-yellow-500 focus:border-yellow-500" 
                />
                <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-150">
                    + Thêm Món Mới
                </button>
            </div>

            {/* Bảng dữ liệu */}
            <DataTable 
                title="Danh sách Món ăn" 
                columns={columns} 
                data={sampleMenu} 
            />

            {/* Bạn có thể thêm component Quản lý Danh mục ở đây */}

        </div>
    );
};

export default MenuManagement;