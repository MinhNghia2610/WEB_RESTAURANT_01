// src/pages/Admin/MenuManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';
// 1. IMPORT MODAL MÀ CHÚNG TA SẼ TẠO Ở BƯỚC SAU
// (Bạn hãy tạo thư mục 'admin' bên trong 'components' nhé)
import DishFormModal from '../../components/admin/DishFormModal'; 

const MenuManagement = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Lấy token để xác thực

  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null); // Dish to edit

  // 1. HÀM GỌI API (GET /api/dishes)
  const fetchDishes = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      // Không cần token cho GET, nhưng ta sẽ cần cho DELETE, POST, PUT
      const response = await fetch(`${API_URL}/dishes`); 
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Không thể tải thực đơn');
      setDishes(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. GỌI API KHI COMPONENT TẢI
  useEffect(() => {
    fetchDishes();
  }, []);

  // 3. HÀM XỬ LÝ XÓA (DELETE /api/dishes/:id)
  const handleDelete = async (dishId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
      return;
    }
    
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_URL}/dishes/${dishId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // <-- Cần token Admin
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Xóa thất bại');
      }

      // Xóa thành công, gọi lại fetchDishes để làm mới danh sách
      fetchDishes(); 
      
    } catch (err) {
      setError(err.message);
    }
  };

  // 4. HÀM MỞ/ĐÓNG MODAL
  const handleOpenAddModal = () => {
    setSelectedDish(null); // Đặt là null để Modal biết đây là "Thêm mới"
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dish) => {
    setSelectedDish(dish); // Gửi món ăn cần sửa vào Modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Khi modal báo lưu thành công, ta làm mới danh sách
  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchDishes(); // Làm mới danh sách
  };

  // 5. RENDER GIAO DIỆN
  return (
    <div className="p-6 text-white space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold font-serif text-amber-500">Quản lý Thực đơn</h1>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Thêm Món Mới
        </button>
      </div>

      {/* Thông báo Lỗi */}
      {error && (
        <div className="text-red-400 bg-red-900/50 p-4 rounded-lg border border-red-700 flex items-center gap-3">
          <AlertCircle />
          <p><span className="font-bold">Lỗi:</span> {error}</p>
        </div>
      )}

      {/* Bảng Hiển thị */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-12 h-12 text-amber-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-gray-800 shadow-lg rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Hình ảnh</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tên Món</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Danh mục</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Giá</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {dishes.map((dish) => (
                  <tr key={dish._id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <img src={dish.imageURL || 'https://placehold.co/100x100'} alt={dish.name} className="w-16 h-16 object-cover rounded-md" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{dish.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{dish.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-500">{dish.price.toLocaleString('vi-VN')} VNĐ</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(dish)}
                        className="text-blue-400 hover:text-blue-300 p-2 rounded-lg bg-blue-900/50 hover:bg-blue-800/50"
                        title="Sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(dish._id)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-lg bg-red-900/50 hover:bg-red-800/50"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. ĐẶT MODAL Ở ĐÂY */}
      {/* Nó sẽ được "ẩn" cho đến khi isModalOpen là true */}
      <DishFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveSuccess={handleSaveSuccess}
        dishToEdit={selectedDish} 
      />
    </div>
  );
};

export default MenuManagement;