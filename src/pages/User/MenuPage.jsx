import React from 'react';
import { Wine, Coffee, ChefHat, Salad } from 'lucide-react';

// Dữ liệu Menu Đầy Đủ (Đã phân loại)
const fullMenuData = [
    {
        title: "KHAI VỊ (ENTRÉES)",
        icon: Salad,
        items: [
            {
                name: "Foie Gras Terrine Dưỡng Sinh",
                description: "Gan ngỗng áp chảo kỹ thuật Pháp, dùng kèm mứt gừng tươi và rượu Sauternes, giúp bổ khí huyết.",
                price: "450.000 VNĐ"
            },
            {
                name: "Tôm Hùm Canape Đông Trùng",
                description: "Thịt tôm hùm tươi Canada trộn với bơ tỏi và đông trùng hạ thảo, đặt trên bánh mì nướng giòn.",
                price: "380.000 VNĐ"
            },
            {
                name: "Súp Bí Đỏ Hạt Sen",
                description: "Súp kem bí đỏ nấu chậm, rắc hạt sen rang giòn, vị ngọt thanh mát, hỗ trợ tiêu hóa.",
                price: "180.000 VNĐ"
            },
        ]
    },
    {
        title: "MÓN CHÍNH (PLATS PRINCIPAUX)",
        icon: ChefHat,
        items: [
            {
                name: "L'Essence de Boeuf Wagyu A5",
                description: "Thăn nội bò Wagyu A5 áp chảo, sốt Reduction rượu vang đỏ, nấm truffle đen và rau củ Dưỡng Sinh.",
                price: "1.250.000 VNĐ"
            },
            {
                name: "Cá Tuyết Hấp Thảo Dược",
                description: "Cá tuyết Chile hấp cách thủy cùng Đẳng Sâm, Kỷ Tử, cân bằng âm dương, ăn kèm khoai tây nghiền.",
                price: "890.000 VNĐ"
            },
            {
                name: "Thịt Cừu Úc Sốt Mận Tím",
                description: "Thịt cừu Úc nướng hồng, sốt mận tím và rượu Port, ăn kèm măng tây xanh nướng.",
                price: "950.000 VNĐ"
            },
        ]
    },
    {
        title: "TRÁNG MIỆNG & ĐỒ UỐNG NÓNG",
        icon: Coffee,
        items: [
            {
                name: "Tiramisu Sen Vàng",
                description: "Bánh Tiramisu phiên bản Việt: lớp kem Mascarpone cùng bột trà xanh và hạt sen tươi.",
                price: "150.000 VNĐ"
            },
            {
                name: "Kem Sữa Chua Dâu Rừng",
                description: "Kem sữa chua tự nhiên, topping dâu rừng và mật ong hoa cà phê, thanh mát.",
                price: "120.000 VNĐ"
            },
            {
                name: "Trà Thảo Mộc L'Essence",
                description: "Tuyển chọn các loại hoa và thảo mộc giúp thư giãn và thải độc.",
                price: "90.000 VNĐ"
            },
        ]
    },
    {
        title: "TUYỂN CHỌN RƯỢU VANG",
        icon: Wine,
        items: [
            {
                name: "Château Margaux Premier Cru (Bordeaux, 2010)",
                description: "Dòng rượu cao cấp, hương vị cổ điển, đậm đà và phức hợp, có sẵn chai (750ml).",
                price: "Liên hệ Sommelier"
            },
            {
                name: "Cloudy Bay Sauvignon Blanc (Marlborough, 2023)",
                description: "Rượu vang trắng nhẹ, hương bưởi và chanh dây, lý tưởng cho hải sản.",
                price: "350.000 VNĐ/ly"
            },
        ]
    },
];

// Component hiển thị chi tiết một món ăn
const MenuItem = ({ item }) => (
    <div className="flex justify-between items-start border-b border-gray-700 pb-4 mb-4">
        <div className="flex-grow pr-4">
            <h3 className="text-xl font-bold font-serif text-amber-500 mb-1">
                {item.name}
            </h3>
            <p className="text-sm text-gray-400">
                {item.description}
            </p>
        </div>
        <div className="flex-shrink-0 text-right">
            <p className="text-xl font-extrabold text-white">
                {item.price}
            </p>
        </div>
    </div>
);

const MenuPage = () => {
    return (
        <div className="pt-32 pb-20 bg-gray-900 min-h-screen text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Tiêu đề trang Menu */}
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
                    {fullMenuData.map((category, index) => (
                        <div key={index} className="bg-gray-800 p-8 rounded-xl shadow-2xl">
                            
                            {/* Tiêu đề danh mục */}
                            <div className="flex items-center justify-center mb-10 border-b-2 border-amber-600/50 pb-4">
                                <category.icon className="w-8 h-8 text-amber-500 mr-4" />
                                <h2 className="text-3xl font-bold font-serif text-amber-500 uppercase tracking-wider">
                                    {category.title}
                                </h2>
                            </div>

                            {/* Danh sách món ăn */}
                            <div className="space-y-6">
                                {category.items.map((item, itemIndex) => (
                                    <MenuItem key={itemIndex} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Ghi chú chân trang */}
                <footer className="text-center mt-20 text-gray-500 italic text-sm">
                    <p>* Giá trên chưa bao gồm 10% VAT và 5% phí phục vụ. Vui lòng hỏi Sommelier để được tư vấn rượu vang.</p>
                </footer>
            </div>
        </div>
    );
};

export default MenuPage;