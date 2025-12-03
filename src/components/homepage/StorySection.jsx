import React from 'react';

const StorySection = () => {
  return (
    <section className="py-20 md:py-32 bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">
            
            {/* Cột Hình Ảnh */}
            <div className="w-full md:w-1/2 relative">
                <div className="absolute -top-4 -left-4 w-full h-full border-2 border-amber-500/30 rounded-xl"></div>
                <img 
                    src="https://res.cloudinary.com/drehgc3kg/image/upload/v1763644541/photo-1559339352-11d035aa65de_m51dm5.avif" 
                    alt="Chef Cooking" 
                    className="relative rounded-xl shadow-2xl w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute -bottom-6 -right-6 bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-xs hidden lg:block">
                    <p className="text-amber-500 font-serif text-4xl font-bold mb-1">15+</p>
                    <p className="text-gray-400 text-sm uppercase tracking-wider">Năm kinh nghiệm</p>
                </div>
            </div>

            {/* Cột Nội Dung */}
            <div className="w-full md:w-1/2">
                <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-3">Câu Chuyện Của Chúng Tôi</h3>
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6 leading-tight">
                    Nơi Hương Vị <br/> Thăng Hoa Cảm Xúc
                </h2>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                    Tại <span className="text-amber-500 font-bold">L'ESSENCE</span>, chúng tôi tin rằng ẩm thực không chỉ là món ăn, mà là một hành trình văn hóa. Mỗi nguyên liệu đều được tuyển chọn khắt khe từ những nông trại hữu cơ tốt nhất, qua bàn tay tài hoa của bếp trưởng 3 sao Michelin.
                </p>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Chúng tôi kết hợp kỹ thuật nấu ăn hiện đại của phương Tây với gia vị truyền thống phương Đông để tạo nên những kiệt tác không thể nào quên.
                </p>
                
                <div className="flex items-center gap-4">
                    <img src="https://res.cloudinary.com/dxfw6maax/image/upload/v1763641067/Gordon_tbw897.jpg" />
                    <div>
                        <p className="text-white font-bold">Alexandro Chef</p>
                        <p className="text-amber-600 text-xs uppercase">Bếp Trưởng Điều Hành</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default StorySection;