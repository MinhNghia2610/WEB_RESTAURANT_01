// src/pages/ResetPasswordPage.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api/auth'; 

const ResetPasswordPage = () => {
    const { token } = useParams(); // Lấy token từ URL
    const navigate = useNavigate();
    const { login } = useAuth();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setError('Mật khẩu và Xác nhận Mật khẩu không khớp.');
            return;
        }

        if (password.length < 6) {
             setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/reset-password/${token}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đặt lại mật khẩu thất bại.');
            }

            setMessage('Đặt lại mật khẩu thành công! Đang tự động đăng nhập...');

            // Tự động đăng nhập sau khi đặt lại mật khẩu
            if (data.token) {
                // Giả sử Backend trả về token và user
                const { token, user } = data;
                const role = user.role || 'customer';

                // Tự động đăng nhập bằng hàm login (chỉ lưu state, không gọi API)
                // Lưu ý: Đây là cách tạm, nếu hàm login của bạn chỉ gọi API, bạn cần hàm loginSuccess riêng.
                // Ở đây, tôi gọi hàm loginSuccess nội bộ:
                login({ token, role }); // Đây là cú pháp giả định, nếu hàm login của bạn phức tạp hơn, bạn cần điều chỉnh.
            
                // Nếu không dùng hàm login của Context, chỉ cần lưu và điều hướng:
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                
                setTimeout(() => {
                    navigate(role === 'admin' ? '/admin' : '/');
                }, 2000); 

            } else {
                 setTimeout(() => {
                    navigate('/login');
                }, 2000); 
            }
            

        } catch (err) {
            setError(err.message || 'Lỗi kết nối server khi đặt lại mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-amber-500 mb-6">
                    Đặt Lại Mật Khẩu
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Mật khẩu mới */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            Mật khẩu mới
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Xác nhận Mật khẩu */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">
                            {error}
                        </p>
                    )}
                    
                    {message && (
                        <p className="text-green-400 bg-green-900/50 p-3 rounded-lg text-center">
                            {message}
                        </p>
                    )}

                    {/* Nút Submit */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading || !!message}
                            className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Đang đặt lại..." : "Đặt Lại Mật Khẩu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;