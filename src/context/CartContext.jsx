// src/context/CartContext.jsx (ĐÃ SỬA LỖI VÀ THÊM HÀM)
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// --- 1. Khởi tạo Context ---
const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart phải được dùng bên trong CartProvider');
  }
  return context;
};

// --- 2. Lấy giỏ hàng từ LocalStorage ---
const getInitialCart = () => {
        try {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
    console.error("Không thể phân tích giỏ hàng từ localStorage:", error);
    return [];
  }
};

// --- 3. Tạo Provider Component ---
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getInitialCart);
  
  // State quản lý hiển thị Popup (Giữ nguyên)
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Tự động lưu vào LocalStorage (Giữ nguyên)
    useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // ==========================================================
  // ⭐️ CÁC HÀM MỚI (CHO DISHCARD)
  // ==========================================================

  // 1. HÀM THÊM 1 (Đổi tên từ 'addToCart' thành 'addItem')
  // Dùng cho nút "+"
  const addItem = (dish) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === dish._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === dish._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...dish, quantity: 1 }];
      }
    });
  };

  // 2. HÀM BỚT 1 (HÀM MỚI)
  // Dùng cho nút "-"
  const removeItem = (dishId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === dishId);
      
      if (!existingItem) return prevItems; // Không tìm thấy

      // Nếu số lượng là 1, xóa hẳn
      if (existingItem.quantity === 1) {
        return prevItems.filter((item) => item._id !== dishId);
      }
      
      // Nếu > 1, giảm 1
      return prevItems.map((item) =>
        item._id === dishId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
    };

  // 3. HÀM LẤY SỐ LƯỢNG (HÀM MỚI - SỬA LỖI CRASH)
  // Dùng để DishCard biết hiển thị số 0 hay số 5
  const getItemQuantity = (dishId) => {
    const itemInCart = cartItems.find((item) => item._id === dishId);
    return itemInCart ? itemInCart.quantity : 0;
  };

  // ==========================================================
  // CÁC HÀM CŨ (GIỮ LẠI CHO CARTMODAL)
  // ==========================================================

  // Hàm Xóa hẳn khỏi giỏ (dùng cho nút X trong CartModal)
  const removeFromCart = (dishId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== dishId)
    );
  };

  // Hàm Cập nhật số lượng (dùng cho ô input trong CartModal)
  const updateQuantity = (dishId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(dishId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === dishId ? { ...item, quantity: newQuantity } : item
        )
      );
        }
    };

  // Hàm Xóa sạch giỏ (Giữ nguyên)
  const clearCart = () => {
    setCartItems([]);
  };

  // Tính toán giá trị tổng (Giữ nguyên)
  const itemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
  }, [cartItems]);

  // Cung cấp (Provide) giá trị
    const value = {
    cartItems,
    itemCount,
    totalPrice,
    isCartOpen,
    openCart,
    closeCart,
    clearCart,

    // ⭐️ CÁC HÀM MỚI CHO DISHCARD ⭐️
    addItem,        // Thêm 1
    removeItem,     // Bớt 1
    getItemQuantity,// Lấy số lượng

    // ⭐️ CÁC HÀM CŨ CHO CARTMODAL ⭐️
    removeFromCart, // Xóa hẳn
    updateQuantity, // Đặt số lượng
    };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};