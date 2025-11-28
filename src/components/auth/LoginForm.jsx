// src/components/auth/LoginForm.jsx

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const LoginForm = ({ onAuthSuccess, onSwitchToRegister, onSwitchToForgot }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }
    
    setLoading(true);

    try {
        // 🏆 KHẮC PHỤC LỖI LOGIC: Gọi hàm login trong Context (hàm này đã tự gọi API)
        const result = await login(email, password); 

        if (result.success) {
            onAuthSuccess();
        } else {
            setError(result.message || "Đăng nhập thất bại.");
        }

    } catch (err) {
      setError("Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Ô Email */}
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="email@example.com"
          className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Ô Password */}
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-1">
          Mật khẩu
        </label>
        <input
          id="login-password"
          type="password"
          placeholder="••••••••"
          className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Nút Quên mật khẩu */}
      <div className="text-right -mt-2">
        <button
          type="button"
          onClick={onSwitchToForgot} 
          className="text-sm text-gray-400 hover:text-amber-500 hover:underline transition-colors"
        >
          Quên mật khẩu?
        </button>
      </div>

      {/* Hiển thị lỗi */}
      {error && (
        <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">
          {error}
        </p>
      )}

      {/* Nút Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold text-lg
                     hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </div>

      {/* Nút Chuyển sang Đăng ký */}
      <p className="mt-2 text-center text-sm text-gray-400">
        Chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister} 
          className="font-medium text-amber-500 hover:text-amber-400 hover:underline transition-colors"
        >
          Đăng ký ngay
        </button>
      </p>
    </form>
  );
};

export default LoginForm;