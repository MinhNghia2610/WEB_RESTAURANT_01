// src/components/order/OrderMenu.jsx (ĐÃ NÂNG CẤP BỘ ĐẾM SỐ LƯỢNG)
import React from 'react';
import { useCart } from '../../context/CartContext'; 
import { Plus, Minus } from 'lucide-react'; // <-- 1. IMPORT THÊM ICON "MINUS"

// ==========================================================
// ⭐️ COMPONENT CON ĐÃ ĐƯỢC NÂNG CẤP ⭐️
// ==========================================================
const OrderItemCard = ({ dish }) => {
  // 2. LẤY TOÀN BỘ CONTEXT, BAO GỒM CẢ cartItems VÀ updateQuantity
  const { cartItems, addToCart, updateQuantity } = useCart(); 

  // 3. TÌM SỐ LƯỢNG CỦA CHÍNH MÓN NÀY TRONG GIỎ HÀNG
  const itemInCart = cartItems.find(item => item._id === dish._id);
  const quantity = itemInCart ? itemInCart.quantity : 0;

  return (
    <div className="flex items-start gap-4 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-sm">
      <img 
        src={dish.imageURL || 'https://placehold.co/100x100'} 
        alt={dish.name}
        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-grow">
        <h4 className="text-lg font-bold text-amber-500">{dish.name}</h4>
        <p className="text-sm text-gray-400 mb-2">{dish.description}</p>
        <p className="text-lg font-semibold text-white">
          {dish.price.toLocaleString('vi-VN')} VNĐ
        </p>
      </div>
      
      {/* 4. HIỂN THỊ CỤM NÚT MỚI */}
      <div className="flex-shrink-0 flex items-center justify-center gap-2">
        {quantity === 0 ? (
          // NẾU SỐ LƯỢNG LÀ 0, HIỂN THỊ NÚT "+" LỚN
          <button 
            onClick={() => addToCart(dish)}
            className="flex-shrink-0 bg-amber-500 text-white p-3 rounded-full
                       hover:bg-amber-600 transition-colors shadow-lg"
            aria-label={`Thêm ${dish.name} vào giỏ`}
          >
            <Plus size={20} />
          </button>
        ) : (
          // NẾU SỐ LƯỢNG > 0, HIỂN THỊ BỘ ĐẾM
          <>
            <button
              onClick={() => updateQuantity(dish._id, quantity - 1)}
              className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              <Minus size={16} />
            </button>
            
            <span className="font-bold text-white text-lg w-8 text-center">
              {quantity}
            </span>
            
            <button
              onClick={() => addToCart(dish)} // Hàm addToCart sẽ tự +1
              className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              <Plus size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ==========================================================
// COMPONENT CHÍNH (Không thay đổi)
// ==========================================================
const OrderMenu = ({ dishes, categoryRefs }) => {

  // Chia món ăn theo danh mục (category)
  const categories = dishes.reduce((acc, dish) => {
    (acc[dish.category] = acc[dish.category] || []).push(dish);
    return acc;
  }, {});
  
  const sortedCategories = Object.keys(categories).sort();

  if (dishes.length === 0) {
    return (
      <p className="text-center text-gray-400 text-lg">
        Không tìm thấy món ăn nào phù hợp.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {/* Lặp qua từng danh mục */}
      {sortedCategories.map(categoryName => (
        <div 
          key={categoryName}
          // Gán ref cho logic scroll-spy
          ref={el => categoryRefs.current[categoryName] = el}
          data-category={categoryName}
        >
          <h3 className="text-3xl font-bold font-serif text-amber-500 mb-6 pb-2 border-b-2 border-amber-500/30">
            {categoryName}
          </h3>
          {/* Lặp qua từng món ăn */}
          <div className="space-y-4">
            {categories[categoryName].map(dish => (
              <OrderItemCard key={dish._id} dish={dish} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderMenu;