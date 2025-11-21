import React from 'react';
import { Quote, Star } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: "Trần Minh Tuấn",
        role: "Food Critic",
        comment: "Một trải nghiệm ẩm thực tuyệt vời. Không gian sang trọng, món ăn tinh tế và phục vụ chuyên nghiệp. Bò Wagyu ở đây là đỉnh cao.",
        rating: 5
    },
    {
        id: 2,
        name: "Nguyễn Thu Hà",
        role: "Khách hàng thân thiết",
        comment: "L'ESSENCE luôn là lựa chọn số 1 của gia đình tôi vào mỗi dịp đặc biệt. Món Tôm hùm sốt kem thực sự gây nghiện!",
        rating: 5
    },
    {
        id: 3,
        name: "David Smith",
        role: "Tourist",
        comment: "The best fine dining restaurant in Ho Chi Minh City. The fusion of flavors is incredible. Highly recommended!",
        rating: 5
    }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-3">Khách Hàng Nói Gì</h3>
            <h2 className="text-4xl font-bold font-serif text-white">Cảm Nhận Về L'ESSENCE</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
                <div key={review.id} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 relative hover:border-amber-500/30 transition-all">
                    <Quote size={40} className="text-amber-500/20 absolute top-6 right-6" />
                    <div className="flex gap-1 text-amber-500 mb-4">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-gray-300 italic mb-6 leading-relaxed">"{review.comment}"</p>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-lg">
                            {review.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">{review.name}</h4>
                            <p className="text-gray-500 text-xs uppercase">{review.role}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;