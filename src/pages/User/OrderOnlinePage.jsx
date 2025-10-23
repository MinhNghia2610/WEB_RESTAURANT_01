import React, { useState, useEffect, useMemo } from 'react'; 
import { Wine, Coffee, ChefHat, Salad, ShoppingCart, ArrowLeft, Trash2, Plus, Minus, CheckCircle, Clock, Search } from 'lucide-react'; 

// --- 1. DỮ LIỆU GIẢ LẬP VÀ HÀM TIỆN ÍCH ---

// Dữ liệu Mock cho Menu
const MOCK_MENU_DATA = [
    {
        categoryName: "KHAI VỊ (ENTRÉES)",
        items: [
            { _id: 'item1', name: "Súp Nấm Truffle", description: "Kem nấm rừng truffle đen, dầu hạt phỉ.", price: 120000, unit: "VNĐ", imageURL: "https://placehold.co/300x200/27272a/d1d5db?text=Truffle+Soup" },
            { _id: 'item2', name: "Salad Cá Hồi", description: "Cá hồi tươi áp chảo, rau mầm, sốt chanh leo.", price: 180000, unit: "VNĐ", imageURL: "https://placehold.co/300x200/27272a/d1d5db?text=Salmon+Salad" },
        ]
    },
    {
        categoryName: "MÓN CHÍNH (PLATS PRINCIPAUX)",
        items: [
            { _id: 'item3', name: "Thăn Bò Wagyu", description: "Thăn bò Wagyu A5 nướng than, sốt tiêu xanh.", price: 750000, unit: "VNĐ", imageURL: "https://placehold.co/300x200/27272a/d1d5db?text=Wagyu+Steak" },
            { _id: 'item4', name: "Vịt Quay Bắc Kinh (Set)", description: "Vịt quay giòn da, cuốn bánh tráng, nước sốt đặc biệt.", price: 450000, unit: "VNĐ", imageURL: "https://placehold.co/300x200/27272a/d1d5db?text=Peking+Duck" },
        ]
    },
    {
        categoryName: "TRÁNG MIỆNG (DESSERTS)",
        items: [
            { _id: 'item5', name: "Tiramisu Cà Phê", description: "Bánh Tiramisu cổ điển, vị cà phê Espresso đậm đà.", price: 95000, unit: "VNĐ", imageURL: "https://placehold.co/300x200/27272a/d1d5db?text=Tiramisu" },
        ]
    },
];

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => amount.toLocaleString('vi-VN') + ' VNĐ';


// --- 2. COMPONENT: MENU CARD (Thẻ món ăn) ---

const MenuCard = ({ item, onAddToCart }) => (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col hover:shadow-amber-500/30 transition duration-300 transform hover:scale-[1.01]">
        {/* Placeholder image in case URL fails */}
        <img 
            src={item.imageURL} 
            alt={item.name} 
            className="w-full h-40 object-cover rounded-lg mb-3"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/1f2937/d1d5db?text=Food'; }}
        />
        
        <h3 className="text-xl font-bold font-serif text-amber-500 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-400 flex-grow mb-3 min-h-[40px]">{item.description}</p>
        
        <div className="mt-auto pt-3 border-t border-gray-700 flex items-center justify-between">
            <p className="text-xl font-extrabold text-white">{formatCurrency(item.price)}</p>
            
            <button
                onClick={() => onAddToCart(item)}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-amber-700 transition duration-200 shadow-md shadow-amber-500/30 flex items-center"
            >
                <Plus className="w-4 h-4 mr-1"/> Đặt Món
            </button>
        </div>
    </div>
);


// --- 3. MÀN HÌNH 1: MENU VIEW (Trang duyệt Menu) ---

const MenuView = ({ menuData, onAddToCart, totalItems, onGoToCheckout, setActiveCategory, activeCategory }) => {
    
    const [searchTerm, setSearchTerm] = useState(''); // State cho ô tìm kiếm
    
    // Logic LỌC DỮ LIỆU
    const filteredMenuData = useMemo(() => {
        if (!searchTerm) return menuData;

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        
        // Lọc qua từng danh mục
        return menuData.map(category => {
            const filteredItems = category.items.filter(item => 
                item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.description.toLowerCase().includes(lowerCaseSearchTerm)
            );
            
            // Chỉ trả về danh mục nếu có món ăn phù hợp
            return filteredItems.length > 0 ? { ...category, items: filteredItems } : null;
        }).filter(category => category !== null);

    }, [menuData, searchTerm]);
    
    // Sử dụng Intersection Observer để cập nhật danh mục đang xem
    const categoryRefs = React.useRef({}); 
    
    // Hàm cuộn đến danh mục (Chỉ dùng cho Sidebar)
    const scrollToCategory = (categoryName) => {
        const ref = categoryRefs.current[categoryName];
        if (ref) {
            const yOffset = -120;
            const y = ref.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveCategory(categoryName);
        }
    };
    
    // Theo dõi Intersection Observer
    useEffect(() => {
        // Chỉ chạy observer nếu không có từ khóa tìm kiếm (để tránh lỗi cuộn trang khi lọc)
        if (searchTerm) return; 
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveCategory(entry.target.dataset.category);
                    }
                });
            },
            { rootMargin: '-120px 0px -70% 0px', threshold: 0 }
        );

        Object.values(categoryRefs.current).forEach(ref => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => observer.disconnect();
    }, [menuData, setActiveCategory, searchTerm]); 
    
    const handleSetRef = (categoryName) => (el) => {
        categoryRefs.current[categoryName] = el;
    };
    
    const displayMenuData = searchTerm ? filteredMenuData : menuData;


    return (
        <div className="pt-24 pb-20 bg-gray-900 min-h-screen text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <header className="text-center mb-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight font-serif text-amber-500">
                        Thực Đơn Tinh Hoa
                    </h1>
                    <p className="text-gray-400 mt-3 text-lg">Chọn món và thêm vào giỏ hàng của bạn.</p>
                </header>
                
                {/* Search Bar */}
                <div className="mb-10 max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm món ăn, ví dụ: 'Wagyu' hoặc 'Salad cá hồi'..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setActiveCategory(null); // Reset active category khi tìm kiếm
                            }}
                            className="w-full p-4 pl-12 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:ring-amber-500 focus:border-amber-500 transition duration-200 shadow-xl"
                        />
                    </div>
                </div>

                <div className="flex gap-10">
                    
                    {/* SIDEBAR DANH MỤC (Ẩn khi đang tìm kiếm) */}
                    <aside className={`hidden lg:block w-64 flex-shrink-0 ${searchTerm ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="sticky top-28 bg-gray-800 p-6 rounded-xl shadow-lg border border-amber-500/30">
                            <h3 className="text-2xl font-bold font-serif text-white mb-4 border-b border-gray-600 pb-2">Danh Mục</h3>
                            <ul className="space-y-2">
                                {menuData.map((category) => (
                                    <li key={category.categoryName}>
                                        <button
                                            onClick={() => scrollToCategory(category.categoryName)}
                                            className={`
                                                w-full text-left py-2 px-3 rounded-lg transition duration-200
                                                ${activeCategory === category.categoryName ? 'bg-amber-600 text-white font-bold' : 'text-gray-300 hover:bg-gray-700 hover:text-amber-500'}
                                            `}
                                            disabled={!!searchTerm}
                                        >
                                            <span className='font-medium text-lg'>{category.categoryName}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {searchTerm && <p className='mt-4 text-xs text-gray-400'>Danh mục bị khóa khi tìm kiếm.</p>}
                        </div>
                    </aside>

                    {/* NỘI DUNG MENU CHÍNH */}
                    <main className="flex-grow">
                        {displayMenuData.length > 0 ? (
                            <div className="space-y-16">
                                {displayMenuData.map((category) => {
                                    const IconComponent = (title) => {
                                        const t = title ? title.toUpperCase() : '';
                                        if (t.includes('KHAI VỊ')) return Salad;
                                        if (t.includes('CHÍNH')) return ChefHat;
                                        if (t.includes('TRÁNG MIỆNG')) return Coffee;
                                        return ChefHat;
                                    };
                                    
                                    return (
                                        <div 
                                            key={category.categoryName} 
                                            ref={!searchTerm ? handleSetRef(category.categoryName) : null}
                                            data-category={category.categoryName}
                                            className="bg-gray-800 p-8 rounded-xl shadow-2xl"
                                        >
                                            
                                            <div className="flex items-center justify-center mb-10 border-b-2 border-amber-600/50 pb-4">
                                                {React.createElement(IconComponent(category.categoryName), { className: "w-8 h-8 text-amber-500 mr-4" })}
                                                <h2 className="text-3xl font-bold font-serif text-amber-500 uppercase tracking-wider">
                                                    {category.categoryName} 
                                                    {searchTerm && <span className="text-sm font-normal text-gray-400 ml-3">({category.items.length} kết quả)</span>}
                                                </h2>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                                {category.items.map((item, itemIndex) => (
                                                    <MenuCard 
                                                        key={item._id || itemIndex} 
                                                        item={item} 
                                                        onAddToCart={onAddToCart}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center p-10 bg-gray-800 rounded-xl shadow-2xl">
                                <Search className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-white">Không tìm thấy món ăn nào</h3>
                                <p className="text-gray-400 mt-2">Vui lòng thử từ khóa khác hoặc quay lại xem toàn bộ thực đơn.</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
                                >
                                    Xem Toàn Bộ Menu
                                </button>
                            </div>
                        )}
                    </main>
                </div>

                {/* Floating Cart Button */}
                {totalItems > 0 && (
                    <button
                        onClick={onGoToCheckout}
                        className="fixed bottom-6 right-6 bg-amber-600 text-white p-4 rounded-full shadow-2xl hover:bg-amber-700 transition duration-300 transform hover:scale-105 z-40 flex items-center font-bold"
                        aria-label="Đi đến giỏ hàng"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        <span className="ml-2 text-lg">
                            {totalItems} MÓN
                        </span>
                        <ArrowLeft className="w-5 h-5 ml-2 transform rotate-180"/>
                    </button>
                )}
            </div>
        </div>
    );
};


// --- 4. MÀN HÌNH 2: CHECKOUT VIEW (Trang Thanh toán và Đặt hàng) ---

const CheckoutView = ({ cart, updateQuantity, onGoToMenu, handleFinalOrder }) => {
    const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '', notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalOrderAmount = useMemo(() => 
        cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    , [cart]);

    const handleInfoChange = (e) => {
        setCustomerInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        
        if (cart.length === 0) return;
        // Chuyển sang sử dụng thông báo tùy chỉnh thay vì `alert()`
        if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
            // Thay thế alert bằng một cơ chế hiển thị lỗi trên UI nếu cần
            console.error("Vui lòng điền đầy đủ Tên, Số điện thoại và Địa chỉ để hoàn tất đơn hàng.");
            return;
        }

        setIsSubmitting(true);
        // Simulate order processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        handleFinalOrder(totalOrderAmount, customerInfo);
        setIsSubmitting(false);
    };
    
    // Sub-component for Cart Item
    const CartItem = ({ item }) => (
        <div className="flex items-start py-4 border-b border-gray-700 last:border-b-0">
            <div className="flex-grow">
                <p className="font-bold text-lg text-white">{item.name}</p>
                <p className="text-amber-500 font-semibold">{formatCurrency(item.price)}</p>
            </div>
            
            <div className="flex items-center space-x-2 border border-gray-600 rounded-lg p-1">
                <button 
                    onClick={() => updateQuantity(item._id, -1)}
                    className="p-1 text-gray-400 hover:text-white transition disabled:opacity-50"
                    disabled={item.quantity <= 1}
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-bold w-4 text-center">{item.quantity}</span>
                <button 
                    onClick={() => updateQuantity(item._id, 1)}
                    className="p-1 bg-amber-600 rounded-md hover:bg-amber-700 transition"
                >
                    <Plus className="w-4 h-4 text-white" />
                </button>
            </div>
            
            <p className="font-extrabold text-white w-24 text-right ml-4 flex-shrink-0">
                {formatCurrency(item.price * item.quantity)}
            </p>

            <button
                onClick={() => updateQuantity(item._id, -item.quantity)} // Remove item
                className="ml-4 p-1 text-red-500 hover:text-red-600 transition"
                aria-label="Xóa món ăn"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
    
    // Check if cart is empty
    if (cart.length === 0) {
        return (
            <div className="pt-24 pb-20 bg-gray-900 min-h-screen text-white text-center">
                <div className="max-w-4xl mx-auto p-10 bg-gray-800 rounded-xl shadow-2xl">
                    <ShoppingCart className="w-20 h-20 text-amber-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold font-serif mb-4">Giỏ hàng của bạn đang trống!</h2>
                    <button
                        onClick={onGoToMenu}
                        className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-amber-700 transition duration-200 shadow-md flex items-center mx-auto"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại Menu
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="pt-24 pb-20 bg-gray-900 min-h-screen text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <header className="flex items-center justify-between mb-10 border-b border-gray-700 pb-4">
                    <button onClick={onGoToMenu} className="text-gray-400 hover:text-amber-500 flex items-center transition">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại Menu
                    </button>
                    <h1 className="text-4xl font-extrabold font-serif text-amber-500">XÁC NHẬN ĐƠN HÀNG</h1>
                </header>

                <form onSubmit={handleOrderSubmit} className="flex flex-col lg:flex-row gap-8">
                    
                    {/* LEFT COLUMN: CART SUMMARY */}
                    <div className="lg:w-1/2 bg-gray-800 p-6 rounded-xl shadow-2xl h-fit">
                        <h2 className="text-2xl font-bold font-serif text-white mb-6 border-b border-gray-700 pb-3">
                            <ShoppingCart className="inline w-6 h-6 mr-2 text-amber-500" />
                            Chi Tiết Giỏ Hàng
                        </h2>
                        
                        <div className="divide-y divide-gray-700">
                            {cart.map(item => (<CartItem key={item._id} item={item} />))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-6 space-y-3 pt-4 border-t border-gray-700">
                            <div className="flex justify-between text-lg">
                                <span className="text-gray-400">Tạm tính:</span>
                                <span className="font-medium text-white">{formatCurrency(totalOrderAmount)}</span>
                            </div>
                            <div className="flex justify-between text-lg">
                                <span className="text-gray-400">VAT (10%):</span>
                                <span className="font-medium text-white">{formatCurrency(totalOrderAmount * 0.1)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-extrabold pt-2 border-t border-amber-600/50">
                                <span className="text-amber-500">TỔNG CỘNG:</span>
                                <span className="text-amber-500">{formatCurrency(totalOrderAmount * 1.1)}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: CUSTOMER INFO */}
                    <div className="lg:w-1/2 bg-gray-800 p-6 rounded-xl shadow-2xl">
                        <h2 className="text-2xl font-bold font-serif text-white mb-6 border-b border-gray-700 pb-3">
                            Thông Tin Nhận Hàng
                        </h2>

                        <div className="space-y-6">
                            {/* Input Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Họ và Tên <span className="text-red-500">*</span></label>
                                <input type="text" id="name" name="name" value={customerInfo.name} onChange={handleInfoChange} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            
                            {/* Input Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">Số Điện Thoại <span className="text-red-500">*</span></label>
                                <input type="tel" id="phone" name="phone" value={customerInfo.phone} onChange={handleInfoChange} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500" />
                            </div>

                            {/* Input Address */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">Địa Chỉ Nhận Hàng <span className="text-red-500">*</span></label>
                                <textarea id="address" name="address" rows="3" value={customerInfo.address} onChange={handleInfoChange} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 resize-none" ></textarea>
                            </div>
                            
                            {/* Input Notes */}
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-1">Ghi chú (Tùy chọn)</label>
                                <textarea id="notes" name="notes" rows="2" value={customerInfo.notes} onChange={handleInfoChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-amber-500 focus:border-amber-500 resize-none" ></textarea>
                            </div>
                            
                            {/* Final Order Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || cart.length === 0}
                                className={`w-full py-4 rounded-xl text-lg font-bold transition duration-300 mt-6 ${
                                    isSubmitting 
                                        ? 'bg-amber-800 text-amber-200 cursor-not-allowed flex items-center justify-center' 
                                        : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/50'
                                }`}
                            >
                                {isSubmitting ? (<><Clock className="animate-spin w-5 h-5 mr-3" />Đang Xử Lý Đơn Hàng...</>) : ("ĐẶT HÀNG VÀ THANH TOÁN (COD)")}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- 5. MÀN HÌNH 3: ORDER SUCCESS VIEW (Trang Đặt hàng thành công) ---

const OrderSuccessView = ({ summary, onGoToMenu }) => {
    return (
        <div className="pt-24 pb-20 bg-gray-900 min-h-screen text-white text-center">
            <div className="max-w-xl mx-auto p-10 bg-gray-800 rounded-xl shadow-2xl border border-green-500/50">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
                <h2 className="text-4xl font-extrabold font-serif text-green-400 mb-4">ĐẶT MÓN THÀNH CÔNG!</h2>
                <p className="text-gray-300 text-lg mb-8">
                    Chúng tôi sẽ liên hệ lại qua số điện thoại của bạn để xác nhận đơn hàng trong vòng 5 phút.
                </p>

                {summary && (
                    <div className="text-left bg-gray-900 p-6 rounded-lg space-y-3">
                        <p className="text-xl font-bold text-amber-500">Mã Đơn Hàng: <span className="float-right">{summary.orderCode}</span></p>
                        <p className="text-lg">Tổng Thanh Toán: <span className="float-right font-bold text-white">{formatCurrency(summary.totalAmount)}</span></p>
                        <p className="text-lg">Giao Đến: <span className="float-right font-bold text-white max-w-[70%] truncate">{summary.customer.address}</span></p>
                    </div>
                )}
                
                <button
                    onClick={onGoToMenu}
                    className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-amber-700 transition duration-200 shadow-md mt-8 flex items-center mx-auto"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Tiếp tục khám phá Menu
                </button>
            </div>
        </div>
    );
};


// --- 6. COMPONENT CHÍNH/ĐIỀU HƯỚNG: APP ROUTER ---

const OnlineFoodOrderingApp = () => {
    // 'menu' | 'checkout' | 'success'
    const [currentPage, setCurrentPage] = useState('menu'); 
    const [menuData, setMenuData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState([]); 
    const [orderSummary, setOrderSummary] = useState(null); 
    const [activeCategory, setActiveCategory] = useState(null);

    const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

    // Data Fetching (Sử dụng Mock Data nếu fetch lỗi)
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // Giả lập fetch data
                const response = await fetch('http://localhost:5000/api/menu'); 
                if (!response.ok) throw new Error('Failed to fetch menu data, using mock data.');
                
                const result = await response.json();
                setMenuData(result.data || []);
                
            } catch (err) {
                // Nếu có lỗi, sử dụng dữ liệu giả lập
                setMenuData(MOCK_MENU_DATA); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenu();
    }, []);

    // Logic Giỏ Hàng
    const addToCart = (itemToAdd) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === itemToAdd._id);

            if (existingItem) {
                return prevCart.map(item =>
                    item._id === itemToAdd._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...itemToAdd, quantity: 1, price: itemToAdd.price }];
            }
        });
    };

    const updateQuantity = (itemId, change) => {
        setCart(prevCart => {
            return prevCart.map(item =>
                item._id === itemId
                    ? { ...item, quantity: item.quantity + change }
                    : item
            ).filter(item => item.quantity > 0);
        });
    };

    const handleFinalOrder = (totalAmount, customerInfo) => {
        setOrderSummary({ 
            totalAmount: totalAmount * 1.1, // Bao gồm VAT
            itemsCount: totalItems,
            customer: customerInfo,
            orderCode: `ORD-${Date.now().toString().slice(-6)}`
        });
        setCart([]); 
        setCurrentPage('success'); 
    };
    
    // UI Loading
    if (isLoading) {
        return <div className="pt-32 pb-20 bg-gray-900 min-h-screen text-white text-center text-2xl">Đang tải thực đơn...</div>;
    }

    // --- PHẦN ĐIỀU HƯỚNG CHÍNH ---

    switch (currentPage) {
        case 'menu':
            return (
                <MenuView 
                    menuData={menuData}
                    onAddToCart={addToCart}
                    totalItems={totalItems}
                    onGoToCheckout={() => totalItems > 0 ? setCurrentPage('checkout') : null}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />
            );
        
        case 'checkout':
            return (
                <CheckoutView
                    cart={cart}
                    updateQuantity={updateQuantity}
                    onGoToMenu={() => setCurrentPage('menu')}
                    handleFinalOrder={handleFinalOrder}
                />
            );
        
        case 'success':
            return (
                <OrderSuccessView 
                    summary={orderSummary} 
                    onGoToMenu={() => setCurrentPage('menu')}
                />
            );
        
        default:
            return <div>Lỗi trang không xác định</div>;
    }
};

export default OnlineFoodOrderingApp;
