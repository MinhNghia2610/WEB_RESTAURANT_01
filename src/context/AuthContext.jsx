import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Khởi tạo Context
const AuthContext = createContext(null);

/**
 * Hook tùy chỉnh để sử dụng trạng thái và hàm xác thực.
 * @returns {object} { isAuthenticated, userRole, login, logout }
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    // Trả về các giá trị trực tiếp từ context
    return {
        isAuthenticated: context.isAuthenticated,
        userRole: context.userRole,
        login: context.login,
        logout: context.logout,
    };
};

// State ban đầu (kiểm tra localStorage cho trạng thái giả lập)
const getInitialAuthState = () => {
    // Lấy role được lưu trữ (user hoặc admin)
    const storedRole = localStorage.getItem('role');

    return {
        isAuthenticated: !!storedRole, // True nếu có role được lưu
        userRole: storedRole || null
    };
};

// 2. Component Provider
export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(getInitialAuthState);
    const navigate = useNavigate();
    
    // Tách state để dễ dàng truy cập từ useAuth
    const { isAuthenticated, userRole } = authState;

    // 3. Hàm xử lý Đăng nhập
    const login = (role) => {
        setAuthState({ isAuthenticated: true, userRole: role });
        
        // Cập nhật localStorage để duy trì trạng thái giả lập sau khi tải lại trang
        localStorage.setItem('role', role);
        
        // Logic chuyển hướng sau khi đăng nhập thành công
        if (role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    // 4. Hàm xử lý Đăng xuất
    const logout = () => {
        setAuthState({ isAuthenticated: false, userRole: null });
        
        // Xóa thông tin khỏi localStorage
        localStorage.removeItem('role');

        // CHỈNH SỬA TẠI ĐÂY: Chuyển hướng về trang chủ chính (/)
        navigate('/'); 
    };

    // Giá trị cung cấp cho các component con
    const value = {
        isAuthenticated, // Đã được tách ra
        userRole,        // Đã được tách ra
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
