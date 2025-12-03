import React from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Clock } from 'lucide-react'; 
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-20 pb-10 font-sans relative overflow-hidden border-t border-amber-500/30">
      
      {/* Họa tiết nền chìm */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #fbbf24 1px, transparent 0)", backgroundSize: "40px 40px" }}>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Cột 1: Logo và Giới thiệu */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-3xl font-bold font-serif text-white tracking-wider flex items-center gap-2">
                        <span className="text-amber-500 text-4xl">L'</span>ESSENCE
                    </h3>
                    <div className="h-1 w-16 bg-amber-600 mt-2 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                    Nghệ thuật ẩm thực Pháp kết hợp triết lý dưỡng sinh Á Đông. Nơi mỗi món ăn là một bản giao hưởng của hương vị và sức khỏe.
                </p>
                <div className="flex gap-4 pt-2">
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                        <Facebook size={18} />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                        <Instagram size={18} />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                        <Twitter size={18} />
                    </a>
                </div>
            </div>

            {/* Cột 2: Thông tin liên hệ */}
            <div>
                <h4 className="text-lg font-bold text-white mb-6 font-serif">Liên Hệ</h4>
                <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                        <MapPin className="text-amber-500 mt-1 shrink-0" size={18} />
                        <span>Tầng 68, Tòa nhà Bitexco, Số 2 Hải Triều, Quận 1, TP. HCM</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Phone className="text-amber-500 shrink-0" size={18} />
                        <span className="font-bold text-white hover:text-amber-500 transition-colors cursor-pointer">+84 28 9876 5432</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Mail className="text-amber-500 shrink-0" size={18} />
                        <span className="hover:text-amber-500 transition-colors cursor-pointer">booking@lessence.vn</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <Clock className="text-amber-500 mt-1 shrink-0" size={18} />
                        <div>
                            <p>10:00 - 14:00 (Bữa trưa)</p>
                            <p>18:00 - 23:00 (Bữa tối)</p>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Cột 3: Khám phá */}
            <div>
                <h4 className="text-lg font-bold text-white mb-6 font-serif">Khám Phá</h4>
                <ul className="space-y-3 text-sm">
                    <li>
                        <Link to="/gioi-thieu" className="text-gray-400 hover:text-amber-500 hover:pl-2 transition-all duration-300 block">
                            Câu chuyện thương hiệu
                        </Link>
                    </li>
                    <li>
                        <Link to="/thuc-don" className="text-gray-400 hover:text-amber-500 hover:pl-2 transition-all duration-300 block">
                            Thực đơn theo mùa
                        </Link>
                    </li>
                    <li>
                        <Link to="/dat-ban" className="text-gray-400 hover:text-amber-500 hover:pl-2 transition-all duration-300 block">
                            Đặt bàn trực tuyến
                        </Link>
                    </li>
                    <li>
                        <Link to="/tuyen-dung" className="text-gray-400 hover:text-amber-500 hover:pl-2 transition-all duration-300 block">
                            Tuyển dụng nhân tài
                        </Link>
                    </li>
                    <li>
                        <Link to="/chinh-sach" className="text-gray-400 hover:text-amber-500 hover:pl-2 transition-all duration-300 block">
                            Chính sách bảo mật
                        </Link>
                    </li>
                </ul>
            </div>
            
            {/* Cột 4: Newsletter */}
            <div>
                <h4 className="text-lg font-bold text-white mb-6 font-serif">Bản Tin Ẩm Thực</h4>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    Đăng ký để nhận ưu đãi đặc biệt và thông báo về các sự kiện thử nếm rượu vang độc quyền.
                </p>
                <form className="flex flex-col space-y-3">
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Email của bạn..."
                            className="w-full p-3 pl-4 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-500"
                        />
                    </div>
                    <button
                        type="button"
                        className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-gray-900 font-bold rounded-lg hover:to-amber-400 transition-all duration-300 shadow-lg shadow-amber-900/20 transform hover:-translate-y-1"
                    >
                        ĐĂNG KÝ NGAY
                    </button>
                </form>
            </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} L'ESSENCE Restaurant. Bảo lưu mọi quyền.</p>
            <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
                <a href="#" className="hover:text-white transition-colors">Chính sách cookie</a>
                <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;