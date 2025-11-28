import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader, AlertCircle, Plus, Edit, Trash2, Search } from 'lucide-react';
import DishFormModal from '../../components/admin/DishFormModal'; 

const MenuManagement = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  // 1. HÀM GỌI API
  const fetchDishes = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
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

  useEffect(() => {
    fetchDishes();
  }, []);

  // 2. HÀM XỬ LÝ XÓA
  const handleDelete = async (dishId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa món ăn này?')) return;
    
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_URL}/dishes/${dishId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Xóa thất bại');
      }
      fetchDishes(); 
    } catch (err) {
      setError(err.message);
    }
  };

  // 3. HÀM MODAL
  const handleOpenAddModal = () => {
    setSelectedDish(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dish) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchDishes();
  };

  // Format tiền tệ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-10">
      
      {/* --- HEADER ĐỒNG BỘ (ĐEN - VIỀN VÀNG) --- */}
      <div className="bg-gray-900 text-white shadow-lg border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Thực Đơn</h1>
                    <p className="text-gray-400 text-sm">
                        Danh sách món ăn tại <span className="text-amber-500 font-semibold">L'ESSENCE</span>
                    </p>
                </div>
                
                {/* Nút Thêm Món đặt trên Header */}
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-amber-500/30 transform hover:-translate-y-1"
                >
                    <Plus size={20} />
                    Thêm Món Mới
                </button>
            </div>
        </div>
      </div>

      {/* --- NỘI DUNG CHÍNH --- */}
      <div className="max-w-7xl mx-auto px-6 py-8 -mt-8">
        
        {/* Thông báo lỗi */}
        {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm flex items-center gap-3">
                <AlertCircle size={20} />
                <p><span className="font-bold">Lỗi:</span> {error}</p>
            </div>
        )}

        {/* Bảng Dữ Liệu */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden min-h-[400px]">
            {loading ? (
                <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                    <Loader className="w-10 h-10 text-amber-500 animate-spin mb-2" />
                    <p>Đang tải thực đơn...</p>
                </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Hình ảnh</th>
                    <th className="px-6 py-4 font-semibold">Tên Món</th>
                    <th className="px-6 py-4 font-semibold">Danh mục</th>
                    <th className="px-6 py-4 font-semibold">Giá</th>
                    <th className="px-6 py-4 font-semibold text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {dishes.length === 0 ? (
                     <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">Chưa có món ăn nào trong thực đơn.</td></tr>
                  ) : (
                    dishes.map((dish) => (
                      <tr key={dish._id} className="hover:bg-amber-50/30 transition-colors duration-150 group">
                        {/* Hình ảnh */}
                        <td className="px-6 py-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                              <img 
                                src={dish.imageURL || 'https://placehold.co/100x100'} 
                                alt={dish.name} 
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                              />
                          </div>
                        </td>
                        
                        {/* Tên Món */}
                        <td className="px-6 py-4">
                            <div className="font-bold text-gray-900 text-base">{dish.name}</div>
                            <div className="text-xs text-gray-400 mt-1 line-clamp-1">{dish.description || "Chưa có mô tả"}</div>
                        </td>

                        {/* Danh mục */}
                        <td className="px-6 py-4">
                            <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                                {dish.category}
                            </span>
                        </td>

                        {/* Giá */}
                        <td className="px-6 py-4">
                            <div className="font-bold text-amber-600 text-base">
                                {formatPrice(dish.price)}
                            </div>
                        </td>

                        {/* Hành động */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEditModal(dish)}
                              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(dish._id)}
                              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            )}
        </div>
      </div>

      {/* MODAL */}
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