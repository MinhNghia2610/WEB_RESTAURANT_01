import React from 'react';
import { Link } from 'react-router-dom'; // <--- Đã thêm import Link

const HeroSection = () => {
  return (
    // Sử dụng chiều cao tối đa của màn hình (min-h-screen)
    <div className="relative min-h-screen"> 
      <div 
        className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{ 
          // Ảnh nền lãng mạn, ẩm thực tinh tế (Placeholder chất lượng cao)
          backgroundImage: `url('https://placehold.co/1920x1080/1A1A1A/D4AF37?text=L\'ESSENCE+Fine+Dining')`, 
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Lớp phủ (Overlay): bg-black/60 */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Nội dung trung tâm: Sử dụng p-8 để tạo thêm không gian đệm */}
        <div className="relative text-center z-10 p-8">
          
          {/* Tiêu đề Phụ 1: Chào mừng (Tiếng Việt Tinh tế) */}
          <p className="text-xl italic font-serif text-gray-200 tracking-widest">
            Chào mừng đến với
          </p>

          {/* Tiêu đề Chính (L'ESSENCE) */}
          <h1 className="text-7xl md:text-8xl font-bold mt-3 mb-10 tracking-widest uppercase">
            L'ESSENCE
          </h1>
<<<<<<< HEAD
          {/* Nút ĐẶT HÀNG NGAY - CTA */}
          <button
            onClick={() => { /* logic chuyển đến trang đặt hàng */ }}
            className="mt-6 px-10 py-3 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-full shadow-lg transform transition duration-300 hover:scale-105"
          >
             ĐẶT BÀN ONLINE
          </button>
=======
          
          {/* Tiêu đề Phụ 2: Slogan (Tiếng Việt) */}
          <p className="text-2xl font-light italic font-serif text-gray-100 mb-12">
            Nghệ thuật Ẩm thực Pháp Đương đại.
          </p>

          {/* Nút CTA chính: ĐẶT BÀN - Đã chuyển thành <Link> */}
          <Link
            to="/dat-ban" // Trỏ đến trang đặt bàn
            className="mt-8 px-12 py-4 bg-amber-600 hover:bg-amber-700 text-white text-xl font-bold rounded-none shadow-xl transform transition duration-300 hover:scale-105 tracking-wider border border-amber-600 hover:border-amber-700 inline-block"
          >
            ĐẶT BÀN
          </Link>
>>>>>>> ad551855fe4e7c875e4ec807b564c535c80d8db2
        </div>
        
        {/* Phần MenuStrip đã được loại bỏ, chỉ còn nội dung chính */}
      </div>
    </div>
  );
};

export default HeroSection;