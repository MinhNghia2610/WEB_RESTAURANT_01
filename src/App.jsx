import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Import các Components và Pages
import Navbar from './components/Navbar'; 
import HeroSection from './components/HeroSection'; 
<<<<<<< HEAD
import CartSidebar from './components/CartSidebar';
import StorySection from './components/StorySection'; 
import Testimonials from './components/Testimonials'; 
import Footer from './components/Footer';
import ChatBot from './components/ChatBot'; // IMPORT MỚI: POP UP CHAT BOT
import AuthModal from './components/AuthModal';

// Imports các trang nội dung (điều chỉnh tên file theo cấu trúc mới)
=======
// ... (Các imports khác: CartSidebar, Footer, Pages...)
>>>>>>> ad551855fe4e7c875e4ec807b564c535c80d8db2
import GioiThieuPage from './pages/AboutUs'; 
import MenuPage from './pages/MenuPage';
import ReservationPage from './pages/ReservationPage'; 
import StorySection from './components/StorySection'; 
import MenuTeaser from './components/MenuTeaser'; 
import ImageSlider from './components/ImageSlider';
import Testimonials from './components/Testimonials';
import CartSidebar from './components/CartSidebar';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

<<<<<<< HEAD
// Hàm đơn giản để xác định trang hiện tại dựa trên hash URL (ví dụ: #gioi-thieu)
const getPage = () => {
    const hash = window.location.hash.slice(1).toLowerCase();
    switch (hash) {
        case 'gioi-thieu':
            return 'gioi-thieu';
        case 'thuc-don':
            return 'thuc-don';
        case 'bai-viet':
            return 'bai-viet';
        case 'dat-ban':
            return 'dat-ban';
        default:
            return 'trang-chu';
    }   
=======
// Component để buộc cuộn lên đầu trang (Rất quan trọng!)
const ScrollToTop = () => {
    const { pathname } = useLocation();
    
    // Lắng nghe mỗi khi pathname (đường dẫn URL) thay đổi
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; // Component này không render gì cả
>>>>>>> ad551855fe4e7c875e4ec807b564c535c80d8db2
};

const HomePageContent = () => (
    <>
        <HeroSection /> 
        <StorySection />
        <MenuTeaser /> 
        <ImageSlider />
        <Testimonials />
    </>
);

function AppContent() {
    const [isCartOpen, setIsCartOpen] = useState(false); 
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); 
    
    // Lấy vị trí hiện tại để có thể truyền vào Navbar nếu cần (ví dụ: đánh dấu menu đang hoạt động)
    const location = useLocation(); 

    return (
        <div className="App font-sans">
            <ScrollToTop /> {/* Thêm component cuộn lên đầu */}
            
            <Navbar 
                setIsCartOpen={setIsCartOpen} 
                setIsAuthModalOpen={setIsAuthModalOpen} 
                currentPage={location.pathname} // Truyền đường dẫn hiện tại
            />

            <main className="min-h-screen">
                <Routes>
                    {/* TRANG CHỦ: Đường dẫn '/' */}
                    <Route path="/" element={<HomePageContent />} /> 
                    
                    {/* CÁC TRANG NỘI DUNG KHÁC */}
                    <Route path="/gioi-thieu" element={<GioiThieuPage />} />
                    <Route path="/thuc-don" element={<MenuPage />} />
                    <Route path="/dat-ban" element={<ReservationPage />} /> 
                    
                    {/* 404/Không tìm thấy (Nên có) */}
                    <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
                </Routes>
            </main>
            
            <CartSidebar isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            <Footer /> 
<<<<<<< HEAD
            <ChatBot />
=======
>>>>>>> ad551855fe4e7c875e4ec807b564c535c80d8db2
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;