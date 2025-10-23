import React, { createContext, useContext, useState, useMemo } from 'react';

// Định dạng tiền tệ VNĐ
export const formatCurrency = (amount) => amount.toLocaleString('vi-VN') + ' VNĐ';

// 1. Tạo Context
const CartContext = createContext();

// 2. Custom Hook để sử dụng Cart
export const useCart = () => {
    return useContext(CartContext);
};

// 3. Cart Provider Component
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (itemToAdd) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === itemToAdd._id);

            if (existingItem) {
                return prevCart.map(item =>
                    item._id === itemToAdd._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...itemToAdd, quantity: 1, price: itemToAdd.price }];
            }
        });
    };

    const updateQuantity = (itemId, change) => {
        setCart(prevCart => {
            return prevCart.map(item =>
                item._id === itemId
                    ? { ...item, quantity: item.quantity + change }
                    : item
            ).filter(item => item.quantity > 0);
        });
    };
    
    const resetCart = () => {
        setCart([]);
    };

    // Tính tổng số lượng món ăn
    const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
    
    // Tính tổng tiền tạm tính
    const totalAmount = useMemo(() => 
        cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    , [cart]);

    const value = {
        cart,
        addToCart,
        updateQuantity,
        resetCart,
        totalItems,
        totalAmount,
        formatCurrency,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};