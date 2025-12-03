import React from 'react';
import { BookOpen } from 'lucide-react';

const MenuSidebar = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
      <div className="p-5 bg-gray-900/80 border-b border-gray-700">
        <h3 className="text-xl font-bold text-amber-500 font-serif flex items-center gap-3">
            <BookOpen size={22} /> Danh Mục
        </h3>
      </div>
      <ul className="py-2">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => onSelect(cat)}
              className={`w-full text-left px-6 py-4 transition-all duration-300 text-sm font-medium border-l-4 relative group
                ${activeCategory === cat
                  ? 'border-amber-500 bg-gradient-to-r from-amber-900/20 to-transparent text-amber-400'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700/30 hover:border-gray-600'
                }`}
            >
              <span className={`absolute left-0 top-0 h-full w-1 bg-amber-500 transition-all duration-300 ${activeCategory === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}></span>
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuSidebar;