import React from 'react';
import HeroSection from '../../components/homepage/HeroSection';
import StorySection from '../../components/homepage/StorySection';
import MenuTeaser from '../../components/homepage/MenuTeaser';
import Testimonials from '../../components/homepage/Testimonials';
import ImageSlider from '../../components/homepage/ImageSlider';

const HomePageContent = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans overflow-hidden">
      {/* 1. Hero Section - Ấn tượng đầu tiên */}
      <HeroSection />

      {/* 2. Story Section - Câu chuyện thương hiệu */}
      <StorySection />

      {/* 3. Menu Teaser - Giới thiệu món nổi bật */}
      <MenuTeaser />

      {/* 4. Image Slider - Không gian nhà hàng */}
      <section className="py-20 bg-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
             <h2 className="text-3xl md:text-4xl font-bold font-serif text-amber-500 mb-4">
                Không Gian Đẳng Cấp
             </h2>
             <p className="text-gray-400 max-w-2xl mx-auto">
                Nơi kiến trúc hiện đại giao hòa cùng nét cổ điển, tạo nên không gian ẩm thực sang trọng và ấm cúng.
             </p>
        </div>
        <ImageSlider />
      </section>

      {/* 5. Testimonials - Đánh giá khách hàng */}
      <Testimonials />
    </div>
  );
};

export default HomePageContent;