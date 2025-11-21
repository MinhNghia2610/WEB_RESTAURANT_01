import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; 
import AdminLayout from './AdminLayout.jsx'; 

/*
 * Component ProtectedRoute (Bảo vệ tuyến đường)
 * Component này sử dụng useAuth() để kiểm tra vai trò người dùng.
 * Nếu là Admin hợp lệ, nó sẽ hiển thị AdminLayout bọc lấy nội dung trang con (Outlet).
 */
const ProtectedRoute = () => {
    // 1. Sử dụng hook useAuth để lấy trạng thái
    // Đồng bộ với AuthContext.jsx: trả về isAuthenticated và userRole
    const { isAuthenticated, userRole } = useAuth();
    
    // 2. Kiểm tra điều kiện:
    // Phải được xác thực VÀ Vai trò (Role) phải là 'admin'
    // Lưu ý: role trong AuthContext của bạn là userRole, nên sử dụng userRole ở đây.
    const isAdmin = isAuthenticated && userRole === 'admin';

    // 3. Logic chuyển hướng:
    if (!isAdmin) {
        // Nếu chưa đăng nhập HOẶC không phải Admin, chuyển hướng đến trang /auth
        return <Navigate to="/" replace={true} />;
    }

    // 4. Nếu là Admin hợp lệ, HIỂN THỊ ADMIN LAYOUT và nội dung trang con (Outlet)
    // Việc bọc <Outlet /> trong <AdminLayout /> là chìa khóa để hiển thị Sidebar/Header.
    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    );
};

export default ProtectedRoute;
