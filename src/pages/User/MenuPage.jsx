import React, { useState, useEffect } from 'react';
import { Wine, Coffee, ChefHat, Salad } from 'lucide-react'; 

// Hàm hỗ trợ để ánh xạ tên danh mục sang Icon
const getCategoryIcon = (categoryTitle) => {
    // Chúng ta sẽ lấy tên danh mục từ trường 'category' của DB, 
    // vốn được gom nhóm thành 'categoryName'
    const title = categoryTitle ? categoryTitle.toUpperCase() : '';
    if (title.includes('KHAI VỊ') || title.includes('ENTRÉES')) return Salad;
    if (title.includes('CHÍNH') || title.includes('PLATS PRINCIPAUX')) return ChefHat;
    if (title.includes('TRÁNG MIỆNG') || title.includes('DESSERTS')) return Coffee;
    if (title.includes('RƯỢU VANG') || title.includes('WINE')) return Wine;
    return ChefHat;
};

// Component hiển thị chi tiết một món ăn
const MenuItem = ({ item }) => (
    // Chúng ta thêm lớp flex và xử lý hình ảnh
    <div className="flex items-center border-b border-gray-700 pb-4 mb-4">
        
        {/* Lấy hình ảnh từ item.imageURL */}
        {item.imageURL && (
            <img 
                src={item.imageURL} 
                alt={item.name} 
                className="w-24 h-24 object-cover rounded-lg mr-6 flex-shrink-0"
            />
        )}
        
        <div className="flex-grow flex justify-between items-start">
            <div className="flex-grow pr-4">
                <h3 className="text-xl font-bold font-serif text-amber-500 mb-1">
                    {/* Dùng item.name */}
                    {item.name}
                </h3>
                <p className="text-sm text-gray-400">
                    {/* Dùng item.description */}
                    {item.description}
                </p>
            </div>
            <div className="flex-shrink-0 text-right">
                <p className="text-xl font-extrabold text-white">
                    {/* Dùng item.price (là số) và item.unit */}
                    {item.price 
                        ? `${item.price.toLocaleString('vi-VN')} ${item.unit || 'VNĐ'}` 
                        : item.unit || "Liên hệ"}
                </p>
            </div>
        </div>
    </div>
);

const MenuPage = () => {
    // Dùng state để lưu dữ liệu menu dynamic từ API
    const [menuData, setMenuData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // Gọi API backend (đã được cấu hình trong server.js)
                const response = await fetch('http://localhost:5000/api/menu'); 
                
                if (!response.ok) {
                    throw new Error('Failed to fetch menu data');
                }
                
                const result = await response.json();
                // Dữ liệu đã được Controller gom nhóm thành categoryName/items
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

    // Hiển thị trạng thái Loading và Error
    if (isLoading) {
        return <div className="pt-32 pb-20 bg-gray-900 min-h-screen text-white text-center text-2xl">Đang tải thực đơn...</div>;
    }

    if (error) {
        return <div className="pt-32 pb-20 bg-gray-900 min-h-screen text-red-500 text-center text-2xl">{error}</div>;
    }


    return (
        <div className="pt-32 pb-20 bg-gray-900 min-h-screen text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
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

                {/* Các phần Menu theo danh mục */}
                <div className="space-y-16">
                    {/* Dùng menuData từ API */}
                    {menuData.map((category) => {
                        // Lấy Icon dựa trên tên danh mục (categoryName)
                        const IconComponent = getCategoryIcon(category.categoryName);
                        
                        return (
                            // Dùng categoryName làm key vì categoryName là tên danh mục
                            <div key={category.categoryName} className="bg-gray-800 p-8 rounded-xl shadow-2xl">
                                
                                {/* Tiêu đề danh mục */}
                                <div className="flex items-center justify-center mb-10 border-b-2 border-amber-600/50 pb-4">
                                    <IconComponent className="w-8 h-8 text-amber-500 mr-4" />
                                    <h2 className="text-3xl font-bold font-serif text-amber-500 uppercase tracking-wider">
                                        {/* Dùng category.categoryName */}
                                        {category.categoryName} 
                                    </h2>
                                </div>

                                {/* Danh sách món ăn */}
                                <div className="space-y-6">
                                    {/* Dùng category.items */}
                                    {category.items.map((item, itemIndex) => (
                                        // item._id là ID thực tế từ DB, dùng nó làm key tốt nhất
                                        <MenuItem key={item._id || itemIndex} item={item} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
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