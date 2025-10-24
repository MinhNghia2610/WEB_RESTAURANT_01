// src/pages/MenuPage.jsx
import React, { useState, useEffect, useRef } from 'react'; 
import MenuSidebar from "../../components/menu/MenuSidebar";
import MenuMobileNav from "../../components/menu/MenuMobileNav";
import MenuContent from "../../components/menu/MenuContent";

// Hàm API call (có thể tách ra file apiService.js nếu muốn)
const fetchMenuData = async () => {
  // Sửa lỗi API: dùng VITE_API_URL và đúng endpoint là /full-menu
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const response = await fetch(`${API_URL}/dishes/full-menu`);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch menu data (Status: ${response.status}, Error: ${errorText.substring(0, 50)}...)`);
  }
  
  const result = await response.json();
  
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  } else {
    throw new Error("Dữ liệu trả về không đúng định dạng hoặc thiếu trường 'success: true'.");
  }
};


// Component trang chính
const MenuPage = () => {
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const categoryRefs = useRef({}); 
  const [activeCategory, setActiveCategory] = useState(null); 

  // Hàm cuộn mượt mà (Giữ nguyên)
  const scrollToCategory = (categoryName) => {
    const ref = categoryRefs.current[categoryName];
    if (ref) {
      const yOffset = -120; // Offset cho sticky header
      const y = ref.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveCategory(categoryName);
    }
  };
  
  // EFFECT: Intersection Observer (Giữ nguyên)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.dataset.category);
          }
        });
      },
      {
        rootMargin: '-120px 0px -70% 0px', 
        threshold: 0
      }
    );

    Object.values(categoryRefs.current).forEach(ref => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [menuData]); // Chạy lại khi menuData thay đổi (để gán ref mới)

  // EFFECT: Fetch Data từ API (Giữ nguyên, chỉ gọi hàm fetchMenuData)
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await fetchMenuData();
        setMenuData(data);
        if (data.length > 0) {
          setActiveCategory(data[0].categoryName);
        }
      } catch (err) {
        console.error("Lỗi khi fetch menu:", err);
        setError('Không thể tải thực đơn. Vui lòng kiểm tra Server và MongoDB.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMenu();
  }, []);
  
  // --- Các trạng thái Loading và Error (Giữ nguyên) ---
  if (isLoading) {
    return <div className="pt-32 pb-20 bg-gray-900 min-h-screen text-white text-center text-2xl">Đang tải thực đơn...</div>;
  }

  if (error || menuData.length === 0) {
    return (
      <div className="pt-32 pb-20 bg-gray-900 min-h-screen text-white text-center">
        <div className="max-w-xl mx-auto p-10 bg-gray-800 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Lỗi tải thực đơn</h2>
          <p className="text-xl text-gray-400">
            {error || "Không tìm thấy món ăn nào. Vui lòng đảm bảo Backend Server đang chạy và MongoDB đã kết nối thành công."}
          </p>
        </div>
      </div>
    );
  }

  // --- Render Layout chính ---
  return (
    <div className="pt-32 pb-20 bg-gray-900 min-h-screen text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tiêu đề trang Menu (Giữ nguyên) */}
        <header className="text-center mb-16">
          <p className="text-amber-500 font-serif uppercase tracking-widest mb-2">
            TOÀN BỘ THỰC ĐƠN
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight font-serif text-white">
            Bộ Sưu Tập L'ESSENCE
          </h1>
          <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
            Khám phá hành trình ẩm thực Dưỡng Sinh, nơi kỹ thuật Fine Dining Pháp gặp gỡ triết lý cân bằng Á Đông.
          </p>
        </header>

        {/* BỐ CỤC 2 CỘT */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* CỘT 1: SIDEBAR (Dùng component mới) */}
          <MenuSidebar 
            categories={menuData}
            activeCategory={activeCategory}
            onScrollToCategory={scrollToCategory}
          />

          {/* CỘT 2: NỘI DUNG CHÍNH (Bao gồm MenuContent và MobileNav) */}
          <div className="flex-grow">
            {/* Nav cho Mobile (Dùng component mới) */}
            <MenuMobileNav 
              categories={menuData}
              activeCategory={activeCategory}
              onScrollToCategory={scrollToCategory}
            />
            
            {/* Content (Dùng component mới) */}
            <MenuContent 
              menuData={menuData}
              categoryRefs={categoryRefs}
            />
          </div>

        </div>

        {/* Ghi chú chân trang (Giữ nguyên) */}
        <footer className="text-center mt-20 text-gray-500 italic text-sm">
          <p>* Giá trên chưa bao gồm 10% VAT và 5% phí phục vụ. Vui lòng hỏi Sommelier để được tư vấn rượu vang.</p>
        </footer>
      </div>
    </div>
  );
};

export default MenuPage;