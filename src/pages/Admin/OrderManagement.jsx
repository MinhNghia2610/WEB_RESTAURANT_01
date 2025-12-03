import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader, AlertCircle, Inbox, MessageSquare, Clock, CheckCircle, XCircle, Truck, TrendingUp, PieChart as PieIcon, Award } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar 
} from 'recharts';

// 1. Helper: Class màu sắc cho trạng thái
const getStatusStyle = (status) => {
  switch (status) {
    case 'Đang chờ xử lý': return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'Đã xác nhận': return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'Đã hoàn thành': return 'bg-green-50 text-green-700 border border-green-200';
    case 'Đã hủy': return 'bg-red-50 text-red-700 border border-red-200';
    default: return 'bg-gray-100 text-gray-600 border border-gray-200';
  }
};

// Component Bảng Đơn Hàng
const OrdersTable = ({ orders, onUpdateStatus, title, icon: Icon }) => (
  <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden mb-8">
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
      {Icon && <Icon size={20} className="text-amber-600" />}
      <h3 className="text-lg font-bold text-gray-800">
        {title} <span className="text-xs font-normal text-gray-500 ml-2 bg-white px-2 py-1 rounded-full border border-gray-200">{orders.length} đơn</span>
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">Ngày Đặt</th>
            <th className="px-6 py-3 text-left font-semibold">Khách Hàng</th>
            <th className="px-6 py-3 text-left font-semibold">Chi Tiết Đơn</th>
            <th className="px-6 py-3 text-left font-semibold">Tổng Tiền</th>
            <th className="px-6 py-3 text-left font-semibold">Trạng Thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">
                <Inbox className="w-10 h-10 mx-auto mb-2 opacity-50" />
                Không có đơn hàng nào trong danh sách này.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id} className="hover:bg-amber-50/30 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  <div className="font-medium">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                  <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{order.customerInfo.name}</div>
                  <div className="text-amber-600 text-xs font-medium">{order.customerInfo.phone}</div>
                  {order.customerInfo.note && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-100 max-w-xs">
                      <p className="text-xs text-yellow-800 flex gap-1">
                        <MessageSquare size={12} className="mt-0.5 flex-shrink-0" />
                        <span className="italic">"{order.customerInfo.note}"</span>
                      </p>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  <div className="space-y-1">
                    {order.orderItems.map((item) => (
                      <div key={item.dish} className="flex items-center text-xs sm:text-sm">
                        <span className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold mr-2 text-gray-600">{item.quantity}</span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-base font-bold text-amber-600">{order.totalPrice.toLocaleString('vi-VN')} ₫</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none outline-none cursor-pointer shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-amber-200 ${getStatusStyle(order.status)}`}
                  >
                    <option value="Đang chờ xử lý">⏳ Chờ xử lý</option>
                    <option value="Đã xác nhận">🔵 Xác nhận</option>
                    <option value="Đã hoàn thành">✅ Hoàn thành</option>
                    <option value="Đã hủy">❌ Hủy đơn</option>
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

// Component Trang Chính
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStats, setShowStats] = useState(true); // Toggle biểu đồ
  const { token } = useAuth(); 

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
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

  const handleUpdateStatus = async (orderId, newStatus) => {
    const previousOrders = [...orders];
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));

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
      if (!response.ok) throw new Error('Cập nhật thất bại');
    } catch (err) {
      setError(err.message);
      setOrders(previousOrders);
    }
  };

  // --- TÍNH TOÁN THỐNG KÊ (LOCAL) ---
  const stats = useMemo(() => {
    if (!orders.length) return null;

    // 1. Doanh thu 7 ngày
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const revenueData = last7Days.map(date => {
      const dayOrders = orders.filter(o => 
        o.createdAt.startsWith(date) && 
        (o.status === 'Đã hoàn thành' || o.status === 'Đã xác nhận') // Tính cả đã xác nhận để demo
      );
      return {
        date: new Date(date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'}),
        total: dayOrders.reduce((sum, o) => sum + o.totalPrice, 0)
      };
    });

    // 2. Top món bán chạy
    const dishCount = {};
    orders.forEach(order => {
      if (order.status !== 'Đã hủy') {
        order.orderItems.forEach(item => {
          dishCount[item.name] = (dishCount[item.name] || 0) + item.quantity;
        });
      }
    });
    const topDishes = Object.entries(dishCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 3. Trạng thái
    const statusData = [
        { name: 'Chờ xử lý', value: orders.filter(o => o.status === 'Đang chờ xử lý').length },
        { name: 'Đã hoàn thành', value: orders.filter(o => o.status === 'Đã hoàn thành').length },
        { name: 'Đã hủy', value: orders.filter(o => o.status === 'Đã hủy').length },
    ];

    return { revenueData, topDishes, statusData };
  }, [orders]);

  const COLORS = ['#fbbf24', '#22c55e', '#ef4444']; // Amber, Green, Red
  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-gray-50"><Loader className="w-10 h-10 text-amber-500 animate-spin" /></div>;

  const pendingOrders = orders.filter((o) => o.status === 'Đang chờ xử lý');
  const processedOrders = orders.filter((o) => o.status !== 'Đang chờ xử lý');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-10">
      {/* Header */}
      <div className="bg-gray-900 text-white shadow-lg border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Đơn Hàng</h1>
                    <p className="text-gray-400 text-sm">Theo dõi và xử lý đơn đặt món tại <span className="text-amber-500 font-semibold">L'ESSENCE</span></p>
                </div>
                <button onClick={() => setShowStats(!showStats)} className="bg-gray-800 hover:bg-gray-700 text-amber-500 px-4 py-2 rounded-lg text-sm font-bold border border-gray-700 transition-all">
                    {showStats ? 'Ẩn Thống Kê' : 'Hiện Thống Kê'}
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 -mt-4 space-y-8">
        {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm"><p><span className="font-bold">Lỗi:</span> {error}</p></div>}
        
        {/* --- KHU VỰC THỐNG KÊ (MỚI) --- */}
        {showStats && stats && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-down">
                {/* Chart 1: Doanh thu */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                    <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-green-600"/> Doanh Thu 7 Ngày Gần Nhất</h3>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{fontSize: 11}} />
                                <YAxis hide />
                                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                                <Area type="monotone" dataKey="total" stroke="#059669" fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Top Món & Trạng thái (Tabbed or Stacked) */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-6">
                    {/* Top Món */}
                    <div className="flex-1">
                        <h3 className="text-gray-800 font-bold mb-2 flex items-center gap-2 text-sm"><Award size={16} className="text-amber-500"/> Top 3 Món Bán Chạy</h3>
                        <div className="h-[100px] w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.topDishes.slice(0, 3)} layout="vertical" margin={{left: 0}}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} interval={0} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="count" fill="#1f2937" radius={[0, 4, 4, 0]} barSize={15} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* Status Pie */}
                    <div className="flex-1 border-t border-dashed pt-4">
                        <h3 className="text-gray-800 font-bold mb-2 flex items-center gap-2 text-sm"><PieIcon size={16} className="text-blue-500"/> Tỉ Lệ Đơn</h3>
                        <div className="h-[100px] w-full flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={stats.statusData} cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={5} dataKey="value">
                                        {stats.statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconSize={8} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '10px'}}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <OrdersTable orders={pendingOrders} onUpdateStatus={handleUpdateStatus} title="Đơn hàng Mới (Cần xử lý)" icon={Clock} />
        <OrdersTable orders={processedOrders} onUpdateStatus={handleUpdateStatus} title="Lịch sử Đơn hàng" icon={CheckCircle} />
      </div>
    </div>
  );
};

export default OrderManagement;