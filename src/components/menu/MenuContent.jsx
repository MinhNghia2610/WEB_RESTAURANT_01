// src/components/menu/MenuContent.jsx
import React from 'react';
import MenuCard from './MenuCard'; // <-- Import MenuCard
import { getCategoryIcon } from '../../utils/menuUtils'; // <-- Import từ file utils

/**
 * Hiển thị nội dung chính của trang thực đơn (các nhóm danh mục và món ăn).
 * @param {Array} menuData - Dữ liệu đầy đủ của thực đơn.
 * @param {React.MutableRefObject} categoryRefs - Ref object từ MenuPage để gán cho các section.
 */
const MenuContent = ({ menuData, categoryRefs }) => (
  <main className="flex-grow">
    {/* Menu điều hướng cho Mobile sẽ được đặt ở đây bởi component cha */}
    
    <div className="space-y-16 mt-6 lg:mt-0">
      {menuData.map((category) => {
        const IconComponent = getCategoryIcon(category.categoryName); 
        
        return (
          <div 
            key={category.categoryName} 
            // Gán ref và data-category cho Intersection Observer
            ref={el => categoryRefs.current[category.categoryName] = el}
            data-category={category.categoryName}
            className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700"
          >
            
            {/* Tiêu đề danh mục */}
            <div className="flex flex-col items-center justify-center mb-10 border-b-2 border-amber-600/50 pb-4">
              <IconComponent className="w-10 h-10 text-amber-500 mb-2" />
              <h2 className="text-3xl font-bold font-serif text-amber-500 uppercase tracking-wider text-center">
                {category.categoryName} 
              </h2>
              {category.description && (
                <p className="text-gray-400 mt-2 text-center max-w-lg italic">{category.description}</p>
              )}
            </div>

            {/* DANH SÁCH MÓN ĂN DẠNG CARD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {category.items && category.items.map((item, itemIndex) => (
                <MenuCard key={item._id || itemIndex} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </main>
);

export default MenuContent;