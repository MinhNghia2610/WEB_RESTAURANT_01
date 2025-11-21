// src/components/menu/MenuMobileNav.jsx
import React from 'react';
import { getCategoryIcon } from '../../utils/menuUtils'; // Import từ file utils

/**
 * Thanh điều hướng danh mục cho màn hình mobile (cuộn ngang).
 * @param {Array} categories - Danh sách các danh mục (menuData).
 * @param {string} activeCategory - Tên danh mục đang active.
 * @param {Function} onScrollToCategory - Hàm callback khi nhấp vào danh mục.
 */
const MenuMobileNav = ({ categories, activeCategory, onScrollToCategory }) => (
  <div className="lg:hidden sticky top-[95px] z-10 p-2 bg-gray-900 border-b border-gray-700 -mx-4 sm:-mx-6 lg:mx-0">
    <div className="flex overflow-x-auto whitespace-nowrap space-x-3 pb-2 scrollbar-hide">
      {categories.map((category) => {
        const IconComponent = getCategoryIcon(category.categoryName);
        return (
          <button
            key={category.categoryName}
            onClick={() => onScrollToCategory(category.categoryName)}
            className={`
              flex items-center text-sm font-medium py-2 px-4 rounded-full transition duration-200
              ${activeCategory === category.categoryName
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-amber-500'
              }
            `}
          >
            <IconComponent className="w-4 h-4 mr-2" />
            {category.categoryName}
          </button>
        );
      })}
    </div>
  </div>
);

export default MenuMobileNav;