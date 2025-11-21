import React from 'react';
import DishCard from '../common/DishCard';

const OrderMenu = ({ dishes, categoryRefs }) => {
  // Nhóm món ăn theo danh mục
  const dishesByCategory = dishes.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {});

  const categories = Object.keys(dishesByCategory).sort();

  if (categories.length === 0) {
    return (
        <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Không tìm thấy món ăn nào phù hợp.</p>
        </div>
    );
  }

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <div 
            key={category} 
            ref={(el) => (categoryRefs.current[category] = el)}
            data-category={category} // Quan trọng cho Observer
            className="scroll-mt-28"
        >
          <h2 className="text-2xl font-bold text-amber-500 mb-6 pb-2 border-b border-gray-700 font-serif">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {dishesByCategory[category].map((dish) => (
              <DishCard key={dish._id} dish={dish} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderMenu;