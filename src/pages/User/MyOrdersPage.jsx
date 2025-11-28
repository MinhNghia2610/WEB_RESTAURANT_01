// src/pages/User/MyOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader, AlertCircle, ClipboardList, User, Phone, MapPin, MessageSquare } from 'lucide-react';

// Hàm helper để định dạng màu cho Trạng thái
const getStatusClass = (status) => {
  switch (status) {
    case 'Đang chờ xử lý':
      return 'bg-yellow-200 text-yellow-800';
    case 'Đã xác nhận':
      return 'bg-blue-200 text-blue-800';
    case 'Đã hoàn thành':
      return 'bg-green-200 text-green-800';
    case 'Đã hủy':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!token) {
        setError('Bạn cần đăng nhập để xem lịch sử đơn hàng.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API_URL}/orders/my-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Không thể tải lịch sử đơn hàng');
        
        setOrders(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [token]);

  // --- Hàm Render (Hiển thị) ---

  if (loading) {
    return (
      <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white flex justify-center items-center">
        <Loader className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white flex justify-center items-center">
        <div className="text-red-400 bg-red-900/50 p-4 rounded-lg border border-red-700 flex items-center gap-3">
          <AlertCircle />
          <p><span className="font-bold">Lỗi:</span> {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề */}
        <header className="text-center mb-10 flex items-center justify-center gap-4">
          <ClipboardList className="w-10 h-10 text-amber-500" />
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-white">
            Lịch sử Đơn hàng
          </h1>
        </header>

        {orders.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="space-y-6">
            {/* Lặp qua từng đơn hàng */}
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-800 shadow-lg rounded-xl border border-gray-700 overflow-hidden">
                {/* Header của thẻ đơn hàng */}
                <div className="p-4 bg-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-xs text-gray-400 uppercase">Mã đơn hàng</span>
                    <p className="font-mono text-sm text-white font-bold">{order._id}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Nội dung chi tiết */}
                <div className="p-5 space-y-4">
                  
                  {/* 1. Danh sách món ăn */}
                  <div className="space-y-3">
                    {order.orderItems.map((item) => (
                      <div key={item.dish} className="flex justify-between items-center text-sm">
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-gray-400">
                            {item.quantity} x {item.price.toLocaleString('vi-VN')} VNĐ
                          </p>
                        </div>
                        <p className="font-bold text-gray-300">
                          {(item.quantity * item.price).toLocaleString('vi-VN')} VNĐ
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 2. Thông tin khách hàng */}
                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-md font-semibold text-amber-500 mb-3">Thông tin chi tiết</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-500" />
                        <span>Người nhận: <span className="font-medium text-white">{order.customerInfo.name}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-500" />
                        <span>Số điện thoại: <span className="font-medium text-white">{order.customerInfo.phone}</span></span>
                      </div>
                      {order.customerInfo.address && (
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="text-gray-500 mt-0.5" />
                          <span>Địa chỉ/Số bàn: <span className="font-medium text-white">{order.customerInfo.address}</span></span>
                        </div>
                      )}
                      {order.customerInfo.note && (
                        <div className="flex items-start gap-2">
                          <MessageSquare size={16} className="text-gray-500 mt-0.5" />
                          <span>Ghi chú: <span className="font-medium text-white italic">{order.customerInfo.note}</span></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. Tổng cộng và Ngày đặt */}
                  <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                    <p className="text-xs text-gray-400">
                      Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </p>
                    <div className="text-right">
                      <span className="text-sm text-gray-300">Tổng cộng:</span>
                      <p className="text-2xl font-bold text-red-500">
                        {order.totalPrice.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;