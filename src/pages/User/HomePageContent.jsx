// src/pages/HomePageContent.jsx (hoặc HomePage.jsx)

import React from 'react';
// NHỚ import tất cả các components cần thiết cho trang chủ
import HeroSection from '../../components/UserComponents/HeroSection'; 
import StorySection from '../../components/UserComponents/StorySection'; 
import MenuTeaser from '../../components/UserComponents/MenuTeaser'; 
import ImageSlider from '../../components/UserComponents/ImageSlider';
import Testimonials from '../../components/UserComponents/Testimonials';

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