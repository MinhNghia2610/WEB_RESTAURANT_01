import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Dữ liệu hình ảnh cho slider.
const sliderImages = [
    { url: "https://placehold.co/1200x600/3D3D3D/D4AF37?text=Luxury+Dining+Room", alt: "Phòng ăn sang trọng" },
    { url: "https://placehold.co/1200x600/4D4D4D/D4AF37?text=Exclusive+Wine+Cellar", alt: "Hầm rượu độc quyền" },
    { url: "https://placehold.co/1200x600/5D5D5D/D4AF37?text=Chef's+Signature+Dish", alt: "Món ăn đặc trưng của Bếp trưởng" },
    { url: "https://placehold.co/1200x600/6D6D6D/D4AF37?text=Elegant+Table+Setting", alt: "Bàn tiệc tinh tế" },
];

const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Chuyển về slide trước
    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? sliderImages.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    // Chuyển đến slide tiếp theo
    const goToNext = () => {
        const isLastSlide = currentIndex === sliderImages.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    // Chuyển slide tự động (mỗi 5 giây)
    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 5000); 

        // Dọn dẹp interval khi component unmount
        return () => clearInterval(interval);
    }, [currentIndex]); 

    return (
        // Đồng bộ nền tối bg-gray-800
        <section className="py-16 bg-gray-800" id="gallery"> 
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Tiêu đề */}
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-amber-500 leading-tight font-serif">
                        Không Gian L'ESSENCE
                    </h2>
                    <p className="text-gray-300 mt-3 text-lg">
                        Nơi giao thoa kiến trúc và mỹ học ẩm thực, tôn vinh từng khoảnh khắc.
                    </p>
                </div>

                {/* Slider Container */}
                <div className="relative overflow-hidden rounded-xl shadow-2xl group">
                    
                    {/* Image Track - Sử dụng CSS transform để chuyển động ảnh */}
                    <div 
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {sliderImages.map((image, index) => (
                            <div 
                                key={index} 
                                className="min-w-full h-[50vh] md:h-[65vh] relative"
                            >
                                <img 
                                    src={image.url} 
                                    alt={image.alt} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x600/444444/FFFFFF?text=L'ESSENCE+Gallery" }}
                                />
                                {/* Overlay tối nhẹ để tạo chiều sâu */}
                                <div className="absolute inset-0 bg-black/30"></div> 
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows (Ẩn trên mobile, hiện khi hover trên desktop) */}
                    <button 
                        onClick={goToPrevious}
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition duration-300 z-10 hover:bg-black/70 focus:outline-none hidden md:block"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={goToNext}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition duration-300 z-10 hover:bg-black/70 focus:outline-none hidden md:block"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>


                    {/* Indicator Dots */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {sliderImages.map((_, slideIndex) => (
                            <button
                                key={slideIndex}
                                onClick={() => setCurrentIndex(slideIndex)}
                                className={`w-3 h-3 rounded-full transition duration-300 ${
                                    slideIndex === currentIndex ? 'bg-amber-500 scale-125' : 'bg-white/50 hover:bg-white/80'
                                }`}
                                aria-label={`Go to slide ${slideIndex + 1}`}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImageSlider;