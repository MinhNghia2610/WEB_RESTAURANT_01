import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import MenuSidebar from '../../components/menu/MenuSidebar';
import MenuContent from '../../components/menu/MenuContent';

const MenuPage = () => {
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeCategory, setActiveCategory] = useState(null);
  const categoryRefs = useRef({});

  // 1. Fetch dữ liệu món ăn
  useEffect(() => {
    const fetchDishes = async () => {
      setIsLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API_URL}/dishes`);
        const data = await response.json();
        
        if (data.success) {
          setDishes(data.data);
          if (data.data.length > 0) {
            const firstCategory = [...new Set(data.data.map(d => d.category))].sort()[0];
            setActiveCategory(firstCategory);
          }
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDishes();
  }, []);

  // 2. Lấy danh sách Category
  const categories = useMemo(() => {
    return [...new Set(dishes.map(d => d.category))].sort();
  }, [dishes]);

  // 3. Xử lý cuộn trang
  const scrollToCategory = (category) => {
    const element = categoryRefs.current[category];
    if (element) {
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // 4. Active category khi cuộn
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 }
    );

    Object.values(categoryRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [categories]);

  return (
    <div className="pt-20 pb-20 bg-gray-900 min-h-screen text-white relative font-sans">
      
      {/* Họa tiết nền chìm */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(#fbbf24 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HERO HEADER */}
        <div className="text-center py-16">
            <h1 className="text-5xl md:text-6xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 mb-6">
                Thực Đơn Thượng Hạng
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                Trải nghiệm bản giao hưởng của hương vị, nơi nghệ thuật ẩm thực thăng hoa cùng những nguyên liệu tuyển chọn khắt khe nhất.
            </p>
            <div className="w-24 h-1 bg-amber-500 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* MAIN CONTENT */}
        {isLoading ? (
          <div className="flex justify-center h-64 items-center"><Loader className="w-12 h-12 text-amber-500 animate-spin"/></div>
        ) : error ? (
          <div className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg border border-red-800"><AlertCircle className="inline mr-2"/> {error}</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Danh mục */}
            <aside className="lg:w-1/4">
                <div className="sticky top-28">
                    <MenuSidebar 
                        categories={categories} 
                        activeCategory={activeCategory} 
                        onSelect={scrollToCategory} 
                    />
                </div>
            </aside>

            {/* Danh sách món */}
            <main className="lg:w-3/4">
                <MenuContent 
                    dishes={dishes} 
                    categories={categories} 
                    refs={categoryRefs} 
                />
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;