// src/components/auth/RegisterForm.jsx
import { useState } from "react";

// Nhận props từ AuthModal
const RegisterForm = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!name || !email || !phone || !password) {
      setError("Vui lòng nhập đầy đủ Tên, Email, SĐT và Mật khẩu.");
      return;
    }
    
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const payload = { name, email, password, phone };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Đăng ký không thành công.");
        return;
      }
      
      // Đăng ký thành công! Báo cho component cha biết.
      onRegisterSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
      
    } catch (err) {
      setError("Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Ô Tên */}
      <div>
        <label htmlFor="register-name" className="block text-sm font-medium text-gray-300 mb-1">
          Tên đầy đủ
        </label>
        <input
          id="register-name"
          type="text"
          placeholder="Nguyễn Văn A"
          className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Ô SĐT */}
      <div>
        <label htmlFor="register-phone" className="block text-sm font-medium text-gray-300 mb-1">
          Số điện thoại
        </label>
        <input
          id="register-phone"
          type="tel"
          placeholder="0901234567"
          className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      {/* Ô Email */}
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          placeholder="email@example.com"
          className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Ô Mật khẩu */}
      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-300 mb-1">
          Mật khẩu
        </label>
        <input
          id="register-password"
          type="password"
          placeholder="••••••••"
          className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Ô Xác nhận Mật khẩu */}
      <div>
        <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
          Xác nhận mật khẩu
        </label>
        <input
          id="register-confirm-password"
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

      {/* Nút Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold text-lg
                     hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </div>

      {/* Nút Chuyển sang Đăng nhập */}
      <p className="mt-2 text-center text-sm text-gray-400">
        Đã có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin} // Chuyển sang form Đăng nhập
          className="font-medium text-amber-500 hover:text-amber-400 hover:underline transition-colors"
        >
          Đăng nhập
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;