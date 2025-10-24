// src/pages/Admin/OrderManagement.jsx (ĐÃ THÊM GHI CHÚ)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader, AlertCircle, Inbox, MessageSquare } from 'lucide-react'; // Thêm icon

// Hàm helper (Giữ nguyên)
const getStatusClass = (status) => {
  switch (status) {
    case 'Đang chờ xử lý': return 'bg-yellow-200 text-yellow-800';
    case 'Đã xác nhận': return 'bg-blue-200 text-blue-800';
    case 'Đã hoàn thành': return 'bg-green-200 text-green-800';
    case 'Đã hủy': return 'bg-red-200 text-red-800';
    default: return 'bg-gray-200 text-gray-800';
  }
};

// Component Bảng Đơn Hàng
const OrdersTable = ({ orders, onUpdateStatus, title }) => (
  <div className="bg-gray-800 shadow-lg rounded-xl border border-gray-700 overflow-hidden">
    <h3 className="text-xl font-bold text-amber-500 p-5 border-b border-gray-700">
      {title} ({orders.length})
    </h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ngày Đặt</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Khách Hàng & Ghi chú</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Chi Tiết Đơn</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tổng Tiền</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Trạng Thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                <Inbox className="w-12 h-12 mx-auto mb-2" />
                Không có đơn hàng nào.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(order.createdAt).toLocaleString('vi-VN')}
                </td>
                
                {/* ============================================== */}
                {/* ⭐️ SỬA ĐỔI: THÊM GHI CHÚ VÀO ĐÂY ⭐️ */}
                {/* ============================================== */}
                <td className="px-6 py-4 whitespace-normal text-sm max-w-xs"> {/* Thêm max-w-xs để ghi chú dài có thể xuống dòng */}
                  <div className="font-medium text-white">{order.customerInfo.name}</div>
                  <div className="text-gray-400">{order.customerInfo.phone}</div>
                  
                  {/* Hiển thị ghi chú nếu có */}
                  {order.customerInfo.note && (
                    <div className="mt-2 p-2 bg-gray-700 rounded-md border border-gray-600">
                      <p className="text-xs text-amber-300 italic flex items-start gap-1.5">
                        <MessageSquare size={14} className="flex-shrink-0" />
                        <span>{order.customerInfo.note}</span>
                      </p>
                    </div>
                  )}
                </td>
                {/* ============================================== */}
                
                <td className="px-6 py-4 text-sm text-gray-300">
                  {order.orderItems.map((item) => (
                    <div key={item.dish} className="mb-1 last:mb-0">
                      {item.name} <span className="font-bold text-amber-400">x {item.quantity}</span>
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-500">
                  {order.totalPrice.toLocaleString('vi-VN')} VNĐ
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {/* Dropdown (Giữ nguyên) */}
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                    className={`p-2 rounded-md font-bold text-xs border-none outline-none ${getStatusClass(order.status)}`}
                  >
                    <option value="Đang chờ xử lý">Đang chờ xử lý</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// Component Trang Chính (Logic giữ nguyên, không thay đổi)
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); 

  // 1. Logic Lấy tất cả đơn hàng (Giữ nguyên)
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API_URL}/orders`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Không thể tải đơn hàng');
        setOrders(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  // 2. Logic Cập nhật trạng thái (Giữ nguyên)
  const handleUpdateStatus = async (orderId, newStatus) => {
    setError(null); 
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Cập nhật thất bại');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? data.data : order
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // 3. Render (Giữ nguyên)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  // 4. Lọc đơn hàng (Giữ nguyên)
  const pendingOrders = orders.filter((o) => o.status === 'Đang chờ xử lý');
  const processedOrders = orders.filter((o) => o.status !== 'Đang chờ xử lý');

  return (
    <div className="p-6 text-white space-y-8">
      <h1 className="text-4xl font-bold font-serif text-amber-500">Quản lý Đơn hàng</h1>
      
      {error && (
        <div className="text-red-400 bg-red-900/50 p-4 rounded-lg border border-red-700 flex items-center gap-3">
          <AlertCircle />
          <p><span className="font-bold">Lỗi:</span> {error}</p>
        </div>
      )}
      
      <OrdersTable 
        orders={pendingOrders}
        onUpdateStatus={handleUpdateStatus}
        title="Đơn hàng Mới (Đang chờ xử lý)"
      />
      <OrdersTable 
        orders={processedOrders}
        onUpdateStatus={handleUpdateStatus}
        title="Đơn hàng Đã xử lý"
      />
    </div>
  );
};

export default OrderManagement;