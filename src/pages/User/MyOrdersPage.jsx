// src/pages/User/MyOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Loader, AlertCircle } from 'lucide-react';

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
  const { token } = useAuth(); // Lấy token để xác thực API

  useEffect(() => {
    const fetchOrders = async () => {
      // Nếu chưa đăng nhập (không có token), không cần gọi API
      if (!token) {
        setLoading(false);
        setError('Vui lòng đăng nhập để xem lịch sử đơn hàng.');
        return;
      }

      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        
        const response = await fetch(`${API_URL}/orders/my-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`, // <-- Gửi token xác thực
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Không thể tải lịch sử đơn hàng.');
        }

        setOrders(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]); // Chạy lại khi token thay đổi (sau khi đăng nhập)

  // Hàm render nội dung chính
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center text-gray-400 flex flex-col items-center">
          <Loader className="animate-spin w-12 h-12 mb-4" />
          <p>Đang tải lịch sử đơn hàng...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg border border-red-700 flex flex-col items-center">
          <AlertCircle className="w-12 h-12 mb-4" />
          <p>{error}</p>
          {/* Nếu lỗi là do chưa đăng nhập, hiển thị link */}
          {!token && (
            <Link to="/" className="mt-4 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700">
              Đăng nhập ngay
            </Link>
          )}
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center text-gray-400">
          <p>Bạn chưa có đơn hàng nào.</p>
          <Link to="/dat-mon-online" className="mt-4 inline-block bg-amber-600 text-white py-3 px-5 rounded-lg font-bold hover:bg-amber-700">
            Đặt món ngay
          </Link>
        </div>
      );
    }

    // Hiển thị danh sách đơn hàng
    return (
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            {/* Header của Đơn hàng */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-gray-600 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-400">MÃ ĐƠN HÀNG</h3>
                <p className="text-lg font-bold text-white font-mono break-all">{order._id}</p>
              </div>
              <div className="text-left sm:text-right mt-3 sm:mt-0">
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            {/* Chi tiết các món ăn */}
            <div className="mb-4">
              {order.orderItems.map((item) => (
                <div key={item.dish} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                  <div>
                    <p className="font-semibold text-amber-500">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      {item.quantity} x {item.price.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                  <p className="font-bold text-white">
                    {(item.quantity * item.price).toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
              ))}
            </div>

            {/* Footer của Đơn hàng */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pt-4 border-t border-gray-600">
              <div className="text-gray-400 text-sm">
                <p>Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                <p>Người nhận: {order.customerInfo.name} ({order.customerInfo.phone})</p>
              </div>
              <div className="mt-3 sm:mt-0">
                <span className="text-gray-300 font-semibold text-lg">Tổng cộng: </span>
                <span className="text-2xl font-bold text-red-500">
                  {order.totalPrice.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tiêu đề trang */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-white flex items-center justify-center gap-4">
            <ShoppingBag size={40} />
            Lịch sử Đơn hàng
          </h1>
          <p className="text-gray-400 mt-2 text-lg max-w-xl mx-auto">
            Theo dõi tất cả các đơn hàng bạn đã đặt tại L'Essence.
          </p>
        </header>

        {/* Nội dung chính */}
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MyOrdersPage;