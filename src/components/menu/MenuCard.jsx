// src/components/menu/MenuCard.jsx (ĐÃ SỬA LỖI GIÁ)
import React from 'react';

/**
 * Hiển thị một món ăn dưới dạng thẻ (card).
 * @param {object} item - Đối tượng món ăn (dish) từ API.
 */
const MenuCard = ({ item }) => (
  <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col hover:shadow-amber-500/30 transition duration-300">
    
    {item.imageURL && (
      <img 
        src={item.imageURL} 
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x160/1f2937/d1d5db?text=Food"}}
        alt={item.name} 
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
    )}
    
    <h3 className="text-xl font-bold font-serif text-amber-500 mb-1">{item.name}</h3>
    <p className="text-sm text-gray-400 flex-grow mb-3">{item.description}</p>
    
    <div className="mt-auto pt-3 border-t border-gray-700">
      
      {/* ========================================================== */}
      {/* ⭐️ SỬA LỖI: Đã xóa (item.price * 1000) */}
      {/* ========================================================== */}
      <p className="text-2xl font-extrabold text-white text-right">
        {item.price 
          ? `${item.price.toLocaleString('vi-VN')} ${item.unit || 'VNĐ'}` 
          : item.unit || "Liên hệ"}
      </p>

    </div>
  </div>
);

export default MenuCard;