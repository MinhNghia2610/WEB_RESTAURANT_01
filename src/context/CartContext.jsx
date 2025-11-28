import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart phải được dùng bên trong CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Cờ này dùng để chặn việc lưu nhầm lúc đang chuyển đổi tài khoản
  const isLoaded = useRef(false);

  // 1. LOGIC TẢI DỮ LIỆU (Chạy khi Login/Logout)
  useEffect(() => {
    const loadCart = async () => {
      // BƯỚC 1: KHÓA CHỨC NĂNG LƯU & XÓA GIỎ CŨ NGAY LẬP TỨC
      isLoaded.current = false;
      setCartItems([]); // Reset về rỗng để tránh hiện nhầm của người trước

      if (isAuthenticated) {
        // A. NẾU LÀ USER: Tải từ Database
        try {
          const res = await axiosClient.get('/cart');
          // Map dữ liệu từ DB (dish -> _id)
          const dbCart = res.data.map(item => ({
            _id: item.dish || item._id,
            name: item.name,
            price: item.price,
            imageURL: item.imageURL,
            quantity: item.quantity
          }));
          setCartItems(dbCart);
        } catch (error) {
          console.error("Lỗi tải giỏ hàng:", error);
        }
      } else {
        // B. NẾU LÀ KHÁCH: Tải từ LocalStorage
        try {
          const stored = localStorage.getItem('cartItems_guest');
          if (stored) setCartItems(JSON.parse(stored));
        } catch (e) {
          console.error("Lỗi parse giỏ hàng guest", e);
        }
      }

      // BƯỚC 2: MỞ KHÓA (Cho phép lưu cho các lần thao tác sau)
      // Dùng setTimeout để đảm bảo state đã cập nhật xong
      setTimeout(() => {
        isLoaded.current = true;
      }, 500);
    };

    loadCart();
  }, [isAuthenticated]); 


  // 2. LOGIC LƯU DỮ LIỆU (Chỉ chạy khi cartItems thay đổi)
  useEffect(() => {
    // Nếu chưa load xong (đang login/logout) thì KHÔNG ĐƯỢC LƯU
    if (!isLoaded.current) return;

    if (isAuthenticated) {
      // A. LƯU LÊN DB (Debounce 1s)
      const timeoutId = setTimeout(async () => {
        try {
          const payload = cartItems.map(item => ({
            dish: item._id,
            name: item.name,
            price: item.price,
            imageURL: item.imageURL,
            quantity: item.quantity
          }));
          await axiosClient.put('/cart', { cartItems: payload });
        } catch (error) {
          console.error("Lỗi lưu giỏ hàng lên DB:", error);
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    } else {
      // B. LƯU VÀO LOCALSTORAGE (Cho khách)
      localStorage.setItem('cartItems_guest', JSON.stringify(cartItems));
    }
  }, [cartItems]); // <--- QUAN TRỌNG: Bỏ isAuthenticated ra khỏi đây


  // --- CÁC HÀM THAO TÁC (Giữ nguyên) ---
  const addItem = (dish) => {
    if(!isLoaded.current) return; // Chặn thao tác khi chưa load xong
    setCartItems(prev => {
      const exist = prev.find(i => i._id === dish._id);
      return exist ? prev.map(i => i._id === dish._id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { ...dish, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    if(!isLoaded.current) return;
    setCartItems(prev => {
        const item = prev.find(i => i._id === id);
        if (!item) return prev;
        if (item.quantity === 1) return prev.filter(i => i._id !== id);
        return prev.map(i => i._id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const removeFromCart = (id) => {
    if(!isLoaded.current) return;
    setCartItems(prev => prev.filter(i => i._id !== id));
  };
  
  const updateQuantity = (id, qty) => {
      if(!isLoaded.current) return;
      if (qty <= 0) removeFromCart(id);
      else setCartItems(prev => prev.map(i => i._id === id ? {...i, quantity: qty} : i));
  };

  const clearCart = () => setCartItems([]);
  const getItemQuantity = (id) => cartItems.find(i => i._id === id)?.quantity || 0;
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const itemCount = useMemo(() => cartItems.reduce((t, i) => t + i.quantity, 0), [cartItems]);
  const totalPrice = useMemo(() => cartItems.reduce((t, i) => t + (i.price * i.quantity), 0), [cartItems]);

  return (
    <CartContext.Provider value={{ 
        cartItems, itemCount, totalPrice, 
        isCartOpen, openCart, closeCart, 
        addItem, removeItem, removeFromCart, updateQuantity, clearCart, getItemQuantity 
    }}>
      {children}
    </CartContext.Provider>
  );
};