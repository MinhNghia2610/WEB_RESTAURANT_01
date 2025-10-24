// src/pages/User/OrderOnlinePage.jsx (ĐÃ VIẾT LẠI)
import React, { useState, useEffect, useMemo, useRef } from 'react';
import OrderMenu from '../../components/order/OrderMenu';
import OrderSidebar from '../../components/order/OrderSidebar';
import OrderSearchBar from '../../components/order/OrderSearchBar';

const OrderOnlinePage = () => {
  const [masterDishes, setMasterDishes] = useState([]); // Danh sách gốc từ API
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeCategory, setActiveCategory] = useState(null);
  const categoryRefs = useRef({});

  // 1. Fetch toàn bộ món ăn (chỉ 1 lần)
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API_URL}/dishes`); 
        if (!response.ok) throw new Error('Không thể tải danh sách món ăn.');
        
        const data = await response.json();
        if (data.success) {
          const availableDishes = data.data.filter(dish => dish.status === 'available');
          setMasterDishes(availableDishes);
          // Set danh mục đầu tiên là active
          if (availableDishes.length > 0) {
            const firstCategory = [...new Set(availableDishes.map(d => d.category))].sort()[0];
            setActiveCategory(firstCategory);
          }
        } else {
          throw new Error('Dữ liệu món ăn trả về không hợp lệ.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDishes();
  }, []);

  // 2. Lọc món ăn dựa trên thanh tìm kiếm
  const filteredDishes = useMemo(() => {
    if (!searchTerm) {
      return masterDishes; // Không tìm, trả về tất cả
    }
    return masterDishes.filter(dish =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [masterDishes, searchTerm]);

  // 3. Tạo danh sách danh mục từ các món ăn ĐÃ LỌC
  const categories = useMemo(() => {
    const categorySet = new Set(filteredDishes.map(dish => dish.category));
    return [...categorySet].sort();
  }, [filteredDishes]);

  // 4. Logic cuộn (Scroll-Spy)
  const scrollToCategory = (categoryName) => {
    const ref = categoryRefs.current[categoryName];
    if (ref) {
      const yOffset = -120; // Offset cho sticky header
      const y = ref.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveCategory(categoryName);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.dataset.category);
          }
        });
      },
      { rootMargin: '-120px 0px -70% 0px', threshold: 0 }
    );

    Object.values(categoryRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filteredDishes]); // Chạy lại khi danh sách lọc thay đổi

  // === RENDER GIAO DIỆN ===

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-400">Đang tải thực đơn...</p>;
    }
    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }
    return (
      <OrderMenu dishes={filteredDishes} categoryRefs={categoryRefs} />
    );
  };

  return (
    // ĐỔI SANG NỀN TỐI
    <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tiêu đề (Style nền tối) */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-white">
            Đặt Món Online
          </h1>
          <p className="text-gray-400 mt-2 text-lg max-w-xl mx-auto">
            Chọn các món ăn yêu thích của bạn và thêm vào giỏ hàng.
          </p>
        </header>

        {/* BỐ CỤC 2 CỘT MỚI */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* CỘT 1: SIDEBAR */}
          <OrderSidebar 
            categories={categories}
            activeCategory={activeCategory}
            onScrollToCategory={scrollToCategory}
          />

          {/* CỘT 2: NỘI DUNG CHÍNH (Tìm kiếm + Menu) */}
          <main className="flex-grow">
            {/* Thanh tìm kiếm */}
            <OrderSearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            {/* Danh sách món ăn */}
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