import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, Clock, Users, Phone, Mail, User, FileText, MapPin } from 'lucide-react';

const ReservationPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    date: '', time: '', guests: 2, note: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- SỬA ĐỔI LOGIC GỬI DỮ LIỆU ---
    // Backend cần nhận riêng lẻ: date (YYYY-MM-DD) và time (HH:MM)
    // Không cần gộp thành reservationDateTime ở đây nữa vì Backend sẽ tự làm.
    
    if (!formData.date || !formData.time) {
       toast.error('Vui lòng chọn đầy đủ Ngày và Giờ đặt bàn.');
       setLoading(false);
       return;
    }

    // Chuẩn hóa dữ liệu trước khi gửi (đảm bảo gửi đúng date, time riêng biệt)
    const payload = {
        ...formData,
        // Đảm bảo gửi guests là số (Backend cần số)
        guests: Number(formData.guests)
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      
      // Gửi trực tiếp payload chứa date và time
      const res = await axios.post(`${API_URL}/reservations`, payload);
      
      if (res.status === 201 || res.status === 200) {
        toast.success('🎉 Gửi yêu cầu thành công! Nhà hàng sẽ liên hệ xác nhận sớm.');
        // Reset form
        setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: 2, note: '' });
      }
    } catch (error) {
      console.error("Lỗi gửi đặt bàn:", error);
      // Hiển thị lỗi chi tiết từ Backend trả về
      const serverMessage = error.response?.data?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.';
      toast.error(`Lỗi: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-20 bg-gray-900 min-h-screen text-white font-sans relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={4000} theme="dark" />
      
      {/* Họa tiết nền chìm */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #fbbf24 1px, transparent 0)", backgroundSize: "40px 40px" }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
            <h3 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm mb-3">Liên Hệ & Đặt Chỗ</h3>
            <h1 className="text-4xl md:text-6xl font-bold font-serif text-white mb-4">
                Đặt Bàn <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200">Trực Tuyến</span>
            </h1>
            <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                Để đảm bảo trải nghiệm phục vụ tốt nhất, quý khách vui lòng đặt bàn trước ít nhất 2 giờ.
            </p>
        </div>

        <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col lg:flex-row animate-fade-in-up delay-100">
            
            {/* CỘT TRÁI: THÔNG TIN & HÌNH ẢNH */}
            <div className="lg:w-2/5 relative">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                    alt="Dining Room" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 p-10 flex flex-col justify-between bg-gradient-to-t from-gray-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-gray-900/50 lg:to-gray-900/90">
                    <div>
                        <h3 className="text-3xl font-serif font-bold text-white mb-2">L'ESSENCE</h3>
                        <p className="text-amber-400 text-sm uppercase tracking-widest">Fine Dining Restaurant</p>
                    </div>
                    
                    <div className="space-y-6 mt-10 lg:mt-0">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Hotline</p>
                                <p className="text-lg font-bold text-white">0909.123.456</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Địa chỉ</p>
                                <p className="text-sm text-gray-300">123 Đường ABC, Quận 1, TP.HCM</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                                <p className="text-sm text-gray-300">booking@lessence.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CỘT PHẢI: FORM ĐẶT BÀN */}
            <div className="lg:w-3/5 p-8 lg:p-12 bg-gray-800">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 border-b border-gray-700 pb-4">
                    <span className="text-amber-500">✦</span> Thông Tin Đặt Bàn
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nhóm 1: Thông tin cá nhân */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Họ và Tên *</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                <input 
                                    required type="text" name="name" 
                                    value={formData.name} onChange={handleChange} 
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                                    placeholder="VD: Nguyễn Văn A"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Số điện thoại *</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                <input 
                                    required type="tel" name="phone" 
                                    value={formData.phone} onChange={handleChange} 
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                                    placeholder="090xxxxxxx"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Email (Nhận xác nhận)</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                            <input 
                                required type="email" name="email" 
                                value={formData.email} onChange={handleChange} 
                                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                                placeholder="email@example.com"
                            />
                        </div>
                    </div>

                    {/* Nhóm 2: Thời gian & Số lượng */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Ngày *</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                <input 
                                    required type="date" name="date" 
                                    value={formData.date} onChange={handleChange} 
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Giờ *</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                <input 
                                    required type="time" name="time" 
                                    value={formData.time} onChange={handleChange} 
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Số khách *</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                <input 
                                    required type="number" min="1" max="20" name="guests" 
                                    value={formData.guests} onChange={handleChange} 
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nhóm 3: Ghi chú */}
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Ghi chú thêm</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-3.5 text-gray-500" size={18} />
                            <textarea 
                                name="note" rows="3" 
                                value={formData.note} onChange={handleChange} 
                                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-none"
                                placeholder="VD: Tôi bị dị ứng hạt, cần ghế trẻ em..."
                            ></textarea>
                        </div>
                    </div>

                    <button 
                        disabled={loading} 
                        type="submit" 
                        className={`w-full py-4 text-black font-bold text-lg rounded-xl shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2
                        ${loading 
                            ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                            : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:to-amber-300 hover:scale-[1.02] shadow-amber-500/20'}`}
                    >
                        {loading ? 'Đang Xử Lý...' : 'XÁC NHẬN ĐẶT BÀN'}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;