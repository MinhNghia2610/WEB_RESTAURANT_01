// src/pages/User/OrderOnlinePage.jsx (ĐÃ SỬA LỖI SCROLL-SPY)
import React, { useState, useEffect, useMemo, useRef } from 'react';
import OrderMenu from '../../components/order/OrderMenu';
import OrderSidebar from '../../components/order/OrderSidebar';
import OrderSearchBar from '../../components/order/OrderSearchBar';
import { Loader, AlertCircle } from 'lucide-react'; 

const OrderOnlinePage = () => {
  const [masterDishes, setMasterDishes] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeCategory, setActiveCategory] = useState(null);
  // Khởi tạo categoryRefs.current LÀ MỘT OBJECT RỖNG
  const categoryRefs = useRef({});

  // 1. Fetch toàn bộ món ăn (Giữ nguyên)
  useEffect(() => {
    const fetchDishes = async () => {
      setIsLoading(true); 
      setError(null); 
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API_URL}/dishes`); 
        if (!response.ok) throw new Error('Không thể tải danh sách món ăn.');
        
        const data = await response.json();
        if (data.success) {
          // Lọc các món 'available' (nếu bạn có logic này)
          // const availableDishes = data.data.filter(dish => dish.status === 'available');
          const availableDishes = data.data; // Giả sử lấy tất cả
          setMasterDishes(availableDishes);

          if (availableDishes.length > 0) {
            const firstCategory = [...new Set(availableDishes.map(d => d.category))].sort()[0];
            setActiveCategory(firstCategory);
          }
        } else {
          throw new Error(data.message || 'Dữ liệu món ăn trả về không hợp lệ.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); 
      }
    };
    fetchDishes();
  }, []);

  // 2. Lọc món ăn (Giữ nguyên)
  const filteredDishes = useMemo(() => {
    if (!searchTerm) {
      return masterDishes; 
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return masterDishes.filter(dish =>
      dish.name.toLowerCase().includes(lowerSearchTerm) ||
      (dish.description && dish.description.toLowerCase().includes(lowerSearchTerm))
    );
  }, [masterDishes, searchTerm]);

  // 3. Tạo danh sách danh mục (Giữ nguyên)
  const categories = useMemo(() => {
    const categorySet = new Set(filteredDishes.map(dish => dish.category));
    return [...categorySet].sort();
  }, [filteredDishes]);

  // 4. Logic cuộn (Giữ nguyên)
  const scrollToCategory = (categoryName) => {
    // Bây giờ categoryRefs.current sẽ có các ref
    const ref = categoryRefs.current[categoryName];
    if (ref) {
      const yOffset = -120; 
      const y = ref.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      // setActiveCategory(categoryName); // Không cần thiết, Observer sẽ làm
    }
  };

  // ==========================================================
  // ⭐️ 5. SỬA LỖI LOGIC SCROLL-SPY (useEffect) ⭐️
  // ==========================================================
  useEffect(() => {
    // `categoryRefs.current` được `OrderMenu` gán trong khi render
    // `useEffect` chạy SAU KHI render
    // Vì vậy, `categoryRefs.current` đã được cập nhật ở đây
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.dataset.category);
          }
        });
      },
      // rootMargin: Giao cắt khi ở 120px trên cùng (sau header)
      // và 70% dưới cùng (chỉ lấy phần top 30% màn hình)
      { rootMargin: '-120px 0px -70% 0px', threshold: 0 } 
    );

    // Lấy các refs HIỆN TẠI
    const currentRefs = categoryRefs.current;
    
    // Bắt đầu theo dõi tất cả
    Object.values(currentRefs).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    // Hàm dọn dẹp: Ngừng theo dõi tất cả
    return () => {
      Object.values(currentRefs).forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
      observer.disconnect();
    };
    
  // Phụ thuộc vào `categories`. Khi danh sách category thay đổi
  // (do tìm kiếm), chúng ta cần chạy lại để theo dõi các ref mới.
  }, [categories]); 


  // === RENDER GIAO DIỆN ===

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-12 h-12 text-amber-500 animate-spin" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-red-400 bg-red-900/50 p-4 rounded-lg border border-red-700 flex items-center gap-3">
          <AlertCircle />
          <p><span className="font-bold">Lỗi:</span> {error}</p>
        </div>
      );
    }
    return (
      <OrderMenu dishes={filteredDishes} categoryRefs={categoryRefs} />
    );
  };

  return (
    <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-white">
            Đặt Món Online
          </h1>
          <p className="text-gray-400 mt-2 text-lg max-w-xl mx-auto">
            Chọn các món ăn yêu thích của bạn và thêm vào giỏ hàng.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          
          <OrderSidebar 
            categories={categories} 
            activeCategory={activeCategory}
            onScrollToCategory={scrollToCategory}
          />

          <main className="flex-grow">
            <OrderSearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-700">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrderOnlinePage;