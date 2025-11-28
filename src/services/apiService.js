// src/services/apiService.js
const API_URL = 'http://localhost:5000/api'; // ĐẢM BẢO ĐƯỜNG DẪN NÀY ĐÚNG VỚI BACKEND CỦA BẠN

// --- Cấu hình API để gửi Token (Nếu cần) ---
export const api = async (endpoint, method = 'GET', data = null, isAuth = true) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };

    if (isAuth && token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
        body: data ? JSON.stringify(data) : null,
    };

    const response = await fetch(`${API_URL}/${endpoint}`, config);
    
    // Xử lý lỗi HTTP (400, 401, 500...)
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Lỗi mạng hoặc máy chủ không phản hồi.');
    }

    // Trả về dữ liệu nếu response không rỗng
    try {
        return await response.json();
    } catch (e) {
        return {}; // Trả về đối tượng rỗng nếu không có body (ví dụ: status 204 No Content)
    }
};

// --- HÀM ĐĂNG KÝ ---
export const register = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký thất bại.');
    }
    return response.json();
};

// --- HÀM ĐĂNG NHẬP ---
export const login = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại.');
    }
    return response.json();
};

// --- HÀM LẤY PROFILE ---
export const getProfile = async () => {
    return api('auth/profile', 'GET');
};

// --- HÀM LOGOUT (Thực chất chỉ xóa token) ---
export const logout = () => {
    // Logic logout thường nằm ở context, nhưng ta cần hàm này để tránh lỗi import
    return true; 
};