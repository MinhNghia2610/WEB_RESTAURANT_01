import React from 'react';
// Đã thay thế icon bằng lucide-react để đồng bộ với các component khác nếu cần,
// nhưng giữ nguyên @heroicons/react/24/outline theo yêu cầu gốc vì đây là thư viện chuẩn.
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
// Giả định: CartContext tồn tại trong thư mục cha (cần được định nghĩa)
// import { useCart } from '../context/CartContext'; 
// Vì đang ở chế độ 1 file, ta phải giả lập context/hook:
const useCart = () => ({
    cartItems: [
        { id: 1, name: 'Bò Wagyu Áp Chảo', price: 1800000, quantity: 2, image: 'https://placehold.co/80x80/E5E7EB/6B7280?text=Wagyu' },
        { id: 2, name: 'Súp Tôm Hùm Truffle', price: 950000, quantity: 1, image: 'https://placehold.co/80x80/E5E7EB/6B7280?text=Soup' },
    ],
    subtotal: 4550000, // 1800000*2 + 950000*1
    totalItems: 3,
    updateItemQuantity: (id, quantity) => { console.log(`Cập nhật item ${id}, số lượng ${quantity}`); },
    removeItemFromCart: (id) => { console.log(`Xóa item ${id}`); },
});


const formatCurrency = (amount) => amount.toLocaleString('vi-VN');

// CartSidebar nhận state đóng/mở và hàm đóng từ Navbar
const CartSidebar = ({ isCartOpen, setIsCartOpen }) => {
    // Lấy dữ liệu và hàm từ CartContext
    const { cartItems, subtotal, totalItems, updateItemQuantity, removeItemFromCart } = useCart();

    const handleClose = () => setIsCartOpen(false);

    // Xử lý khi CartSidebar chưa được render cùng App.jsx (tránh lỗi undefined)
    // Giả sử component cha sẽ truyền isCartOpen và setIsCartOpen
    if (!isCartOpen) {
        return null;
    }

    return (
        <div 
            className={`fixed inset-0 z-50 transition-opacity duration-500 
                ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`
            }
        >
            {/* Lớp phủ làm mờ nền */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50" 
                onClick={handleClose}
            ></div>

            {/* Thanh Sidebar chính */}
            <div className={`fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl transition-transform duration-500 transform 
                ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`
            }>
                
                {/* Header Giỏ Hàng */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 font-serif">Giỏ Hàng ({totalItems})</h2>
                    <button 
                        onClick={handleClose} 
                        // Đồng bộ màu hover với theme Amber
                        className="text-gray-500 hover:text-amber-600 transition"
                    >
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                {/* Nội dung Giỏ Hàng */}
                <div className="p-4 overflow-y-auto h-[calc(100vh-170px)] space-y-4">
                    {cartItems.length === 0 ? (
                        <p className="text-center text-gray-500 mt-12">Giỏ hàng của bạn đang trống.</p>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex items-center border-b pb-4 last:border-b-0">
                                <img 
                                    src={item.image || 'https://placehold.co/80x80/E5E7EB/6B7280?text=Food'} 
                                    alt={item.name} 
                                    className="w-20 h-20 object-cover rounded-lg mr-4 border border-gray-200"
                                />
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                    {/* Đồng bộ màu giá tiền với theme Amber */}
                                    <p className="text-sm text-amber-600 font-bold">{formatCurrency(item.price)} VNĐ</p>
                                </div>
                                
                                {/* Điều chỉnh số lượng */}
                                <div className="flex items-center space-x-2 mr-4">
                                    <button 
                                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                        className="p-1 border rounded-full hover:bg-gray-200 disabled:opacity-50 transition"
                                        disabled={item.quantity <= 1}
                                    >-</button>
                                    <span className="font-medium w-4 text-center">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                        className="p-1 border rounded-full hover:bg-gray-200 transition"
                                    >+</button>
                                </div>

                                {/* Xóa item */}
                                <button 
                                    onClick={() => removeItemFromCart(item.id)}
                                    // Đồng bộ màu icon xóa với theme Amber
                                    className="p-1 text-amber-500 hover:text-amber-700 transition"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Giỏ Hàng (Tổng tiền và Checkout) */}
                <div className="absolute bottom-0 w-full p-4 border-t-2 border-amber-500 bg-white">
                    <div className="flex justify-between font-bold text-xl mb-4">
                        <span className="text-gray-900">Tổng Cộng:</span>
                        {/* Đồng bộ màu tổng tiền với theme Amber */}
                        <span className="text-amber-600">{formatCurrency(subtotal)} VNĐ</span>
                    </div>
                    <button 
                        // Đồng bộ màu nút checkout với theme Amber
                        className="w-full py-3 bg-amber-600 text-gray-900 font-bold rounded-lg shadow-lg 
                                   hover:bg-amber-700 transition duration-300 transform 
                                   active:scale-[0.98] active:shadow-md 
                                   disabled:bg-gray-300 disabled:text-gray-600 disabled:shadow-none"
                        disabled={cartItems.length === 0}
                    >
                        TIẾN HÀNH ĐẶT MÓN
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;
