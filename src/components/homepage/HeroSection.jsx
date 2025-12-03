import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      
      {/* Background Image với lớp phủ tối */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://res.cloudinary.com/drehgc3kg/image/upload/v1763644625/photo-1514362545857-3bc16c4c7d1b_xolkg0.avif" 
          alt="Luxury Dining" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-900"></div>
      </div>

      {/* Nội dung chính */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-16">
        <span className="block text-amber-500 font-serif text-xl md:text-2xl mb-4 tracking-widest uppercase animate-fade-in-up">
            Chào mừng đến với L'ESSENCE
        </span>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif leading-tight animate-fade-in-up delay-100">
          Tinh Hoa Ẩm Thực <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200">
            Á Đông & Hiện Đại
          </span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light animate-fade-in-up delay-200">
          Trải nghiệm bản giao hưởng của hương vị trong không gian sang trọng bậc nhất. Nơi mỗi món ăn là một tác phẩm nghệ thuật.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link 
                to="/dat-ban" 
                className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white text-lg font-bold rounded-full transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 hover:-translate-y-1"
            >
                Đặt Bàn Ngay <ArrowRight size={20} />
            </Link>
            <Link 
                to="/thuc-don" 
                className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg font-bold rounded-full transition-all flex items-center justify-center"
            >
                Xem Thực Đơn
            </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-amber-500 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;