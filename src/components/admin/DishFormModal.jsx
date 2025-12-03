// src/components/admin/DishFormModal.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';

// Component Input Tùy chỉnh
const FormInput = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      id={id}
      className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-amber-500"
      {...props}
    />
  </div>
);

const DishFormModal = ({ isOpen, onClose, onSaveSuccess, dishToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageURL: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Cần token Admin để gọi API

  // Xác định xem đây là chế độ Sửa hay Thêm
  const isEditMode = Boolean(dishToEdit);

  // 1. Tự động điền form nếu là chế độ Sửa (Edit)
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: dishToEdit.name || '',
        description: dishToEdit.description || '',
        price: dishToEdit.price || 0,
        category: dishToEdit.category || '',
        imageURL: dishToEdit.imageURL || '',
      });
    } else {
      // Nếu là chế độ Thêm mới, reset form
      setFormData({
        name: '', description: '', price: 0, category: '', imageURL: '',
      });
    }
  }, [dishToEdit, isOpen]); // Chạy lại khi món ăn thay đổi hoặc modal mở/đóng

  // 2. Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Chuyển đổi giá trị nếu là 'price'
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  // 3. HÀM GỌI API (POST hoặc PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError('Lỗi xác thực. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode 
        ? `${API_URL}/dishes/${dishToEdit._id}` // URL để Sửa
        : `${API_URL}/dishes`;                  // URL để Tạo

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // GỬI TOKEN ADMIN
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (isEditMode ? 'Cập nhật thất bại' : 'Thêm mới thất bại'));
      }

      // BÁO THÀNH CÔNG CHO COMPONENT CHA (để làm mới danh sách)
      onSaveSuccess();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. RENDER
  if (!isOpen) return null;

  return (
    // Lớp nền mờ (Backdrop)
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Khung Nội dung Modal */}
      <div
        className="relative w-full max-w-2xl bg-gray-800 rounded-2xl shadow-xl
                   border border-gray-700 p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Ngăn click bên trong modal đóng modal
      >
        {/* Tiêu đề & Nút X (Đóng) */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold font-serif text-amber-500">
            {isEditMode ? 'Cập nhật Món ăn' : 'Thêm Món ăn Mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Tên Món ăn"
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ví dụ: Bò Carpaccio Sốt Chanh Dây"
            required
          />
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Mô tả ngắn về món ăn..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Giá (VNĐ)"
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ví dụ: 350000"
              required
            />
            <FormInput
              label="Danh mục (Category)"
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="Ví dụ: Món Chính, Khai Vị, Tráng Miệng"
              required
            />
          </div>

          <FormInput
            label="Link Hình ảnh (URL)"
            id="imageURL"
            name="imageURL"
            type="text"
            value={formData.imageURL}
            onChange={handleChange}
            placeholder="https://example.com/image.png"
          />

          {/* Thông báo Lỗi */}
          {error && (
            <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">
              {error}
            </p>
          )}

          {/* Nút Bấm */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors
                         disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DishFormModal;