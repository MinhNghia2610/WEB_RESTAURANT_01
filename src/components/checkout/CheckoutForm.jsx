// src/components/checkout/CheckoutForm.jsx (ĐÃ SỬA LỖI CHUYỂN TRANG)
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Component Input Tùy chỉnh (Giữ nguyên)
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

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { cartItems, totalPrice, clearCart } = useCart();
  const { token } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Kiểm tra thông tin (Giữ nguyên)
    if (!formData.name || !formData.phone) {
      setError('Vui lòng nhập Tên và Số điện thoại.');
      setLoading(false);
      return;
    }
    
    // 2. Kiểm tra đăng nhập (Giữ nguyên)
    if (!token) {
        setError('Vui lòng đăng nhập để đặt hàng.');
        setLoading(false);
        return;
    }

    // 3. Chuẩn bị dữ liệu gửi đi (Giữ nguyên)
    const orderData = {
      orderItems: cartItems.map(item => ({
        _id: item._id,
        name: item.name,
        quantity: item.quantity,
      })),
      customerInfo: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        note: formData.note,
      },
    };

    // 4. Gọi API (Giữ nguyên)
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đặt hàng không thành công.');
      }

      // ==============================================
      // ⭐️ SỬA LỖI: ĐÃ ĐẢO NGƯỢC THỨ TỰ 2 DÒNG NÀY
      // ==============================================
      // 5. THÀNH CÔNG!
      // Chuyển hướng đến trang "Cảm ơn" TRƯỚC
      navigate('/dat-hang-thanh-cong'); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Tên của bạn"
        id="name" name="name" type="text"
        value={formData.name} onChange={handleChange}
        placeholder="Nguyễn Văn A" required
      />
      <FormInput
        label="Số điện thoại"
        id="phone" name="phone" type="tel"
        value={formData.phone} onChange={handleChange}
        placeholder="0901234567" required
      />
      <FormInput
        label="Địa chỉ hoặc Số bàn"
        id="address" name="address" type="text"
        value={formData.address} onChange={handleChange}
        placeholder="Ví dụ: 123 Đường ABC, Phường X, Quận Y / Bàn số 5"
      />
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-300 mb-1">
          Ghi chú cho nhà hàng
        </label>
        <textarea
          id="note" name="note" rows="3"
          value={formData.note} onChange={handleChange}
          className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Ví dụ: Lấy ít cay, thêm hành..."
        ></textarea>
      </div>

      {/* Logic Nút bấm (Giữ nguyên) */}
      <div className="pt-4">
        {error && (
          <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4 text-center">{error}</p>
        )}
        
        {cartItems.length === 0 ? (
          <button
            type="button"
            disabled={true}
            className="w-full bg-pink-200 text-pink-700 py-4 rounded-lg font-bold text-lg opacity-70 cursor-not-allowed"
          >
            Giỏ hàng trống
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg 
                       hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : `Xác nhận Đặt hàng (${totalPrice.toLocaleString('vi-VN')} VNĐ)`}
          </button>
        )}

      </div>
    </form>
  );
};

export default CheckoutForm;