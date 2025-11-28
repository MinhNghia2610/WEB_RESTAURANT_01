import React from 'react';
import { Utensils } from 'lucide-react';

const OrderSidebar = ({ categories, activeCategory, onScrollToCategory }) => {
  return (
    <div className="sticky top-28 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
      <div className="bg-gray-900/50 p-4 border-b border-gray-700">
        <h3 className="text-lg font-bold text-amber-500 flex items-center gap-2 font-serif">
          <Utensils size={20} /> Danh Mục
        </h3>
      </div>
      <ul className="py-2">
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onScrollToCategory(category)}
              className={`w-full text-left px-5 py-3 transition-all duration-200 text-sm font-medium border-l-4
                ${activeCategory === category
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderSidebar;