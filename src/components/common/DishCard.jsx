import React from 'react';
import { useCart } from '../../context/CartContext';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

const DishCard = ({ dish }) => {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(dish._id);

  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-700 hover:border-amber-500/50 transition-all duration-300 group flex flex-col h-full">
      {/* Hình ảnh */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={dish.imageURL || 'https://placehold.co/400x300?text=No+Image'}
          alt={dish.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        {/* Badge giá tiền */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-amber-400 px-3 py-1 rounded-full text-sm font-bold border border-amber-500/30">
           {dish.price.toLocaleString('vi-VN')} ₫
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
            <h3 className="text-lg font-bold text-white mb-1 font-serif line-clamp-1" title={dish.name}>
            {dish.name}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
            {dish.description || 'Hương vị tuyệt hảo từ L\'ESSENCE.'}
            </p>
        </div>

        {/* Nút điều khiển */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          {quantity === 0 ? (
            <button
              onClick={() => addItem(dish)}
              className="w-full bg-gray-700 hover:bg-amber-600 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium group-hover:bg-amber-600"
            >
              <ShoppingBag size={18} /> Thêm vào giỏ
            </button>
          ) : (
            <div className="flex items-center justify-between bg-gray-900 rounded-xl p-1 border border-gray-700">
              <button
                onClick={() => removeItem(dish._id)}
                className="w-8 h-8 flex items-center justify-center bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold text-amber-500 text-lg w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => addItem(dish)}
                className="w-8 h-8 flex items-center justify-center bg-amber-600 text-white hover:bg-amber-500 rounded-lg transition-all shadow-lg shadow-amber-500/20"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishCard;