// src/pages/User/MenuPage.jsx

import React, { useState, useEffect, useRef } from 'react'; 
// Import các icon từ lucide-react
import { Wine, Coffee, ChefHat, Salad } from 'lucide-react'; 

// Hàm ánh xạ tên danh mục thành icon
const getCategoryIcon = (categoryTitle) => {
    const title = categoryTitle ? categoryTitle.toUpperCase() : '';
    if (title.includes('KHAI VỊ') || title.includes('ENTRÉES')) return Salad;
    if (title.includes('CHÍNH') || title.includes('PLATS PRINCIPAUX')) return ChefHat;
    if (title.includes('TRÁNG MIỆNG') || title.includes('DESSERTS')) return Coffee;
    if (title.includes('RƯỢU VANG') || title.includes('WINE')) return Wine;
    return ChefHat;
};


// 👇 COMPONENT MỚI: MenuCard - Hiển thị món ăn dạng thẻ (card)
const MenuCard = ({ item }) => (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col hover:shadow-amber-500/30 transition duration-300">
        
        {/* Lấy hình ảnh từ item.imageURL */}
        {item.imageURL && (
            <img 
                src={item.imageURL || 'https://via.placeholder.com/300/1f2937/d1d5db?text=Food'} 
                alt={item.name} 
                className="w-full h-40 object-cover rounded-lg mb-3"
            />
        )}
        
        <h3 className="text-xl font-bold font-serif text-amber-500 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-400 flex-grow mb-3">{item.description}</p>
        
        <div className="mt-auto pt-3 border-t border-gray-700">
            <p className="text-2xl font-extrabold text-white text-right">
                {/* Hiển thị giá và đơn vị */}
                {item.price 
                    ? `${item.price.toLocaleString('vi-VN')} ${item.unit || 'VNĐ'}` 
                    : item.unit || "Liên hệ"}
            </p>
        </div>
    </div>
);
// 👆 KẾT THÚC COMPONENT MenuCard 👆


const MenuPage = () => {
    const [menuData, setMenuData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // KHAI BÁO useRef để lưu trữ các tham chiếu đến các danh mục
    const categoryRefs = useRef({}); 
    // KHAI BÁO state để theo dõi danh mục hiện tại (dùng cho việc highlight)
    const [activeCategory, setActiveCategory] = useState(null); 

    // Hàm cuộn đến danh mục (Không đổi)
    const scrollToCategory = (categoryName) => {
        const ref = categoryRefs.current[categoryName];
        if (ref) {
            const yOffset = -120;
            const y = ref.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveCategory(categoryName);
        }
    };
    
    // Hàm theo dõi Intersection Observer (Không đổi)
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
    }, [menuData]); 

    // Fetch Data (Không đổi)
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // Đảm bảo server backend đang chạy ở cổng 5000
                const response = await fetch('http://localhost:5000/api/menu'); 
                
                if (!response.ok) {
                    throw new Error('Failed to fetch menu data');
                }
                
                const result = await response.json();
                setMenuData(result.data || []);
                
            } catch (err) {
                console.error("Lỗi khi fetch menu:", err);
                setError('Không thể tải thực đơn. Vui lòng kiểm tra Server và MongoDB.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenu();
    }, []);
    

    if (isLoading) {
        return <div className="pt-32 pb-20 bg-gray-900 min-h-screen text-white text-center text-2xl">Đang tải thực đơn...</div>;
    }

    if (error) {
        return <div className="pt-32 pb-20 bg-gray-900 min-h-screen text-red-500 text-center text-2xl">{error}</div>;
    }


    return (
        <div className="pt-32 pb-20 bg-gray-900 min-h-screen text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Tiêu đề trang Menu (Không đổi) */}
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

                {/* BỐ CỤC 2 CỘT CHO MENU & DANH MỤC LỌC (Không đổi) */}
                <div className="flex gap-10">
                    
                    {/* CỘT 1: SIDEBAR DANH MỤC (Không đổi) */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-28 bg-gray-800 p-6 rounded-xl shadow-lg border border-amber-500/30">
                            <h3 className="text-2xl font-bold font-serif text-white mb-4 border-b border-gray-600 pb-2">
                                Danh Mục
                            </h3>
                            <ul className="space-y-2">
                                {menuData.map((category) => (
                                    <li key={category.categoryName}>
                                        <button
                                            onClick={() => scrollToCategory(category.categoryName)}
                                            className={`
                                                w-full text-left py-2 px-3 rounded-lg transition duration-200
                                                ${activeCategory === category.categoryName
                                                    ? 'bg-amber-600 text-white font-bold' // ACTIVE
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-amber-500' // INACTIVE
                                                }
                                            `}
                                        >
                                            <span className='font-medium text-lg'>{category.categoryName}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* CỘT 2: NỘI DUNG MENU CHÍNH */}
                    <main className="flex-grow">
                        <div className="space-y-16">
                            {menuData.map((category) => {
                                const IconComponent = getCategoryIcon(category.categoryName); 
                                
                                return (
                                    <div 
                                        key={category.categoryName} 
                                        ref={el => categoryRefs.current[category.categoryName] = el}
                                        data-category={category.categoryName}
                                        className="bg-gray-800 p-8 rounded-xl shadow-2xl"
                                    >
                                        
                                        {/* Tiêu đề danh mục (Không đổi) */}
                                        <div className="flex items-center justify-center mb-10 border-b-2 border-amber-600/50 pb-4">
                                            <IconComponent className="w-8 h-8 text-amber-500 mr-4" />
                                            <h2 className="text-3xl font-bold font-serif text-amber-500 uppercase tracking-wider">
                                                {category.categoryName} 
                                            </h2>
                                        </div>

                                        {/* 👇 DANH SÁCH MÓN ĂN DẠNG CARD (Grid Layout) */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                            {category.items.map((item, itemIndex) => (
                                                <MenuCard key={item._id || itemIndex} item={item} />
                                            ))}
                                        </div>
                                        {/* 👆 KẾT THÚC DANH SÁCH MÓN ĂN DẠNG CARD */}
                                    </div>
                                );
                            })}
                        </div>
                    </main>
                </div>

                {/* Ghi chú chân trang (Không đổi) */}
                <footer className="text-center mt-20 text-gray-500 italic text-sm">
                    <p>* Giá trên chưa bao gồm 10% VAT và 5% phí phục vụ. Vui lòng hỏi Sommelier để được tư vấn rượu vang.</p>
                </footer>
            </div>
        </div>
    );
};

export default MenuPage;