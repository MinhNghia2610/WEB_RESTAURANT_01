// src/components/cart/CartModal.jsx (ĐÃ THÊM NÚT XÓA TẤT CẢ)

import React from 'react';
import { useCart } from '../../context/CartContext'; 
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Component con (Không thay đổi)
const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <div className="flex items-center gap-4 py-4 border-b border-gray-200">
    <img 
      src={item.imageURL || 'https://placehold.co/100x100'} 
      alt={item.name}
      className="w-20 h-20 object-cover rounded-md"
    />
    <div className="flex-grow">
      <h4 className="font-semibold text-gray-800">{item.name}</h4>
      <p className="text-sm text-gray-500">
        {item.price.toLocaleString('vi-VN')} VNĐ
      </p>
      <div className="flex items-center gap-2 mt-2">
        <button 
          onClick={() => updateQuantity(item._id, item.quantity - 1)}
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <Minus size={16} />
        </button>
        <span className="font-bold w-8 text-center">{item.quantity}</span>
        <button 
          onClick={() => updateQuantity(item._id, item.quantity + 1)}
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
    <button 
      onClick={() => removeFromCart(item._id)}
      className="text-red-500 hover:text-red-700"
    >
      <Trash2 size={20} />
    </button>
  </div>
);

// Component Modal chính
const CartModal = () => {
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, // <-- 1. LẤY HÀM clearCart TỪ CONTEXT
    itemCount, 
    totalPrice 
  } = useCart();

  if (!isCartOpen) return null; 

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50"
      onClick={closeCart}
    >
      <div 
        className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-xl z-[60] flex flex-col"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* 1. Header Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-2">
            <ShoppingBag size={24} />
            Giỏ Hàng ({itemCount})
          </h2>
          <button 
            onClick={closeCart} 
            className="text-gray-500 hover:text-red-600"
          >
            <X size={28} />
          </button>
        </div>

        {/* 2. Danh sách món hàng */}
        <div className="flex-grow p-6 overflow-y-auto">
          
          {/* ============================================== */}
          {/* ⭐️ SỬA 1: THÊM NÚT "XÓA TẤT CẢ" */}
          {/* ============================================== */}
          {cartItems.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={clearCart} // <-- 2. GỌI HÀM KHI NHẤN
                className="text-sm text-gray-500 hover:text-red-600 hover:underline flex items-center gap-1"
              >
                <Trash2 size={14} />
                Xóa tất cả
              </button>
            </div>
          )}

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Giỏ hàng của bạn đang trống.</p>
          ) : (
            <div>
              {cartItems.map(item => (
                <CartItem 
                  key={item._id} 
                  item={item} 
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* 3. Footer Modal (Tổng tiền & Thanh toán) */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
              <span className="text-2xl font-bold text-red-600">
                {totalPrice.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
            <Link to="/thanh-toan"> 
              <button 
                onClick={closeCart} 
                className="w-full bg-red-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors"
              >
                Tiến hành Thanh toán
              </button>
            </Link>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default CartModal;