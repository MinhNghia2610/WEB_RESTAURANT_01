// src/components/checkout/CartView.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import { Plus, Minus, Trash2 } from 'lucide-react';

// Component con cho từng món hàng (phiên bản thu gọn)
const CartViewItem = ({ item, updateQuantity, removeFromCart }) => (
  <div className="flex items-start gap-3 py-4 border-b border-gray-600">
    <img 
      src={item.imageURL || 'https://placehold.co/100x100'} 
      alt={item.name}
      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
    />
    <div className="flex-grow">
      <h4 className="font-semibold text-amber-500">{item.name}</h4>
      <p className="text-sm text-gray-400">
        {item.price.toLocaleString('vi-VN')} VNĐ
      </p>
      
      {/* Nút tăng giảm số lượng (thu nhỏ) */}
      <div className="flex items-center gap-2 mt-1">
        <button 
          onClick={() => updateQuantity(item._id, item.quantity - 1)}
          className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
        >
          <Minus size={14} />
        </button>
        <span className="font-bold w-6 text-center text-white">{item.quantity}</span>
        <button 
          onClick={() => updateQuantity(item._id, item.quantity + 1)}
          className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
    
    {/* Giá tổng của món này */}
    <div className="flex flex-col items-end flex-shrink-0">
      <p className="font-bold text-white whitespace-nowrap">
        {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
      </p>
      {/* Nút Xóa (thu nhỏ) */}
      <button 
        onClick={() => removeFromCart(item._id)}
        className="text-gray-500 hover:text-red-500 text-sm mt-1"
      >
        Xóa
      </button>
    </div>
  </div>
);

// Component chính
const CartView = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return <p className="text-gray-400">Giỏ hàng của bạn trống.</p>;
  }

  return (
    // Thêm thanh cuộn nếu giỏ hàng quá dài
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
      {cartItems.map(item => (
        <CartViewItem 
          key={item._id} 
          item={item} 
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      ))}
    </div>
  );
};

export default CartView;