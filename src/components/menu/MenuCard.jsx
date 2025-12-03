import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const MenuCard = ({ dish }) => {
  return (
    <div className="group relative bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-amber-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-amber-900/10">
      
      {/* Hình ảnh với hiệu ứng Zoom */}
      <div className="h-56 overflow-hidden relative">
        <img
          src={dish.imageURL || 'https://placehold.co/600x400?text=L-ESSENCE'}
          alt={dish.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
        
        {/* Giá tiền nổi bật */}
        <div className="absolute bottom-4 right-4 bg-amber-600 text-white px-4 py-1 rounded-full font-bold shadow-lg">
            {dish.price.toLocaleString('vi-VN')} ₫
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 font-serif group-hover:text-amber-400 transition-colors">
            {dish.name}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {dish.description || "Một tuyệt tác ẩm thực được chế biến từ những nguyên liệu tươi ngon nhất, mang đậm dấu ấn L'ESSENCE."}
        </p>
        
        {/* Nút kêu gọi hành động */}
        <Link to="/dat-mon-online" className="inline-flex items-center text-amber-500 text-sm font-semibold hover:text-amber-300 transition-colors gap-2 group/link">
            Đặt món ngay <ArrowRight size={16} className="transform group-hover/link:translate-x-1 transition-transform"/>
        </Link>
      </div>
    </div>
  );
};

export default MenuCard;