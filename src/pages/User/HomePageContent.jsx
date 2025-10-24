// src/pages/HomePageContent.jsx (hoặc HomePage.jsx)

import React from 'react';
// NHỚ import tất cả các components cần thiết cho trang chủ
import HeroSection from '../../components/homepage/HeroSection'; 
import StorySection from '../../components/homepage/StorySection'; 
import MenuTeaser from '../../components/homepage/MenuTeaser'; 
import ImageSlider from '../../components/homepage/ImageSlider';
import Testimonials from '../../components/homepage/Testimonials';

const HomePageContent = () => {
    return (
        <>
            <HeroSection /> 
            <StorySection />
            <MenuTeaser /> 
            <ImageSlider />
            <Testimonials />
        </>
    );
};

export default HomePageContent;