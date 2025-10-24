// src/components/homepage/MenuTeaser.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, AlertCircle } from 'lucide-react';
// Import 'DishCard' từ thư mục 'common'
import DishCard from '../common/DishCard'; 

const MenuTeaser = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeaserDishes = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        // Gọi API lấy tất cả món ăn
        const response = await fetch(`${API_URL}/dishes`); 
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch dishes');
        }
        
        // Chỉ lấy 4 món đầu tiên để làm "teaser" (xem trước)
        setDishes(data.data.slice(0, 4)); 
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeaserDishes();
  }, []);

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tiêu đề */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold font-serif text-amber-500">
            Khám phá Thực đơn
          </h2>
          <p className="text-lg text-gray-400 mt-2 max-w-2xl mx-auto">
            Một số món ăn đặc trưng được yêu thích nhất tại L'Essence.
          </p>
        </div>

        {/* Loading và Lỗi */}
        {loading && (
          <div className="flex justify-center">
            <Loader className="w-12 h-12 text-amber-500 animate-spin" />
          </div>
        )}
        {error && (
          <div className="text-red-400 bg-red-900/50 p-4 rounded-lg border border-red-700 flex items-center gap-3 max-w-lg mx-auto">
            <AlertCircle />
            <p><span className="font-bold">Lỗi:</span> {error}</p>
          </div>
        )}

        {/* Hiển thị các món ăn */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {dishes.map(dish => (
              <DishCard key={dish._id} dish={dish} showButton={false} />
            ))}
          </div>
        )}

        {/* Nút bấm xem toàn bộ */}
        <div className="text-center mt-12">
          <Link
            to="/thuc-don" // Dẫn đến trang Thực đơn đầy đủ
            className="inline-block bg-amber-600 text-white font-bold py-3 px-8 rounded-lg text-lg
                       hover:bg-amber-700 transition-colors shadow-lg"
          >
            Xem Toàn bộ Thực đơn
          </Link>
        </div>
        
      </div>
    </section>
  );
};

export default MenuTeaser;