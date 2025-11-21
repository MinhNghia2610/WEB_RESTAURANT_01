import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  DollarSign, ShoppingBag, Users, Calendar, 
  TrendingUp, Activity 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    clients: 0,
    reservations: 0,
    growth: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm format tiền VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getToken = () => {
    const userInfo = localStorage.getItem('userInfo') 
      ? JSON.parse(localStorage.getItem('userInfo')) 
      : null;
    return userInfo?.token || '';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        // Gọi API song song
        const [statsRes, chartRes] = await Promise.all([
            axios.get(`${API_URL}/dashboard/stats`, config),
            axios.get(`${API_URL}/dashboard/revenue_chart`, config)
        ]);

        if (statsRes.data.success) {
            setStats(statsRes.data.data);
        }
        if (chartRes.data.success) {
            setChartData(chartRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Tổng Quan</h1>
        <p className="text-gray-400 text-sm mt-1">Chào mừng trở lại, Admin!</p>
      </div>

      {/* --- CÁC THẺ THỐNG KÊ --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Doanh Thu */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:border-amber-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium uppercase">Tổng Doanh Thu</p>
              <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.revenue)}</h3>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-lg text-amber-500">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-400">
            <TrendingUp size={16} className="mr-1" />
            <span>+{stats.growth}% so với tháng trước</span>
          </div>
        </div>

        {/* Đơn Hàng */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:border-blue-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium uppercase">Tổng Đơn Hàng</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.orders}</h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500">
              <ShoppingBag size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <span>Đơn hàng đã hoàn tất</span>
          </div>
        </div>

        {/* Khách Hàng */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:border-purple-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium uppercase">Khách Hàng</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.clients}</h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-500">
              <Users size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <span>Tài khoản đăng ký</span>
          </div>
        </div>

        {/* Đặt Bàn */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:border-pink-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium uppercase">Đặt Bàn</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.reservations}</h3>
            </div>
            <div className="p-3 bg-pink-500/20 rounded-lg text-pink-500">
              <Calendar size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <span>Lượt đặt chỗ</span>
          </div>
        </div>
      </div>

      {/* --- BIỂU ĐỒ --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ doanh thu (Chiếm 2/3) */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Biểu Đồ Doanh Thu (7 ngày)</h3>
            <div className="p-2 bg-gray-700 rounded-lg">
              <Activity size={20} className="text-amber-500" />
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} 
                   tickFormatter={(value) => `${value / 1000}k`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  itemStyle={{ color: '#fbbf24' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="revenue" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hoạt động gần đây (Chiếm 1/3) */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Hoạt Động Hệ Thống</h3>
          <div className="space-y-6">
             <div className="flex gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                <div>
                   <p className="text-sm text-white font-medium">Hệ thống hoạt động bình thường</p>
                   <p className="text-xs text-gray-500">Server status: Online</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                <div>
                   <p className="text-sm text-white font-medium">Cập nhật dữ liệu tự động</p>
                   <p className="text-xs text-gray-500">Mỗi 5 phút</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
                <div>
                   <p className="text-sm text-white font-medium">Database MongoDB</p>
                   <p className="text-xs text-gray-500">Connected</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;