import React from 'react';
import { Plus } from 'lucide-react'; 
import { useCart } from '../context/CartContext'; 

const DishCard = ({ item }) => {
    // 💡 SỬA LỖI: Thêm kiểm tra an toàn (Safeguard Check)
    // Nếu 'item' là undefined (xảy ra trong lúc fetch data hoặc lọc), không render gì cả.
    if (!item) {
        return null; 
    }
    
    // Lấy hàm và helper từ Context (formatCurrency được truyền qua value của Context)
    const { addToCart, formatCurrency } = useCart(); 

    // ✅ Sử dụng Optional Chaining hoặc Fallback để đảm bảo item.imageURL là string
    const imageSource = item.imageURL || 'https://placehold.co/300x200/1f2937/d1d5db?text=Food';

    return (
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col hover:shadow-amber-500/30 transition duration-300 transform hover:scale-[1.01]">
            <img 
                // Sử dụng imageSource đã được kiểm tra/fallback
                src={imageSource} 
                alt={item.name} 
                className="w-full h-40 object-cover rounded-lg mb-3"
                // Giữ nguyên onError cho trường hợp URL bị lỗi 404
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/1f2937/d1d5db?text=Food'; }}
            />
            
            <h3 className="text-xl font-bold font-serif text-amber-500 mb-1">{item.name}</h3>
            <p className="text-sm text-gray-400 flex-grow mb-3 min-h-[40px]">{item.description}</p>
            
            <div className="mt-auto pt-3 border-t border-gray-700 flex items-center justify-between">
                <p className="text-xl font-extrabold text-white">{formatCurrency(item.price)}</p>
                
                <button
                    onClick={() => addToCart(item)}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-amber-700 transition duration-200 shadow-md shadow-amber-500/30 flex items-center"
                >
                    <Plus className="w-4 h-4 mr-1"/> Đặt Món
                </button>
            </div>
        </div>
    );
};

export default DishCard;