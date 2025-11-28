import axios from 'axios';

const axiosClient = axios.create({
    // Tự động lấy URL từ biến môi trường VITE_API_URL
    // Nếu không có biến môi trường, dùng mặc định localhost
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: {
        'Content-Type': 'application/json',
    },
});

// Tự động gắn Token vào mọi request (nếu có)
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;