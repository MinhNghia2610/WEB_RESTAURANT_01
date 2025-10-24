// src/pages/User/OrderOnlinePage.jsx (PHIÊN BẢN ĐÃ TÁI CẤU TRÚC)
import React, { useState, useEffect, useMemo, useRef } from 'react';
import OrderMenu from '../../components/order/OrderMenu';
import OrderSidebar from '../../components/order/OrderSidebar';
import OrderSearchBar from '../../components/order/OrderSearchBar';
import { Loader, AlertCircle } from 'lucide-react'; // Import icons

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
      setIsLoading(true); // Bắt đầu loading
      setError(null); // Reset lỗi
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
          throw new Error(data.message || 'Dữ liệu món ăn trả về không hợp lệ.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); // Kết thúc loading
      }
    };
    fetchDishes();
  }, []);

  // 2. Lọc món ăn dựa trên thanh tìm kiếm
  const filteredDishes = useMemo(() => {
    if (!searchTerm) {
      return masterDishes; // Không tìm, trả về tất cả
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return masterDishes.filter(dish =>
      dish.name.toLowerCase().includes(lowerSearchTerm) ||
      (dish.description && dish.description.toLowerCase().includes(lowerSearchTerm))
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
      // Không cần setActiveCategory ở đây vì IntersectionObserver sẽ làm
    }
  };

  useEffect(() => {
    // Chỉ chạy observer khi đã có món ăn
    if (filteredDishes.length === 0) return;

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

    // Xóa ref cũ trước khi observe ref mới
    const currentRefs = categoryRefs.current;
    Object.values(currentRefs).forEach(ref => {
      if (ref) observer.unobserve(ref);
    });
    // Gán lại ref và observe
    categoryRefs.current = {}; // Reset refs
    filteredDishes.forEach(dish => {
        // Chỉ cần quan sát tiêu đề category một lần
        const ref = categoryRefs.current[dish.category];
        if (ref) {
            observer.observe(ref);
        }
    });


    // Dọn dẹp khi component unmount hoặc filteredDishes thay đổi
    return () => {
        Object.values(currentRefs).forEach(ref => {
            if (ref) observer.unobserve(ref);
        });
        observer.disconnect();
    };
}, [filteredDishes]);


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
    // Truyền ref vào OrderMenu để nó gán cho các div danh mục
    return (
      <OrderMenu dishes={filteredDishes} categoryRefs={categoryRefs} />
    );
  };

  return (
    // NỀN TỐI
    <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tiêu đề */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-white">
            Đặt Món Online
          </h1>
          <p className="text-gray-400 mt-2 text-lg max-w-xl mx-auto">
            Chọn các món ăn yêu thích của bạn và thêm vào giỏ hàng.
          </p>
        </header>

        {/* BỐ CỤC 2 CỘT */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* CỘT 1: SIDEBAR */}
          <OrderSidebar 
            // Truyền danh sách category đã lọc
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