// src/context/authContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000/api/auth'; 

/**
 * Hook tùy chỉnh để sử dụng trạng thái và hàm xác thực.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// State ban đầu (kiểm tra localStorage cho trạng thái)
const getInitialAuthState = () => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    return {
        isAuthenticated: !!storedToken, 
        token: storedToken || null,
        userRole: storedRole || null
    };
};

// Component Provider
export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(getInitialAuthState);
    const navigate = useNavigate();
    
    // KHẮC PHỤC LỖI REFERENCE: Lấy các biến từ state
    const { isAuthenticated, userRole, token } = authState;

    // =========================================================================
    // 1. HÀM ĐĂNG NHẬP (GỌI API)
    // =========================================================================
    const login = async (email, password) => {
        try {
            console.log(`[Context Login] Gửi yêu cầu với Email: ${email}`);
            if (!email || !password) {
                throw new Error("Email và mật khẩu là bắt buộc.");
            }
            
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại.'); 
            }

            // Đăng nhập thành công
            const { token, user } = data; 
            const role = user.role || 'customer'; 

            setAuthState({ isAuthenticated: true, userRole: role, token: token });
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            
            navigate(role === 'admin' ? '/admin' : '/');
            return { success: true };

        } catch (error) {
            console.error("Lỗi đăng nhập:", error.message);
            return { success: false, message: error.message };
        }
    };

    // =========================================================================
    // 2. HÀM ĐĂNG KÝ (GỌI API) - Logic cơ bản
    // =========================================================================
    const register = async (name, email, password, phone) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng ký thất bại.'); 
            }
            
            // Tự động đăng nhập sau khi đăng ký thành công (tùy chọn)
            const { token, user } = data;
            const role = user.role || 'customer';

            setAuthState({ isAuthenticated: true, userRole: role, token: token });
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            navigate('/'); 
            return { success: true };

        } catch (error) {
            console.error("Lỗi đăng ký:", error.message);
            return { success: false, message: error.message };
        }
    };

    // =========================================================================
    // 3. HÀM ĐĂNG XUẤT
    // =========================================================================
    const logout = () => {
        setAuthState({ isAuthenticated: false, userRole: null, token: null });
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/'); 
    };

    // Giá trị cung cấp cho các component con
    const value = {
        isAuthenticated, 
        userRole,
        token,
        login,
        register, 
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};