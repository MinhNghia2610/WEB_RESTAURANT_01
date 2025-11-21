import React from 'react';
import { Leaf, Utensils, Award, Heart, ShieldCheck, Clock } from 'lucide-react';

const GioiThieuPage = () => {
  return (
    <div className="pt-20 bg-gray-900 min-h-screen text-white font-sans relative overflow-hidden">
      
      {/* Họa tiết nền chìm (Pattern) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #fbbf24 1px, transparent 0)", backgroundSize: "40px 40px" }}>
      </div>

      {/* HEADER SECTION */}
      <div className="relative py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
            <h3 className="text-amber-500 font-bold uppercase tracking-[0.3em] text-sm mb-4 animate-fade-in-up">
                Về L'ESSENCE
            </h3>
            <h1 className="text-5xl md:text-6xl font-extrabold font-serif text-white mb-6 leading-tight animate-fade-in-up delay-100">
                Triết Lý <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200">Dưỡng Sinh</span> <br/> Trong Ẩm Thực
            </h1>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-8 rounded-full"></div>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto animate-fade-in-up delay-200">
                <span className="text-amber-500 font-bold">L'ESSENCE</span> không chỉ là nơi thưởng thức món ngon, mà là hành trình tìm lại sự cân bằng cho cơ thể và tâm hồn. Chúng tôi tin rằng, món ăn ngon nhất là món ăn mang lại sức khỏe và hạnh phúc.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        
        {/* SECTION 1: TẦM NHÌN & SỨ MỆNH */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          {/* Cột Hình ảnh (Hiệu ứng khung tranh) */}
          <div className="order-2 lg:order-1 relative group">
             <div className="absolute -top-5 -left-5 w-full h-full border-2 border-amber-500/20 rounded-xl transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2"></div>
             <div className="relative overflow-hidden rounded-xl shadow-2xl">
                <img 
                    src="https://res.cloudinary.com/drehgc3kg/image/upload/v1763645384/sunset-restaurant-view_xlqnlq.jpg" 
                    alt="Không gian nhà hàng L'ESSENCE" 
                    className="w-full h-[500px] object-cover transform transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
             </div>
          </div>

          {/* Cột Nội dung */}
          <div className="order-1 lg:order-2 space-y-8">
             <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl hover:border-amber-500/30 transition-all duration-300">
                <h2 className="text-3xl font-bold font-serif text-white mb-4 flex items-center gap-3">
                    <span className="text-amber-500 text-4xl">❝</span> Tầm Nhìn
                </h2>
                <p className="text-gray-400 leading-relaxed">
                    Định hình lại khái niệm <span className="text-white font-semibold">Fine Dining</span> tại Việt Nam. Đưa L'ESSENCE trở thành biểu tượng của ẩm thực cao cấp kết hợp triết lý dưỡng sinh Á Đông, nơi mỗi bữa ăn là một liệu pháp chữa lành tự nhiên.
                </p>
             </div>

             <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl hover:border-amber-500/30 transition-all duration-300">
                <h2 className="text-3xl font-bold font-serif text-white mb-4 flex items-center gap-3">
                    <span className="text-amber-500 text-4xl">★</span> Sứ Mệnh
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                    Sáng tạo các kiệt tác ẩm thực từ **100% nguyên liệu hữu cơ**, kết hợp kỹ thuật chế biến tinh hoa của Pháp để giữ trọn vẹn hương vị và dưỡng chất.
                </p>
                
                {/* Chef Signature */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        J
                    </div>
                    <div>
                        <p className="text-white font-bold">Julien DuBois</p>
                        <p className="text-amber-500 text-xs uppercase tracking-wider">Bếp Trưởng & Nhà Sáng Lập</p>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* SECTION 2: NGUYÊN TẮC CỐT LÕI */}
        <div className="text-center mb-16">
            <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-3">Giá Trị Của Chúng Tôi</h3>
            <h2 className="text-4xl font-bold font-serif text-white">6 Nguyên Tắc Vàng</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-amber-500/50 hover:bg-gray-800/80 transition-all duration-300 group hover:-translate-y-2">
                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-600 group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-colors">
                    <Leaf className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">Hữu Cơ & Thuần Khiết</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Ưu tiên sử dụng nguyên liệu Organic, Non-GMO từ các nông trại bền vững. Nói không với chất bảo quản và phụ gia công nghiệp.
                </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-amber-500/50 hover:bg-gray-800/80 transition-all duration-300 group hover:-translate-y-2">
                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-600 group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-colors">
                    <Utensils className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">Kỹ Thuật Đỉnh Cao</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Áp dụng kỹ thuật Sous-vide và Fermentation hiện đại để khai phá tầng hương vị mới mà vẫn bảo toàn cấu trúc dinh dưỡng.
                </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-amber-500/50 hover:bg-gray-800/80 transition-all duration-300 group hover:-translate-y-2">
                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-600 group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-colors">
                    <Award className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">Cân Bằng Âm Dương</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Thực đơn được tư vấn bởi chuyên gia dinh dưỡng, đảm bảo sự cân bằng về năng lượng, nhiệt lượng và ngũ hành.
                </p>
            </div>

             {/* Card 4 */}
             <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-amber-500/50 hover:bg-gray-800/80 transition-all duration-300 group hover:-translate-y-2">
                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-600 group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-colors">
                    <Heart className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">Tận Tâm Phục Vụ</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Mỗi nhân viên là một đại sứ văn hóa, phục vụ bằng cả trái tim để mang lại trải nghiệm hoàn hảo nhất cho thực khách.
                </p>
            </div>

             {/* Card 5 */}
             <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-amber-500/50 hover:bg-gray-800/80 transition-all duration-300 group hover:-translate-y-2">
                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-600 group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-colors">
                    <ShieldCheck className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">An Toàn Tuyệt Đối</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Quy trình kiểm soát vệ sinh an toàn thực phẩm đạt chuẩn ISO 22000:2018, đảm bảo sự an tâm tuyệt đối.
                </p>
            </div>

             {/* Card 6 */}
             <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-amber-500/50 hover:bg-gray-800/80 transition-all duration-300 group hover:-translate-y-2">
                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-600 group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-colors">
                    <Clock className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">Mùa Nào Thức Nấy</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Thực đơn thay đổi theo mùa để tận dụng nguồn nguyên liệu tươi ngon nhất và phù hợp với nhịp sinh học cơ thể.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default GioiThieuPage;