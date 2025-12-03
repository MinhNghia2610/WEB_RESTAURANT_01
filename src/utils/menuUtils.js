// src/utils/menuUtils.js
import React from 'react';
import { Wine, Coffee, ChefHat, Salad } from 'lucide-react';

/**
 * Ánh xạ tên danh mục thành một component Icon từ lucide-react.
 * @param {string} categoryTitle - Tên danh mục (ví dụ: 'KHAI VỊ', 'MÓN CHÍNH').
 * @returns {React.ElementType} - Component icon (ví dụ: Salad, ChefHat).
 */
export const getCategoryIcon = (categoryTitle) => {
  const title = categoryTitle ? categoryTitle.toUpperCase() : '';
  
  if (title.includes('KHAI VỊ') || title.includes('ENTRÉES')) return Salad;
  if (title.includes('CHÍNH') || title.includes('PLATS PRINCIPAUX')) return ChefHat;
  if (title.includes('TRÁNG MIỆNG') || title.includes('DESSERTS') || title.includes('NGỌT')) return Coffee;
  if (title.includes('RƯỢU VANG') || title.includes('WINE') || title.includes('THỨC UỐNG')) return Wine;
  
  // Mặc định là ChefHat nếu không khớp
  return ChefHat;
};