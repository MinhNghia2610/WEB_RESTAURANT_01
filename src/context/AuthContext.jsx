import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

/**
 * Hook tùy chỉnh để sử dụng trạng thái và hàm xác thực.
 * @returns {object} { isAuthenticated, userRole, token, login, logout }
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return {
        isAuthenticated: context.isAuthenticated,
        userRole: context.userRole,
        token: context.token, // <-- Đã thêm
        login: context.login,
        logout: context.logout,
    };
};

// State ban đầu (kiểm tra localStorage cho trạng thái)
const getInitialAuthState = () => {
    const storedToken = localStorage.getItem('token'); // Lấy Token
    const storedRole = localStorage.getItem('role');

    return {
        isAuthenticated: !!storedToken, 
        token: storedToken || null,     // Lưu Token
        userRole: storedRole || null
    };
};

// Component Provider
export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(getInitialAuthState);
    const navigate = useNavigate();
    
    const { isAuthenticated, userRole, token } = authState; // <-- Đã thêm token

    // 3. Hàm xử lý Đăng nhập (nhận cả token và role)
    const login = (token, role) => {
        setAuthState({ isAuthenticated: true, userRole: role, token: token });
        
        localStorage.setItem('token', token); // Lưu token
        localStorage.setItem('role', role);
        
        if (role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    // 4. Hàm xử lý Đăng xuất
    const logout = () => {
        setAuthState({ isAuthenticated: false, userRole: null, token: null });
        
        localStorage.removeItem('token'); // Xóa token
        localStorage.removeItem('role');

        navigate('/'); 
    };

    // Giá trị cung cấp cho các component con
    const value = {
        isAuthenticated, 
        userRole,        
        token,            // Cung cấp token
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};