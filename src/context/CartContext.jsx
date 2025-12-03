import React, { 
  createContext, useContext, useState, 
  useEffect, useMemo, useRef 
} from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải dùng trong CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isLoaded = useRef(false); // Cờ chặn save khi login/logout

  // =======================================================
  // 1. TẢI GIỎ HÀNG TỪ DB HOẶC LOCAL STORAGE
  // =======================================================
  useEffect(() => {
    const loadCart = async () => {
      isLoaded.current = false;
      setCartItems([]); // Reset để tránh hiện nhầm giỏ của người cũ

      if (isAuthenticated) {
        // ---- USER LOGGED IN → Lấy từ DB ----
        try {
          const res = await axiosClient.get("/cart");
          const dbCart = res.data.map((item) => ({
            _id: item.dish || item._id,
            name: item.name,
            price: item.price,
            imageURL: item.imageURL,
            quantity: item.quantity,
          }));
          setCartItems(dbCart);
        } catch (error) {
          console.error("Lỗi tải giỏ hàng từ DB:", error);
        }
      } else {
        // ---- GUEST → Lấy từ LOCALSTORAGE ----
        try {
          const stored = localStorage.getItem("cartItems_guest");
          if (stored) setCartItems(JSON.parse(stored));
        } catch (error) {
          console.error("Lỗi parse giỏ hàng guest", error);
        }
      }

      // KẾT THÚC TẢI → Cho phép lưu
      setTimeout(() => {
        isLoaded.current = true;
      }, 300);
    };

    loadCart();
  }, [isAuthenticated]);

  // =======================================================
  // 2. LƯU GIỎ HÀNG LÊN DB HOẶC LOCAL_STORAGE
  // =======================================================
  useEffect(() => {
    if (!isLoaded.current) return; // chưa load xong → không lưu

    if (isAuthenticated) {
      // === USER → Lưu lên DATABASE ===
      const timeout = setTimeout(async () => {
        try {
          const payload = cartItems.map((item) => ({
            dish: item._id,
            name: item.name,
            price: item.price,
            imageURL: item.imageURL,
            quantity: item.quantity,
          }));

          await axiosClient.put("/cart", { cartItems: payload });
        } catch (error) {
          console.error("Lỗi lưu giỏ hàng lên DB:", error);
        }
      }, 800);

      return () => clearTimeout(timeout);
    }

    // === KHÁCH → Lưu vào LOCAL STORAGE ===
    localStorage.setItem("cartItems_guest", JSON.stringify(cartItems));
  }, [cartItems]);

  // =======================================================
  // 3. CÁC HÀM THAO TÁC GIỎ HÀNG
  // =======================================================
  const addItem = (dish) => {
    if (!isLoaded.current) return;

    setCartItems((prev) => {
      const exist = prev.find((i) => i._id === dish._id);
      if (exist) {
        return prev.map((i) =>
          i._id === dish._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    if (!isLoaded.current) return;

    setCartItems((prev) => {
      const item = prev.find((i) => i._id === id);
      if (!item) return prev;

      if (item.quantity === 1)
        return prev.filter((i) => i._id !== id);

      return prev.map((i) =>
        i._id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const removeFromCart = (id) => {
    if (!isLoaded.current) return;
    setCartItems((prev) => prev.filter((i) => i._id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (!isLoaded.current) return;

    if (qty <= 0) return removeFromCart(id);

    setCartItems((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, quantity: qty } : i
      )
    );
  };

  const getItemQuantity = (id) =>
    cartItems.find((i) => i._id === id)?.quantity || 0;

  const clearCart = () => setCartItems([]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // =======================================================
  // 4. TÍNH TOÁN TỔNG TIỀN + SỐ LƯỢNG
  // =======================================================
  const itemCount = useMemo(
    () => cartItems.reduce((t, i) => t + i.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((t, i) => t + i.price * i.quantity, 0),
    [cartItems]
  );

  // =======================================================
  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        totalPrice,
        isCartOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
