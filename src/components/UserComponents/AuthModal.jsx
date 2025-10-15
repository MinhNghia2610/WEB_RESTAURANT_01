import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState(""); 
  const [phone, setPhone] = useState(""); // <-- THÊM STATE PHONE
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuthenticate = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Validate cơ bản
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!isLogin && !name) {
      setError("Vui lòng nhập Tên.");
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      // 2. Tạo Payload động (Thêm phone khi Đăng ký)
      const payload = isLogin
        ? { email, password }
        : { name, email, password, phone }; // <-- GỬI 'phone'

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Đã xảy ra lỗi khi xử lý yêu cầu.");
        return;
      }

      // 3. Xử lý thành công
      if (isLogin) {
        // Lưu token và user role vào context (giả sử login() xử lý JWT)
        login(data.token, data.user.role); 
        onClose(); 
      } else {
        alert("Đăng ký thành công! Hãy đăng nhập.");
        // Reset form và chuyển sang Đăng nhập
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setPhone(""); // <-- Reset phone
        setIsLogin(true); 
      }
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </h2>

        <form onSubmit={handleAuthenticate} className="flex flex-col gap-3">
          {!isLogin && ( // INPUT NAME
            <input
              type="text"
              placeholder="Tên của bạn"
              className="border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          
          {!isLogin && ( // THÊM INPUT PHONE MỚI
            <input
              type="tel" 
              placeholder="Số điện thoại"
              className="border rounded px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            className="border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              className="border rounded px-3 py-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading
              ? "Đang xử lý..."
              : isLogin
              ? "Đăng nhập"
              : "Đăng ký"}
          </button>
        </form>

        <p className="mt-3 text-center text-sm">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;