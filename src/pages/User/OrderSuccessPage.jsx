import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Home } from 'lucide-react';
import { useCart } from '../../context/CartContext'; 

const OrderSuccessPage = () => {
  const { clearCart } = useCart();
  // Lấy tham số từ URL
  const [searchParams] = useSearchParams();
  
  // State hiển thị
  const [statusText, setStatusText] = useState('Đang xử lý...');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true); 

  // Lấy giá trị từ URL
  const vnpayResult = searchParams.get('vnpay'); // 'success' hoặc 'failure'
  const orderId = searchParams.get('orderId');   // ID đơn hàng
  const errorCode = searchParams.get('code');    // Mã lỗi

  useEffect(() => {
    // 1. LOGIC XÓA GIỎ HÀNG
    // Chỉ xóa khi thành công (vnpay=success) hoặc là đơn COD (không có param vnpay)
    let timer;
    if (vnpayResult === 'success' || !vnpayResult) {
        timer = setTimeout(() => {
             clearCart();
        }, 100);
    }

    // 2. LOGIC HIỂN THỊ THÔNG BÁO
    if (vnpayResult) {
        // --- Trường hợp thanh toán VNPAY ---
        if (vnpayResult === 'success') {
            setIsSuccess(true);
            setStatusText('Thanh toán VNPAY Thành công 🎉');
            setMessage(`Đơn hàng #${orderId || 'mới'} của bạn đã được thanh toán thành công.`);
        } else {
            // --- Trường hợp Thất bại ---
            setIsSuccess(false);
            setStatusText('Thanh toán VNPAY Thất bại 😔');
            
            let errorDetail = '';
            if (errorCode === '97') errorDetail = 'Chữ ký bảo mật không hợp lệ.';
            else if (errorCode === '24') errorDetail = 'Bạn đã hủy giao dịch.';
            else if (errorCode) errorDetail = `Mã lỗi: ${errorCode}`;
            else errorDetail = 'Lỗi không xác định.';
            
            setMessage(`Giao dịch thất bại. ${errorDetail} Vui lòng thử lại.`);
        }
    } else {
        // --- Trường hợp COD (Tiền mặt) ---
        setIsSuccess(true);
        setStatusText('Đặt hàng Thành công ✅');
        setMessage('Cảm ơn bạn đã tin tưởng. Đơn hàng của bạn đang được xử lý.');
    }

    // Cleanup function
    return () => {
        if (timer) clearTimeout(timer);
    };
    
  }, [clearCart, vnpayResult, orderId, errorCode]); // Dependency array

  // --- PHẦN GIAO DIỆN (RENDER) ---
  const renderContent = () => (
    <div className={`max-w-md w-full text-center bg-gray-800 p-10 rounded-xl shadow-lg 
                    ${isSuccess ? 'border border-gray-700' : 'border-t-4 border-red-500'}`}>
        
        {isSuccess ? 
            <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-6" /> :
            <XCircle className="text-red-500 w-24 h-24 mx-auto mb-6" />
        }
        
        <h1 className="text-3xl font-bold text-white mb-4">
            {statusText}
        </h1>
        
        <p className="text-gray-300 text-lg mb-8">
            {message}
        </p>
        
        {/* Hiển thị Order ID nếu thành công */}
        {(isSuccess && orderId) && (
            <p className="text-lg font-semibold text-gray-300 border-t border-b border-gray-700 py-3 my-4">
                Mã đơn hàng: <span className="text-amber-400 font-extrabold">{orderId}</span>
            </p>
        )}

        {/* Các nút điều hướng */}
        <div className="flex flex-col gap-3 justify-center">
            {isSuccess ? (
                <>
                    <Link to="/lich-su-don-hang" className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700 transition">
                        Xem đơn hàng của tôi
                    </Link>
                    <Link to="/" className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition">
                        Về Trang chủ
                    </Link>
                </>
            ) : (
                <Link to="/checkout" className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center gap-2">
                    <Home size={20}/> Thử lại Thanh toán
                </Link>
            )}
        </div>
    </div>
  );

  return (
    <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white flex items-center justify-center px-4">
      {renderContent()}
    </div>
  );
};

export default OrderSuccessPage;