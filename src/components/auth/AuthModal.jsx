// src/components/auth/AuthModal.jsx (ĐÃ THIẾT KẾ LẠI - DỰA TRÊN CODE CỦA BẠN)
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { X } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState("login");
  
  // State này để hiển thị thông báo thành công toàn cục
  const [globalMessage, setGlobalMessage] = useState(null);

  // Hàm để chuyển chế độ và xóa thông báo
  const switchMode = (newMode) => {
    setMode(newMode);
    setGlobalMessage(null);
  };

  // Hàm được gọi khi đăng ký thành công
  const handleRegisterSuccess = (message) => {
    setGlobalMessage(message);
    setMode("login"); // Chuyển sang tab đăng nhập
  };

  const getTitle = () => {
    if (mode === "login") return "Đăng nhập";
    if (mode === "register") return "Đăng ký Tài khoản";
    if (mode === "forgot") return "Quên Mật khẩu";
    return "";
  };

  return (
    // Lớp nền mờ (Backdrop)
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Khung Nội dung Modal (Theme tối) */}
      <div
        className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-xl
                   border border-gray-700 p-8" // <-- SỬA
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Nút Đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors" // <-- SỬA
        >
          <X size={28} /> {/* <-- SỬA (Dùng icon) */}
        </button>

        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold font-serif text-center text-amber-500 mb-6"> {/* <-- SỬA */}
          {getTitle()}
        </h2>

        {/* Thông báo thành công toàn cục */}
        {globalMessage && (
          <p className="mb-4 text-green-300 text-sm font-medium p-3 
                       bg-green-900/50 rounded-lg border border-green-700"> {/* <-- SỬA */}
            {globalMessage}
          </p>
        )}

        {/* Render component con */}
        
        {mode === 'login' && (
          <LoginForm
            onAuthSuccess={onClose} 
            onSwitchToRegister={() => switchMode('register')}
            onSwitchToForgot={() => switchMode('forgot')}
          />
        )}
        
        {mode === 'register' && (
          <RegisterForm
            onRegisterSuccess={handleRegisterSuccess} 
            onSwitchToLogin={() => switchMode('login')}
          />
        )}
        
        {mode === 'forgot' && (
          <ForgotPasswordForm
            onSwitchToLogin={() => switchMode('login')}
          />
        )}

      </div>
    </div>
  );
};

export default AuthModal;