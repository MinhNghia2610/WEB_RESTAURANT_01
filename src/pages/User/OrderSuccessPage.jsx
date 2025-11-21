import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Home } from 'lucide-react';
import { useCart } from '../../context/CartContext'; 

const OrderSuccessPage = () => {
  const { clearCart } = useCart();
    // Lấy tham số VNPAY từ URL
    const [searchParams] = useSearchParams();
    
    // Khai báo lại các State cần thiết
    const [statusText, setStatusText] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(true); 

    // Tham số VNPAY từ URL
    const vnpayResult = searchParams.get('vnpay'); // 'success' hoặc 'failure'
    const orderId = searchParams.get('orderId');   // ID đơn hàng
    const errorCode = searchParams.get('code');    // Mã lỗi VNPAY nếu thất bại

  useEffect(() => {
        // Luôn clear cart sau khi order thành công/thất bại để reset giỏ hàng
    const timer = setTimeout(() => {
      clearCart();
    }, 10); 
    
    if (vnpayResult) {
        // --- Xử lý kết quả từ VNPAY ---
        if (vnpayResult === 'success') {
            setIsSuccess(true);
            setStatusText('Thanh toán VNPAY Thành công 🎉');
            setMessage(`Đơn hàng #${orderId} của bạn đã được thanh toán thành công. Cảm ơn bạn.`);
        } else if (vnpayResult === 'failure') {
            // Trường hợp VNPAY thất bại (Backend thường redirect về /checkout, nhưng xử lý ở đây nếu cần)
            setIsSuccess(false);
            setStatusText('Thanh toán VNPAY Thất bại 😔');
            
            let errorDetail = '';
            if (errorCode === '97') {
                 errorDetail = 'Lỗi bảo mật. Dữ liệu không hợp lệ.';
            } else if (errorCode) {
                 errorDetail = `Mã lỗi: ${errorCode}. Giao dịch không thành công.`;
            } else {
                 errorDetail = 'Có lỗi xảy ra trong quá trình thanh toán.';
            }
            
            setMessage(`Giao dịch VNPAY thất bại. ${errorDetail} Vui lòng thử lại.`);
        }
    } else {
        // --- Xử lý kết quả Đặt hàng COD/Banking (Luồng cũ) ---
        setIsSuccess(true);
        setStatusText('Đặt hàng Thành công ✅');
        setMessage('Cảm ơn bạn đã tin tưởng L\'Essence. Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ liên hệ để xác nhận.');
    }


    return () => clearTimeout(timer);
    
  }, [clearCart, vnpayResult, orderId, errorCode]); 
    

    const renderContent = () => (
        <div className={`max-w-md w-full text-center bg-gray-800 p-10 rounded-xl shadow-lg 
                       ${isSuccess ? 'border border-gray-700' : 'border-t-4 border-red-500'}`}>
            
            {isSuccess ? 
                <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-6" /> :
                <XCircle className="text-red-500 w-24 h-24 mx-auto mb-6" />
            }
            
            <h1 className="text-4xl font-extrabold font-serif text-white mb-4">
                {statusText || 'Đang tải...'}
            </h1>
            
            <p className="text-gray-300 text-lg mb-8">
                {message}
            </p>
            
            {/* Hiển thị Order ID nếu có */}
            {(isSuccess && orderId) && (
                <p className="text-lg font-semibold text-gray-300 border-t border-b border-gray-700 py-3 my-4">
                    Mã đơn hàng: <span className="text-amber-400 font-extrabold">{orderId}</span>
                </p>
            )}

            {/* Các nút */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/dat-mon-online"
                    className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-bold 
                                hover:bg-amber-700 transition-colors"
                >
                    Tiếp tục Đặt món
                </Link>
                {isSuccess ? (
                    <Link
                        to="/"
                        className="w-full bg-gray-700 text-gray-200 py-3 px-6 rounded-lg font-bold 
                                    hover:bg-gray-600 transition-colors"
                    >
                        Về Trang chủ
                    </Link>
                ) : (
                    <Link
                        to="/checkout"
                        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-bold 
                                    hover:bg-red-700 transition-colors inline-flex items-center justify-center gap-2"
                    >
                        <Home size={20}/> Thử lại Thanh toán
                    </Link>
                )}
            </div>
            
            <Link to="/lich-su-don-hang" className="text-amber-500 hover:underline mt-6 block">
                Xem lịch sử đơn hàng
            </Link>
        </div>
    );


  return (
    <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white flex items-center justify-center">
      {renderContent()}
    </div>
  );
};

export default OrderSuccessPage;