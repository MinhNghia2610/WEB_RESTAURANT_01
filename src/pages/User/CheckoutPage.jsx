// src/pages/User/CheckoutPage.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import { Navigate } from 'react-router-dom';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import CartView from '../../components/checkout/CartView';

const CheckoutPage = () => {
  const { cartItems, totalPrice } = useCart();

  // Bảo vệ: Nếu giỏ hàng trống, ném về trang đặt món
  if (cartItems.length === 0) {
    return <Navigate to="/dat-mon-online" replace />;
  }

  return (
    <div className="pt-28 pb-20 bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-white">
            Thanh Toán Đơn Hàng
          </h1>
          <p className="text-gray-400 mt-2 text-lg max-w-xl mx-auto">
            Vui lòng kiểm tra lại đơn hàng và cung cấp thông tin nhận hàng.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* CỘT 1: FORM THÔNG TIN */}
          <main className="w-full lg:w-2/3 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-3xl font-bold font-serif text-amber-500 mb-6 pb-2 border-b-2 border-amber-500/30">
              Thông tin Khách hàng
            </h2>
            
            {/* 2. ĐẶT CHECKOUTFORM VÀO ĐÂY */}
            <CheckoutForm />

          </main>

          {/* CỘT 2: TÓM TẮT GIỎ HÀNG */}
          <aside className="w-full lg:w-1/3">
            <div className="sticky top-28 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
              <h2 className="text-3xl font-bold font-serif text-amber-500 mb-6 pb-2 border-b-2 border-amber-500/30">
                Tóm tắt Đơn hàng
              </h2>

              {/* 3. ĐẶT CARTVIEW VÀO ĐÂY */}
              <CartView />

              {/* Hiển thị tổng tiền */}
              <div className="mt-6 pt-6 border-t border-gray-600">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-300">Tổng cộng:</span>
                  <span className="text-3xl font-bold text-red-500">
                    {totalPrice.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;