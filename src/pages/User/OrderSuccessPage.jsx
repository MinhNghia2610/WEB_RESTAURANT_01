// src/pages/User/OrderSuccessPage.jsx (SỬA LỖI LẦN CUỐI - DÙNG setTimeout)
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext'; 

const OrderSuccessPage = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // ==========================================================
    // ⭐️ SỬA LỖI:
    // Chúng ta sẽ xóa giỏ hàng ngay khi trang tải,
    // nhưng bọc nó trong setTimeout(..., 10).
    // Việc này đẩy clearCart() sang chu kỳ "event loop" tiếp theo.
    // Nó cho phép React hoàn tất việc render và gắn sự kiện
    // cho các nút <Link> TRƯỚC KHI giỏ hàng bị xóa.
    // ==========================================================
    
    const timer = setTimeout(() => {
      clearCart();
    }, 10); // 10ms là đủ

    // Dọn dẹp timer (phòng trường hợp component bị hủy sớm)
    return () => clearTimeout(timer);
    
  }, [clearCart]); // Chỉ chạy 1 lần khi trang tải

  return (
    <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white flex items-center justify-center">
      <div className="max-w-md w-full text-center bg-gray-800 p-10 rounded-xl shadow-lg border border-gray-700">
        
        <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-6" />
        
        <h1 className="text-4xl font-extrabold font-serif text-white mb-4">
          Đặt hàng Thành công!
        </h1>
        
        <p className="text-gray-300 text-lg mb-8">
          Cảm ơn bạn đã tin tưởng L'Essence. Đơn hàng của bạn đang được xử lý.
          Chúng tôi sẽ liên hệ với bạn sớm nhất.
        </p>
        
        {/* Các nút này bây giờ sẽ hoạt động */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dat-mon-online"
            className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-bold 
                       hover:bg-amber-700 transition-colors"
          >
            Tiếp tục Đặt món
          </Link>
          <Link
            to="/"
            className="w-full bg-gray-700 text-gray-200 py-3 px-6 rounded-lg font-bold 
                       hover:bg-gray-600 transition-colors"
          >
            Về Trang chủ
          </Link>
        </div>
        
        <Link to="/lich-su-don-hang" className="text-amber-500 hover:underline mt-6 block">
          Xem lịch sử đơn hàng
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;