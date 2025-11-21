import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  "https://res.cloudinary.com/drehgc3kg/image/upload/v1763644906/photo-1517248135467-4c7edcad34c4_ylplme.avif",
  "https://res.cloudinary.com/drehgc3kg/image/upload/v1763644541/photo-1559339352-11d035aa65de_m51dm5.avif",
  "https://res.cloudinary.com/drehgc3kg/image/upload/v1763644988/photo-1554118811-1e0d58224f24_o6qxbf.avif",
  "https://res.cloudinary.com/drehgc3kg/image/upload/v1763645201/Hakkasan-Mayfair-Private-Dining-Room-Image2-1_al6ojs.jpg"
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Auto play
  useEffect(() => {
    const interval = setInterval(() => {
        nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="max-w-[1200px] h-[500px] w-full m-auto py-4 px-4 relative group">
      <div
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
        className="w-full h-full rounded-2xl bg-center bg-cover duration-500 shadow-2xl border border-gray-700 relative"
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
      </div>
      
      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/50 text-white cursor-pointer hover:bg-amber-500 transition-all">
        <ChevronLeft onClick={prevSlide} size={30} />
      </div>
      
      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/50 text-white cursor-pointer hover:bg-amber-500 transition-all">
        <ChevronRight onClick={nextSlide} size={30} />
      </div>
      
      {/* Dots */}
      <div className="flex top-4 justify-center py-2 absolute bottom-8 w-full gap-2">
        {images.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            className={`text-2xl cursor-pointer transition-all duration-300 ${slideIndex === currentIndex ? 'text-amber-500 scale-125' : 'text-gray-500 hover:text-white'}`}
          >
             ●
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;