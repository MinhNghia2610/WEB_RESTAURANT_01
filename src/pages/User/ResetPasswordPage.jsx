// src/pages/User/ResetPasswordPage.jsx (ĐÃ THIẾT KẾ LẠI)
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  // Lấy token và email từ URL query parameters
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  
  // Lấy giá trị token và email từ URL
  const token = query.get('token'); 
  const email = query.get('email');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================================
  // LOGIC CỦA BẠN (GIỮ NGUYÊN - RẤT TỐT)
  // ==========================================================
  // Kiểm tra token và email ngay từ đầu
  if (!token || !email) {
    return (
      <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-3xl font-bold font-serif text-amber-500 mb-4">Lỗi</h2>
          <p className="text-red-400">Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword.length < 6) { // Thêm validation độ dài
        setError("Mật khẩu phải có ít nhất 6 ký tự.");
        return;
    }

    if (newPassword !== confirmPassword) {
        setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
        return;
    }

    setLoading(true);

    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, email, newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || "Đặt lại mật khẩu thất bại.");
            return;
        }

        setMessage(data.message + " Bạn sẽ được chuyển hướng về trang đăng nhập.");
        
        // Tự động chuyển về trang đăng nhập sau 3 giây
        setTimeout(() => {
            navigate('/'); // Chuyển về trang chủ, nơi AuthModal có thể được kích hoạt
        }, 3000);

    } catch (err) {
        setError("Lỗi kết nối server.");
    } finally {
        setLoading(false);
    }
  };
  // ==========================================================
  // KẾT THÚC LOGIC
  // ==========================================================


  // ==========================================================
  // GIAO DIỆN JSX (ĐÃ THIẾT KẾ LẠI THEME TỐI)
  // ==========================================================
  return (
    <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold font-serif text-amber-500 text-center mb-6">Đặt lại Mật khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ô Mật khẩu mới */}
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">
              Mật khẩu mới
            </label>
            <input
              id="new-password"
              type="password"
              placeholder="••••••••"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Ô Xác nhận mật khẩu mới */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          {/* Hiển thị lỗi */}
          {error && (
            <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">
              {error}
            </p>
          )}

          {/* Hiển thị thông báo thành công */}
          {message && (
            <p className="text-green-300 bg-green-900/50 p-3 rounded-lg text-center border border-green-700">
              {message}
            </p>
          )}

          {/* Nút Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !!message} // Disable nút nếu đang tải hoặc đã có thông báo thành công
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold text-lg
                         hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Xác nhận Đặt lại Mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;