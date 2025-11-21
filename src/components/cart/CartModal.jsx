import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartModal = () => {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    totalPrice 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Overlay làm mờ nền */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      ></div>

      {/* Sidebar Giỏ Hàng */}
      <div className="relative w-full max-w-md bg-gray-900 h-full shadow-2xl border-l border-gray-800 flex flex-col transform transition-transform duration-300 animate-slide-in-right">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900">
            <h2 className="text-2xl font-bold font-serif text-white flex items-center gap-2">
                <ShoppingBag className="text-amber-500" /> Giỏ Hàng
                <span className="text-sm font-sans font-normal text-gray-500 ml-2">({cartItems.length} món)</span>
            </h2>
            <button onClick={closeCart} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full">
                <X size={24} />
            </button>
        </div>

        {/* Body: Danh sách món */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                    <ShoppingBag size={64} strokeWidth={1} className="opacity-20" />
                    <p>Giỏ hàng đang trống</p>
                    <button onClick={closeCart} className="text-amber-500 hover:text-amber-400 font-bold text-sm underline">
                        Quay lại thực đơn
                    </button>
                </div>
            ) : (
                cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-amber-500/30 transition-all group">
                        {/* Ảnh */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-600 shrink-0">
                            <img src={item.imageURL || 'https://placehold.co/100'} alt={item.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Thông tin & Điều khiển */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-white text-sm line-clamp-2 pr-2">{item.name}</h3>
                                <button 
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-gray-500 hover:text-red-500 transition-colors"
                                    title="Xóa món"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            
                            <div className="flex justify-between items-end mt-2">
                                <p className="text-amber-500 font-bold text-sm">{item.price.toLocaleString('vi-VN')}₫</p>
                                
                                {/* Bộ điều chỉnh số lượng */}
                                <div className="flex items-center bg-gray-900 rounded-lg border border-gray-700">
                                    <button 
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-l-lg transition-colors"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-8 text-center text-sm font-bold text-white select-none">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-r-lg transition-colors"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer: Tổng tiền & Nút thanh toán */}
        {cartItems.length > 0 && (
            <div className="p-6 bg-gray-800 border-t border-gray-700 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-amber-500">{totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
                <Link 
                    to="/thanh-toan" 
                    onClick={closeCart}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:to-amber-400 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-1"
                >
                    TIẾN HÀNH THANH TOÁN <ArrowRight size={20} />
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;