import React from 'react';
// Import icons từ lucide-react để đồng bộ với theme
import { Quote, Star } from 'lucide-react'; 

// Dữ liệu đánh giá mẫu - Đã cập nhật cho Fine Dining
const testimonialsData = [
    {
        quote: "Một trải nghiệm ẩm thực đột phá. Kỹ thuật Pháp tinh tế kết hợp hoàn hảo với sự cân bằng của triết lý Dưỡng Sinh. Tôi đã tìm thấy món ăn 'chữa lành' yêu thích của mình tại L'ESSENCE.",
        name: "Ms. Hoàng Vân",
        title: "Doanh nhân & Chuyên gia Ẩm thực",
        rating: 5,
        image: "https://placehold.co/100x100/F5D050/3A3A3A?text=HV"
    },
    {
        quote: "Hầm rượu vang của họ là tuyệt vời nhất tôi từng thấy tại Việt Nam. Mỗi món ăn đều được Sommelier ghép đôi hoàn hảo, tạo nên một bản giao hưởng vị giác khó quên.",
        name: "Mr. Minh Khang",
        title: "Nhà sưu tầm Rượu vang",
        rating: 5,
        image: "https://placehold.co/100x100/F5D050/3A3A3A?text=MK"
    },
    {
        quote: "Không gian sang trọng, dịch vụ xuất sắc và đặc biệt là sự chú trọng đến nguyên liệu. L'ESSENCE không chỉ là Fine Dining, đó là trải nghiệm chăm sóc sức khỏe cao cấp.",
        name: "Dr. Thu Hương",
        title: "Bác sĩ Thẩm mỹ Cao cấp",
        rating: 4,
        image: "https://placehold.co/100x100/F5D050/3A3A3A?text=TH"
    },
];

// Component hiển thị Rating Star
const RatingStars = ({ rating }) => (
    <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, i) => (
            <Star 
                key={i} 
                // fill-amber-500 để ngôi sao được tô màu
                className={`w-5 h-5 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-600'}`} 
                fill={i < rating ? 'currentColor' : 'none'}
            />
        ))}
    </div>
);

// Component Testimonial Card
const TestimonialCard = ({ data }) => (
    // Thẻ đánh giá giữ nguyên nền trắng để tạo độ tương phản nổi bật trên nền tối
    <div 
        className="bg-white p-8 rounded-xl shadow-2xl border-t-4 border-amber-600/50 flex flex-col h-full transition duration-500 hover:shadow-3xl hover:border-amber-600 items-center text-center"
    >
        <Quote className="w-10 h-10 text-amber-600 mb-6 flex-shrink-0" />
        
        {/* Hiển thị Rating Stars */}
        <RatingStars rating={data.rating} />

        {/* Màu chữ tối bên trong thẻ nền sáng */}
        <p className="text-lg text-gray-700 italic flex-grow mb-6">
            "{data.quote}"
        </p>

        {/* Thông tin Khách hàng */}
        <div className="mt-auto pt-4 border-t border-gray-100 w-full flex flex-col items-center">
            <img 
                src={data.image} 
                alt={`Ảnh đại diện của ${data.name}`} 
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover shadow-md border-2 border-amber-500"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/F5D050/3A3A3A?text=User" }}
            />
            <h4 className="text-xl font-bold text-gray-900 font-serif">
                {data.name}
            </h4>
            <p className="text-sm text-amber-600 font-medium">
                {data.title}
            </p>
        </div>
    </div>
);

const Testimonials = () => {
    return (
        // Đã chuyển nền chính sang tông bg-gray-800 để đồng bộ với website
        <section className="py-20 md:py-32 bg-gray-800"> 
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Tiêu đề chính - Chữ Vàng/Trắng trên nền tối */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <p className="text-amber-500 font-serif uppercase tracking-widest mb-2">
                        CHỨNG THỰC TINH HOA
                    </p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-50 leading-tight font-serif">
                        Khách Hàng Nói Gì Về Trải Nghiệm L'ESSENCE
                    </h2>
                </div>

                {/* Grid chứa các đánh giá (Thẻ màu trắng nổi bật) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {testimonialsData.map((testimonial, index) => (
                        <TestimonialCard key={index} data={testimonial} />
                    ))}
                </div>

                {/* CTA nhỏ kêu gọi hành động */}
                <div className="mt-16 text-center">
                    <a 
                        href="#dat-ban"
                        // Nút nhấn Vàng/Đen đồng bộ
                        className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-semibold rounded-lg shadow-xl text-gray-900 bg-amber-600 hover:bg-amber-700 transition duration-300 transform hover:scale-105"
                    >
                        ĐẶT BÀN NGAY VÀ TỰ MÌNH TRẢI NGHIỆM
                    </a>
                </div>

            </div>
        </section>
    );
};

export default Testimonials;