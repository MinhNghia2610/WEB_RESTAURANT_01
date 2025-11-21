import React, { useState } from 'react';
import { useCart } from '../../context/CartContext'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Truck, QrCode, CheckCircle } from 'lucide-react';

const CheckoutForm = () => {
  // Lấy dữ liệu từ Context
  const { cartItems, totalPrice, clearCart } = useCart();
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    note: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Cấu hình tài khoản nhận tiền (Dùng cho Banking thủ công)
  const MY_BANK = {
    BANK_ID: 'MB', 
    ACCOUNT_NO: '0000123456789', 
    TEMPLATE: 'compact2', 
    ACCOUNT_NAME: 'L ESSENCE RESTAURANT'
  };
  
  // URL QR Code
  const QR_URL = `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-${MY_BANK.TEMPLATE}.png?amount=${totalPrice}&addInfo=THANH TOAN DON HANG&accountName=${MY_BANK.ACCOUNT_NAME}`;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error("Giỏ hàng trống!");

    // Nếu là Banking, hiển thị modal QR code
    if (paymentMethod === 'Banking') {
        setShowQRModal(true);
        return;
    }
    // Nếu là COD hoặc VNPAY, gọi hàm xử lý ngay
    submitOrderToBackend(false);
  };

  // --- HÀM XỬ LÝ ĐẶT HÀNG / THANH TOÁN ---
  const submitOrderToBackend = async (isPaid = false) => {
    setLoading(true);

    // 1. Lấy token và cấu hình Header
    const token = localStorage.getItem("token"); 
    if (!token) {
        toast.error("Vui lòng đăng nhập để thực hiện đặt hàng!");
        setLoading(false);
        setShowQRModal(false);
        return;
    }
    const config = {
        headers: {
            Authorization: `Bearer ${token}` // Cú pháp chuẩn
        }
    };
    
    try {
      const orderPayload = {
        customerInfo: formData,
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          dish: item._id
        })),
        totalPrice: totalPrice,
        paymentMethod: paymentMethod, // Quan trọng: sẽ là 'VNPAY', 'COD', hoặc 'Banking'
        isPaid: isPaid
      };

      // >>> ĐÃ SỬA LỖI: CHUỖI CỨNG THAY THẾ BIẾN MÔI TRƯỜNG LỖI
      const API_URL = 'http://localhost:5000/api';

      if (paymentMethod === 'VNPAY') {
          // LUỒNG VNPAY: Gọi API tạo URL
          const res = await axios.post(`${API_URL}/orders/create_payment_url`, orderPayload, config);
          
          if (res.data.paymentUrl) {
              // Chuyển hướng người dùng sang VNPAY
              window.location.href = res.data.paymentUrl;
              return; // Ngăn không cho chạy setLoading(false)
          } else {
              throw new Error("Không nhận được URL thanh toán từ server.");
          }

      } else {
          // LUỒNG COD / BANKING (Thủ công): Gọi API tạo đơn hàng thông thường
          const res = await axios.post(`${API_URL}/orders`, orderPayload, config);

          if (res.data.success) {
              clearCart();
              navigate('/dat-hang-thanh-cong');
          }
      }
    } catch (error) {
      console.error("Order/Payment Error:", error.response || error);
      // Khi VNPAY bị lỗi, server sẽ trả về lỗi 500 kèm thông báo
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi đặt hàng";
      toast.error('Lỗi: ' + errorMessage);
    }
    
    setLoading(false);
    setShowQRModal(false); 
  };

  return (
    <>
      <form onSubmit={handlePlaceOrder} className="space-y-5 text-gray-300">
        {/* Input Fields (Giữ nguyên) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Họ tên *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} 
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-amber-500 outline-none placeholder-gray-500" placeholder="Nguyễn Văn A" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Số điện thoại *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} 
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-amber-500 outline-none placeholder-gray-500" placeholder="09xxxxxxxx" />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-amber-500 outline-none placeholder-gray-500" placeholder="email@example.com" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Địa chỉ nhận hàng *</label>
            <input required type="text" name="address" value={formData.address} onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-amber-500 outline-none placeholder-gray-500" placeholder="Số nhà, đường, phường..." />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Ghi chú</label>
            <textarea name="note" rows="2" value={formData.note} onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-amber-500 outline-none placeholder-gray-500" placeholder="Lời nhắn cho nhà hàng..."></textarea>
        </div>

        {/* Payment Methods */}
        <div className="pt-4">
            <h3 className="text-lg font-bold text-white mb-4">Phương thức thanh toán</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. COD */}
                <div onClick={() => setPaymentMethod('COD')}
                     className={`cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all
                     ${paymentMethod === 'COD' ? 'border-amber-500 bg-amber-500/10' : 'border-gray-600 hover:border-gray-500'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-amber-500' : 'border-gray-400'}`}>
                        {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>}
                    </div>
                    <Truck className="text-gray-400" />
                    <div>
                        <p className="font-bold text-sm text-white">Tiền mặt (COD)</p>
                        <p className="text-xs text-gray-400">Thanh toán khi nhận hàng</p>
                    </div>
                </div>

                {/* 2. Banking (Manual QR) */}
                <div onClick={() => setPaymentMethod('Banking')}
                     className={`cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all
                     ${paymentMethod === 'Banking' ? 'border-amber-500 bg-amber-500/10' : 'border-gray-600 hover:border-gray-500'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Banking' ? 'border-amber-500' : 'border-gray-400'}`}>
                        {paymentMethod === 'Banking' && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>}
                    </div>
                    <QrCode className="text-blue-400" />
                    <div>
                        <p className="font-bold text-sm text-white">Chuyển khoản</p>
                        <p className="text-xs text-gray-400">Quét mã VietQR thủ công</p>
                    </div>
                </div>
                
                {/* 3. VNPAY (Automatic) */}
                <div onClick={() => setPaymentMethod('VNPAY')}
                     className={`cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all
                     ${paymentMethod === 'VNPAY' ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-gray-500'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'VNPAY' ? 'border-green-500' : 'border-gray-400'}`}>
                        {paymentMethod === 'VNPAY' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>}
                    </div>
                    <img src="https://vnpay.vn/assets/img/logo-vnpay.svg" alt="VNPAY" className="w-6 h-6 object-contain"/> 
                    <div>
                        <p className="font-bold text-sm text-white">Thanh toán VNPAY</p>
                        <p className="text-xs text-gray-400">Thanh toán tự động</p>
                    </div>
                </div>

            </div>
        </div>

        <button type="submit" disabled={loading}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all text-white
                ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500 hover:-translate-y-1 shadow-amber-500/30'}`}>
            {loading ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT HÀNG'}
        </button>
      </form>

      {/* Modal QR Code (Giữ nguyên) */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative animate-fade-in-down">
                <button onClick={() => setShowQRModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">✕</button>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-blue-700 mb-2">Thanh Toán VietQR</h3>
                    <p className="text-gray-500 text-xs mb-4">Mở App ngân hàng để quét mã</p>
                    <div className="bg-gray-100 p-3 rounded-lg inline-block mb-4 border border-blue-200">
                        <img src={QR_URL} alt="VietQR" className="w-48 h-48 object-contain" />
                    </div>
                    <div className="text-left bg-blue-50 p-3 rounded mb-4 text-sm">
                        <p className="text-gray-500 text-xs">Ngân hàng: <span className="font-bold text-gray-800">{MY_BANK.BANK_ID}</span></p>
                        <p className="text-gray-500 text-xs mt-1">Số tiền: <span className="font-bold text-red-600">{totalPrice.toLocaleString('vi-VN')}đ</span></p>
                    </div>
                    <button onClick={() => submitOrderToBackend(true)} disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                        {loading ? 'Đang xử lý...' : <><CheckCircle size={18}/> TÔI ĐÃ CHUYỂN KHOẢN</>}
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default CheckoutForm;