// src/components/menu/MenuSidebar.jsx
import React from 'react';
import { getCategoryIcon } from '../../utils/menuUtils'; // <-- Import từ file utils

/**
 * Sidebar danh mục cho màn hình desktop.
 * @param {Array} categories - Danh sách các danh mục (menuData).
 * @param {string} activeCategory - Tên danh mục đang active.
 * @param {Function} onScrollToCategory - Hàm callback khi nhấp vào danh mục.
 */
const MenuSidebar = ({ categories, activeCategory, onScrollToCategory }) => (
  <aside className="hidden lg:block w-64 flex-shrink-0">
    <div className="sticky top-28 bg-gray-800 p-6 rounded-xl shadow-lg border border-amber-500/30">
      <h3 className="text-2xl font-bold font-serif text-white mb-4 border-b border-gray-600 pb-2">
        Danh Mục
      </h3>
      <ul className="space-y-2">
        {categories.map((category) => {
          const IconComponent = getCategoryIcon(category.categoryName);
          return (
            <li key={category.categoryName}>
              <button
                onClick={() => onScrollToCategory(category.categoryName)}
                className={`
                  w-full text-left py-2 px-3 rounded-lg transition duration-200 flex items-center
                  ${activeCategory === category.categoryName
                    ? 'bg-amber-600 text-white font-bold shadow-md' // ACTIVE
                    : 'text-gray-300 hover:bg-gray-700 hover:text-amber-500' // INACTIVE
                  }
                `}
              >
                <IconComponent className="w-5 h-5 mr-3" />
                <span className='font-medium text-lg'>{category.categoryName}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  </aside>
);

export default MenuSidebar;