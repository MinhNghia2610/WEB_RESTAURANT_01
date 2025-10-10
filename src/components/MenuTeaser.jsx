import React from 'react';
import { Link } from 'react-router-dom'; // <--- Đã thêm import Link
import { Leaf, Award, Utensils } from 'lucide-react';

// Dữ liệu mẫu cho Menu Teaser (3 món nổi bật)
const menuTeaserData = [
    {
        name: "L'Essence de Boeuf",
        tagline: "Tinh túy Bò Wagyu A5 & Nấm Truffle Đen",
        description: "Thăn nội bò Wagyu A5 áp chảo, kết hợp cùng nước sốt Reduction từ rượu vang đỏ Pháp.",
        icon: Award,
        image: "https://placehold.co/600x400/3A3A3A/F5D050?text=Wagyu+Beef"
    },
    {
        name: "Sắc Biển Tịnh Tâm",
        tagline: "Cá Tuyết Chile Hấp Thảo Dược Đông Y",
        description: "Cá tuyết tươi nhập khẩu hấp cùng thảo mộc Á Đông, mang lại sự cân bằng âm dương.",
        icon: Leaf,
        image: "https://placehold.co/600x400/3A3A3A/F5D050?text=Chilean+Seabass"
    },
    {
        name: "Bản Giao Hưởng Vườn",
        tagline: "Rau Củ Hữu Cơ & Sốt Mù Tạt Dijon",
        description: "Bộ sưu tập rau củ theo mùa, chế biến Sous-vide, nhẹ nhàng và thanh lọc cơ thể.",
        icon: Utensils,
        image: "https://placehold.co/600x400/3A3A3A/F5D050?text=Seasonal+Vegetables"
    },
];

const MenuTeaser = () => {
    return (
        // Đã đồng bộ nền chính thành bg-gray-800
        <section className="py-20 md:py-32 bg-gray-800 text-white" id="thuc-don-teaser">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Tiêu đề chính */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <p className="text-amber-500 font-serif uppercase tracking-widest mb-2">
                        KIỆT TÁC ẨM THỰC
                    </p>
                    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight font-serif text-amber-500">
                        Thực Đơn Nổi Bật Mùa
                    </h2>
                </div>

                {/* Grid 3 món nổi bật */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {menuTeaserData.map((item, index) => (
                        <div 
                            key={index} 
                            // Đặt nền gray-700 để có độ nổi bật nhẹ so với nền gray-800
                            className="group relative overflow-hidden rounded-xl shadow-2xl bg-gray-700 transition duration-500 hover:scale-[1.02]"
                        >
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-64 object-cover object-center transition duration-500 group-hover:opacity-75"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/444444/FFFFFF?text=L'ESSENCE+Dish" }}
                            />
                            <div className="p-6">
                                <item.icon className="w-6 h-6 text-amber-500 mb-2" />
                                <h3 className="text-2xl font-bold font-serif text-amber-500 mb-1">
                                    {item.name}
                                </h3>
                                <p className="text-sm font-semibold text-gray-300 italic mb-3">
                                    {item.tagline}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Xem Menu đầy đủ - Đã chuyển thành <Link> */}
                <div className="mt-16 text-center">
                    <Link 
                        to="/thuc-don" // Sử dụng 'to' thay vì 'href'
                        className="inline-flex items-center px-12 py-4 border border-amber-600 text-lg font-semibold rounded-lg shadow-xl text-amber-500 hover:text-white bg-transparent hover:bg-amber-600 transition duration-300 transform hover:scale-105"
                    >
                        XEM TOÀN BỘ THỰC ĐƠN
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default MenuTeaser;