// src/components/common/DishCard.jsx (ĐÃ THÊM PROP ẨN/HIỆN NÚT)
import React from 'react';
import { useCart } from '../../context/CartContext'; 
import { Plus, Minus } from 'lucide-react';

// 1. Thêm prop "showButton = true" (mặc định là hiển thị)
const DishCard = ({ dish, showButton = true }) => {
  
  // 2. Chỉ kết nối với useCart NẾU showButton là true
  // (Không cần lấy số lượng nếu không hiển thị nút)
  const { addItem, removeItem, getItemQuantity } = showButton ? useCart() : {};
  const quantity = showButton ? getItemQuantity(dish._id) : 0; 

  const handleAdd = () => {
    if (addItem) addItem(dish, 1);
  };
  
  const handleRemove = () => {
    if (removeItem) removeItem(dish._id);
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-700
                    flex flex-col transform hover:scale-105 transition-transform duration-300">
      
      <img
        src={dish.imageURL || 'https://placehold.co/400x300'}
        alt={dish.name}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold font-serif text-amber-500 mb-2">{dish.name}</h3>
        <p className="text-gray-400 text-sm flex-grow">{dish.description}</p>
        
        <div className="mt-4 flex justify-between items-center border-t border-gray-700 pt-3">
          <span className="text-2xl font-bold text-red-500">
            {dish.price.toLocaleString('vi-VN')} VNĐ
          </span>

          {/* 3. CHỈ HIỂN THỊ NÚT NẾU showButton LÀ TRUE */}
          {showButton && (
            <>
              {quantity === 0 ? (
                <button 
                  onClick={handleAdd} 
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-full"
                >
                  <Plus size={18}/> Thêm
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-gray-900 rounded-full p-1">
                  <button onClick={handleRemove} className="text-white hover:bg-red-600 p-1 rounded-full"><Minus size={18}/></button>
                  <span className="text-white font-bold w-6 text-center">{quantity}</span>
                  <button onClick={handleAdd} className="text-white hover:bg-green-600 p-1 rounded-full"><Plus size={18}/></button>
                </div>
              )}
            </>
          )}
          {/* Kết thúc logic ẩn/hiện nút */}

        </div>
      </div>
    </div>
  );
};

export default DishCard;