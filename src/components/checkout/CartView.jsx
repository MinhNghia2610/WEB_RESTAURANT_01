import React from 'react';
import { useCart } from '../../context/CartContext';

const CartView = () => {
  const { cartItems } = useCart();

  return (
    <div className="space-y-0 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {cartItems.map((item) => (
        <div key={item._id} className="flex justify-between items-center py-4 border-b border-gray-700/50 last:border-0 group hover:bg-gray-700/20 rounded-lg px-2 transition-colors">
          <div className="flex items-center gap-4">
            {/* Hình ảnh món ăn */}
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-600 group-hover:border-amber-500/50 transition-colors relative">
                 <img 
                    src={item.imageURL || 'https://placehold.co/100'} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                 />
                 <div className="absolute bottom-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md">
                    x{item.quantity}
                 </div>
            </div>
            
            {/* Thông tin */}
            <div>
              <h4 className="font-serif font-bold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                  {item.name}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                  Đơn giá: {item.price.toLocaleString('vi-VN')}₫
              </p>
            </div>
          </div>
          
          {/* Tổng tiền món */}
          <div className="text-right">
             <p className="font-bold text-amber-400 text-base font-sans">
                {(item.price * item.quantity).toLocaleString('vi-VN')}₫
             </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartView;