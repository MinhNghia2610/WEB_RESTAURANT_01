import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

const featuredDishes = [
    {
        id: 1,
        name: "Bò Wagyu Dát Vàng",
        desc: "Thịt bò Wagyu A5 thượng hạng, nướng trên đá muối Himalaya, phủ vàng thực phẩm 24K.",
        price: "2.500.000",
        img: "https://res.cloudinary.com/drehgc3kg/image/upload/v1763644841/photo-1544025162-d76694265947_wynsdk.avif"
    },
    {
        id: 2,
        name: "Tôm Hùm Alaska Sốt Kem",
        desc: "Tôm hùm tươi sống bắt tại hồ, chế biến cùng sốt kem nấm Truffle đen quý hiếm.",
        price: "1.890.000",
        img: "https://res.cloudinary.com/drehgc3kg/image/upload/v1763644814/photo-1533777857889-4be7c70b33f7_yuomnd.avif"
    },
    {
        id: 3,
        name: "Gan Ngỗng Pháp Áp Chảo",
        desc: "Gan ngỗng béo ngậy nhập khẩu từ Pháp, ăn kèm sốt mâm xôi và bánh mì Brioche.",
        price: "950.000",
        img: "https://res.cloudinary.com/drehgc3kg/image/upload/v1763644754/UDP3CWDZPVA3BK2LNI2AAST26E_ivyx0g_vzpiux.jpg"
    }
];

const MenuTeaser = () => {
  return (
    <section className="py-20 bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
            <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-3">Thực Đơn Đặc Biệt</h3>
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-white">Tinh Hoa L'ESSENCE</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDishes.map((dish) => (
                <div key={dish.id} className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2">
                    <div className="h-64 overflow-hidden relative">
                        <img src={dish.img} alt={dish.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-amber-400 px-3 py-1 rounded-full text-sm font-bold border border-amber-500/30">
                            {dish.price} ₫
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex gap-1 mb-3 text-amber-500">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-serif group-hover:text-amber-400 transition-colors">{dish.name}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{dish.desc}</p>
                        <Link to="/dat-mon-online" className="inline-flex items-center text-amber-500 text-sm font-bold hover:text-white transition-colors gap-2">
                            Đặt món ngay <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            ))}
        </div>

        <div className="text-center mt-12">
            <Link to="/thuc-don" className="inline-block px-8 py-3 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-full font-bold transition-all duration-300">
                Xem Toàn Bộ Thực Đơn
            </Link>
        </div>

      </div>
    </section>
  );
};

export default MenuTeaser;