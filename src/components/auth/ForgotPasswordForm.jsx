// src/components/auth/ForgotPassForm.jsx

import { useState } from 'react';

const API_URL = 'http://localhost:5000/api/auth'; 

const ForgotPassForm = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Xử lý lỗi server (400, 500)
                throw new Error(data.message || 'Lỗi gửi yêu cầu đặt lại mật khẩu.');
            }

            // Gửi thành công (kể cả khi email không tồn tại - bảo mật)
            setMessage(data.message || 'Yêu cầu đã được gửi. Vui lòng kiểm tra email của bạn.');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-300">
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
                    className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            {/* Hiển thị thông báo hoặc lỗi */}
            {message && (
                <p className="text-green-400 bg-green-900/50 p-3 rounded-lg text-center">
                    {message}
                </p>
            )}

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
                    className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                    {loading ? "Đang gửi..." : "Gửi Email Đặt lại"}
                </button>
            </div>

            {/* Nút Quay lại Đăng nhập */}
            <p className="mt-2 text-center text-sm text-gray-400">
                <button
                    type="button"
                    onClick={onSwitchToLogin} 
                    className="font-medium text-amber-500 hover:text-amber-400 hover:underline transition-colors"
                >
                    Quay lại Đăng nhập
                </button>
            </p>
        </form>
    );
};

export default ForgotPassForm;