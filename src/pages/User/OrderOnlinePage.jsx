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
  const categoryRefs = useRef({});

  // 1. Fetch dữ liệu
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
          const availableDishes = data.data; 
          setMasterDishes(availableDishes);

          if (availableDishes.length > 0) {
            const firstCategory = [...new Set(availableDishes.map(d => d.category))].sort()[0];
            setActiveCategory(firstCategory);
          }
        } else {
          throw new Error(data.message || 'Dữ liệu không hợp lệ.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); 
      }
    };
    fetchDishes();
  }, []);

  // 2. Lọc món ăn
  const filteredDishes = useMemo(() => {
    if (!searchTerm) return masterDishes; 
    const lowerSearchTerm = searchTerm.toLowerCase();
    return masterDishes.filter(dish =>
      dish.name.toLowerCase().includes(lowerSearchTerm) ||
      (dish.description && dish.description.toLowerCase().includes(lowerSearchTerm))
    );
  }, [masterDishes, searchTerm]);

  // 3. Danh sách danh mục
  const categories = useMemo(() => {
    const categorySet = new Set(filteredDishes.map(dish => dish.category));
    return [...categorySet].sort();
  }, [filteredDishes]);

  // 4. Scroll
  const scrollToCategory = (categoryName) => {
    const ref = categoryRefs.current[categoryName];
    if (ref) {
      const yOffset = -100; 
      const y = ref.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // 5. Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.dataset.category);
          }
        });
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 } 
    );

    const currentRefs = categoryRefs.current;
    Object.values(currentRefs).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(currentRefs).forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
      observer.disconnect();
    };
  }, [categories]); 

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
        <div className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-800 flex items-center gap-3 justify-center">
          <AlertCircle />
          <p><span className="font-bold">Lỗi:</span> {error}</p>
        </div>
      );
    }
    return <OrderMenu dishes={filteredDishes} categoryRefs={categoryRefs} />;
  };

  return (
    <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white relative">
      {/* Họa tiết nền */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #fbbf24 1px, transparent 0)", backgroundSize: "40px 40px" }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-white mb-3">
            Thực Đơn <span className="text-amber-500">Trực Tuyến</span>
          </h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Khám phá hương vị tinh hoa và đặt món ngay tại nhà.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Danh mục (Sticky) */}
          <aside className="lg:w-1/4">
             <OrderSidebar 
                categories={categories} 
                activeCategory={activeCategory}
                onScrollToCategory={scrollToCategory}
             />
          </aside>

          {/* Nội dung chính */}
          <main className="lg:w-3/4">
            <OrderSearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            <div className="mt-6 min-h-[400px]">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrderOnlinePage;