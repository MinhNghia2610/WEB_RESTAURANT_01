// src/components/order/OrderSearchBar.jsx
import React from 'react';
import { Search } from 'lucide-react';

const OrderSearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Tìm kiếm món ăn..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full py-3 pl-12 pr-4 text-lg bg-gray-800 text-white
                   border border-gray-700 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      <div className="absolute top-0 left-0 flex items-center h-full pl-4">
        <Search className="text-gray-500" />
      </div>
    </div>
  );
};

export default OrderSearchBar;