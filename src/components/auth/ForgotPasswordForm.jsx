// src/components/auth/ForgotPasswordForm.jsx (ĐÃ THIẾT KẾ LẠI - DỰA TRÊN LOGIC CỦA BẠN)
import { useState } from "react";

// Nhận props từ AuthModal
const ForgotPasswordForm = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState(null); // Thông báo thành công riêng

  // ==========================================================
  // LOGIC CỦA BẠN (GIỮ NGUYÊN - RẤT TỐT)
  // ==========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);

    if (!email) {
      setError("Vui lòng nhập địa chỉ Email.");
      return;
    }
    
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Đã xảy ra lỗi.");
        return;
      }
      
      // Hiển thị thông báo thành công (cục bộ)
      setResetMessage(data.message || "Đã gửi yêu cầu. Vui lòng kiểm tra email.");

    } catch (err) {
      setError("Không thể kết nối đến server. Vui lòng thử lại.");
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-400 mb-2">
        Nhập email bạn dùng để đăng ký. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
      </p>
      
      {/* Ô Email */}
      <div>
        <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-300 mb-1">
          Địa chỉ Email
        </label>
        <input
          id="forgot-email"
          type="email"
          placeholder="email@example.com"
          className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      {/* Hiển thị thông báo thành công (reset) */}
      {resetMessage && (
        <p className="text-green-300 bg-green-900/50 p-3 rounded-lg text-center border border-green-700">
          {resetMessage}
        </p>
      )}
      
      {/* Hiển thị lỗi */}
      {error && (
        <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">
          {error}
        </p>
      )}
      
      {/* Nút Submit (chỉ hiển thị khi chưa có thông báo thành công) */}
      {!resetMessage && (
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold text-lg
                       hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi Email Đặt lại"}
          </button>
        </div>
      )}

      {/* Nút Quay lại Đăng nhập */}
      <p className="mt-2 text-center text-sm text-gray-400">
        <button
          type="button"
          onClick={onSwitchToLogin} // Chuyển về form Đăng nhập
          className="font-medium text-amber-500 hover:text-amber-400 hover:underline transition-colors"
        >
          Quay lại Đăng nhập
        </button>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;