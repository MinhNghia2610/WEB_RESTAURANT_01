import React from 'react';
import MenuCard from './MenuCard';

const MenuContent = ({ dishes, categories, refs }) => {
  return (
    <div className="space-y-16">
      {categories.map((category) => {
        const categoryDishes = dishes.filter(d => d.category === category);
        
        return (
          <section 
            key={category} 
            id={category} 
            ref={(el) => (refs.current[category] = el)}
            className="scroll-mt-28"
          >
            <div className="flex items-end gap-4 mb-8 border-b border-gray-700 pb-2">
                <h2 className="text-3xl font-bold text-amber-500 font-serif uppercase tracking-wide">
                    {category}
                </h2>
                <span className="text-gray-500 pb-1 text-sm font-light italic">/ L'ESSENCE MENU</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categoryDishes.map((dish) => (
                <MenuCard key={dish._id} dish={dish} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default MenuContent;