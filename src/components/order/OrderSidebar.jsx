// src/components/order/OrderSidebar.jsx
import React from 'react';

// (Giả sử bạn đã tạo file /src/utils/menuUtils.js như chúng ta đã làm)
// import { getCategoryIcon } from '../../utils/menuUtils'; 

const OrderSidebar = ({ categories, activeCategory, onScrollToCategory }) => (
  <aside className="hidden lg:block w-64 flex-shrink-0">
    {/* Làm cho nó "dính" (sticky) */}
    <div className="sticky top-28 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-2xl font-bold font-serif text-white mb-4 border-b border-gray-600 pb-2">
        Danh Mục
      </h3>
      <ul className="space-y-2">
        {categories.map((categoryName) => (
          // const IconComponent = getCategoryIcon(categoryName); // (Nếu bạn muốn thêm icon)
          <li key={categoryName}>
            <button
              onClick={() => onScrollToCategory(categoryName)}
              className={`
                w-full text-left py-2 px-3 rounded-lg transition duration-200 flex items-center
                font-medium text-lg
                ${activeCategory === categoryName
                  ? 'bg-amber-600 text-white font-bold shadow-md' // ACTIVE
                  : 'text-gray-300 hover:bg-gray-700 hover:text-amber-500' // INACTIVE
                }
              `}
            >
              {/* <IconComponent className="w-5 h-5 mr-3" /> */}
              <span>{categoryName}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

export default OrderSidebar;