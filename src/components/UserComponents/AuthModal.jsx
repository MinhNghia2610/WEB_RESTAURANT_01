import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx'; 

// Component hiển thị thông báo lỗi
const ErrorMessage = ({ message }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
        <span className="block sm:inline text-sm">{message}</span>
    </div>
);

// Component chính: Modal Đăng nhập/Đăng ký (Chế độ Tĩnh/Giả lập)
// Thêm prop onClose để đóng Modal
const AuthModal = ({ isOpen, onClose }) => { 
    // 1. Lấy hàm login từ Context
    const { login } = useAuth();

    const [isLogin, setIsLogin] = useState(true); // Trạng thái: Login (true) hoặc Register (false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // Reset form khi Modal đóng hoặc chuyển đổi chế độ
    useEffect(() => {
        setError(null);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setLoading(false);
    }, [isLogin, isOpen]);

    if (!isOpen) return null; // Không hiển thị Modal nếu isOpen là false

    const handleAuthenticate = (e) => {
        e.preventDefault();
        setError(null);

        // --- Logic Validation UI Tĩnh ---
        if (!email || !password) {
            setError("Vui lòng nhập đầy đủ Email và Mật khẩu.");
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        // --- Logic Giả lập (Static/Simulated) ---
        setLoading(true);

        // Giả lập phân vai trò
        // Nếu email là admin@example.com, gán role 'admin', ngược lại là 'user'
        const role = email.toLowerCase() === 'admin@example.com' && password === '123456' ? 'admin' : 'user';
        
        // Giả lập lỗi nếu là đăng nhập và mật khẩu không phải 123456 (ví dụ tĩnh)
        if (isLogin && password !== '123456') {
            setTimeout(() => {
                setLoading(false);
                setError("Email hoặc mật khẩu không chính xác (Giả lập). Thử lại với admin@example.com / 123456 hoặc user@example.com / 123456.");
             }, 1000);
             return;
        }

        setTimeout(() => {
            setLoading(false);
            
            // 2. GỌI HÀM login TỪ CONTEXT
            login(role); 
            
            // 3. THÊM LỆNH ĐÓNG MODAL SAU KHI ĐĂNG NHẬP THÀNH CÔNG
            onClose(); // <--- ĐÃ THÊM: Đóng Modal sau khi gọi login thành công
            
            console.log(`ĐĂNG NHẬP GIẢ LẬP THÀNH CÔNG. Vai trò: ${role}`);
            
        }, 1500); // Giả lập 1.5 giây loading
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    // Giao diện người dùng
    const title = isLogin ? "Đăng Nhập" : "Đăng Ký Tài Khoản Mới";
    const actionText = isLogin ? "Đăng Nhập" : "Đăng Ký";

    // CSS cho Modal Overlay và Content
    const modalClasses = isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none";

    return (
        // Overlay - Click vào đây sẽ gọi onClose
        <div 
            className="fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 backdrop-blur-sm bg-black bg-opacity-70 flex items-center justify-center font-inter"
            onClick={onClose} // <--- ĐÃ SỬ DỤNG: Đóng Modal khi click vào Overlay
        >
            {/* Modal Content */}
            <div 
                className={`bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 mx-4 transition-all duration-300 transform ${modalClasses}`}
                onClick={(e) => e.stopPropagation()} // Ngăn chặn việc click vào nội dung làm Modal đóng
            >
                <button
                    onClick={onClose} // <--- ĐÃ SỬ DỤNG: Đóng Modal khi nhấn X
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition"
                    aria-label="Đóng"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        {title}
                    </h2>
                    <div className="flex justify-center mt-2 mb-6 space-x-2">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-800">
                            UI Tĩnh (Giả lập)
                        </span>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            Admin: admin@example.com
                        </span>
                    </div>
                </div>

                {error && <ErrorMessage message={error} />}

                <form className="space-y-6" onSubmit={handleAuthenticate}>
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Địa chỉ Email</label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition duration-150"
                                placeholder="admin@example.com hoặc user@example.com"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <div className="mt-1 relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition duration-150"
                                placeholder="123456"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input (Register only) */}
                    {!isLogin && (
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận Mật khẩu</label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition duration-150"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                loading
                                    ? 'bg-amber-400 cursor-not-allowed'
                                    : 'bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-150'
                            }`}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : isLogin ? (
                                <LogIn className="mr-2 h-5 w-5" />
                            ) : (
                                <UserPlus className="mr-2 h-5 w-5" />
                            )}
                            {loading ? 'Đang giả lập...' : actionText}
                        </button>
                    </div>
                </form>

                {/* Toggle Link */}
                <div className="mt-6">
                    <p className="text-center text-sm text-gray-600">
                        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-medium text-amber-600 hover:text-amber-500 ml-1 focus:outline-none"
                        >
                            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
