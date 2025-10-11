import React from 'react';
// Đã sửa: Thêm đuôi /thêm từ khóa 'icons' hoặc điều chỉnh theo cấu trúc lucide-react mới nhất
// Sử dụng cú pháp import chung:
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react'; 
import { Link } from 'react-router-dom'; // <--- Thêm Link để tối ưu hóa cho SPA

const Footer = () => {
    // Lưu ý: Tôi đã đổi icon FacebookSquare thành Facebook cho phù hợp với gói Lucide thông dụng hơn.
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8 font-sans">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-gray-700 pb-10">
                    
                    {/* Cột 1: Logo và Thông tin liên hệ */}
                    <div className="space-y-4">
                        <h3 className="text-4xl font-extrabold font-serif text-amber-500 tracking-widest">L'ESSENCE</h3>
                        <p className="text-gray-400 text-sm italic">
                            Nghệ thuật ẩm thực Pháp Dưỡng Sinh.
                        </p>
                        <div className="space-y-2 text-sm">
                            <p><strong>Địa chỉ:</strong> Tầng 2, Tòa nhà Luxury, 888 Đường Nguyễn Huệ, Quận 1, TP. HCM</p>
                            <p><strong>Điện thoại:</strong> +84 28 9876 5432</p>
                            <p><strong>Email:</strong> reservation@lessence.vn</p>
                            <p><strong>Giờ mở cửa:</strong> 18:00 - 23:00 (Thứ Ba - Chủ Nhật)</p>
                        </div>
                    </div>

                    {/* Cột 2: Liên kết Nhanh (Đã chuyển sang Link) */}
                    <div>
                        <h4 className="text-xl font-semibold mb-6 text-white border-b-2 border-amber-500 inline-block pb-1">
                            Trải Nghiệm
                        </h4>
                        <ul className="space-y-3 text-sm">
                            {/* Liên kết internal (dùng Link) */}
                            <li><Link to="/" className="text-gray-400 hover:text-amber-400 transition duration-200">Trang Chủ</Link></li>
                            <li><Link to="/ve-chung-toi" className="text-gray-400 hover:text-amber-400 transition duration-200">Triết Lý L'ESSENCE</Link></li>
                            <li><Link to="/thuc-don" className="text-gray-400 hover:text-amber-400 transition duration-200">Thực Đơn Đầy Đủ</Link></li>
                            <li><Link to="/dat-ban" className="text-gray-400 hover:text-amber-400 transition duration-200">Đặt Bàn Ngay</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3: Chính sách & Hỗ trợ (Đã chuyển sang Link) */}
                    <div>
                        <h4 className="text-xl font-semibold mb-6 text-white border-b-2 border-amber-500 inline-block pb-1">
                            Pháp Lý & Hỗ Trợ
                        </h4>
                        <ul className="space-y-3 text-sm">
                            {/* Liên kết internal (dùng Link) */}
                            <li><Link to="/chinh-sach/bao-mat" className="text-gray-400 hover:text-amber-400 transition duration-200">Chính sách bảo mật</Link></li>
                            <li><Link to="/dieu-khoan" className="text-gray-400 hover:text-amber-400 transition duration-200">Điều khoản dịch vụ</Link></li>
                            <li><Link to="/ho-tro/dat-ban" className="text-gray-400 hover:text-amber-400 transition duration-200">Hướng dẫn đặt bàn</Link></li>
                            <li><Link to="/tuyen-dung" className="text-gray-400 hover:text-amber-400 transition duration-200">Tuyển dụng</Link></li>
                        </ul>
                    </div>
                    
                    {/* Cột 4: Mạng xã hội & Newsletter */}
                    <div>
                        <h4 className="text-xl font-semibold mb-6 text-white border-b-2 border-amber-500 inline-block pb-1">
                            Nhận Thư Mời
                        </h4>
                        {/* Form đăng ký Newsletter */}
                        <p className="text-sm text-gray-400 mb-4">
                            Đăng ký để nhận thông tin về Menu Mùa mới và các sự kiện độc quyền.
                        </p>
                        <form className="flex flex-col space-y-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="w-full p-3 pl-10 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-amber-600 text-gray-900 font-bold rounded-lg hover:bg-amber-700 transition duration-300 shadow-lg"
                            >
                                ĐĂNG KÝ
                            </button>
                        </form>

                        {/* Mạng xã hội (Liên kết ngoại nên vẫn dùng thẻ <a>) */}
                        <div className="flex space-x-4 mt-6">
                            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-amber-500 transition duration-200">
                                <Facebook className="w-7 h-7" />
                            </a>
                            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-amber-500 transition duration-200">
                                <Instagram className="w-7 h-7" />
                            </a>
                            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-amber-500 transition duration-200">
                                <Twitter className="w-7 h-7" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bản quyền */}
                <div className="text-center pt-8 text-gray-500 text-sm">
                    © {new Date().getFullYear()} L'ESSENCE. Bảo lưu mọi quyền. | Thiết kế & Phát triển bởi L'ESSENCE Studio.
                </div>
            </div>
        </footer>
    );
};
export default Footer;
