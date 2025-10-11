import React from 'react';
import { Link } from 'react-router-dom'; // <--- Đã thêm import Link
// Icon dùng để trang trí (Sử dụng Lucide Icons cho phù hợp với theme sang trọng)
import { Sparkles, Sprout, Wine } from 'lucide-react'; 

const StorySection = () => {
  return (
    // Đã chuyển nền chính trở lại là gray-800 theo yêu cầu
    <section className="py-20 md:py-32 bg-gray-800 text-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Tiêu đề chính */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="text-amber-500 font-serif uppercase tracking-widest mb-2">
            HÀNH TRÌNH KHAI MỞ TINH HOA
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-amber-500 leading-tight font-serif">
            Nghệ Thuật Pháp Giao Thoa Triết Lý Dưỡng Sinh
          </h2>
        </div>

        {/* Nội dung kể chuyện theo bố cục 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Cột 1: Hình ảnh và mô tả ngắn */}
          <div className="relative">
            {/* Hình ảnh chính (Sử dụng placeholder URL) */}
            <img 
              src="https://placehold.co/800x600/3A3A3A/F5D050?text=L'ESSENCE+Kitchen+Chef" 
              alt="Đầu bếp trưởng L'ESSENCE" 
              className="rounded-xl shadow-2xl w-full h-auto object-cover border-4 border-amber-500/50"
            />
            {/* Thẻ nhỏ nổi bật - Giữ nguyên nền gray-900 để nổi bật hơn một chút */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 p-6 rounded-lg shadow-xl border-t-4 border-amber-500 hidden md:block">
                <p className="text-xl font-bold text-amber-500 font-serif">
                    Bếp Trưởng L'ESSENCE
                </p>
                <p className="text-sm text-gray-400">
                    Hơn 20 năm kinh nghiệm tại các sao Michelin.
                </p>
            </div>
          </div>
          
          {/* Cột 2: Chi tiết câu chuyện và giá trị cốt lõi */}
          <div className="mt-8 lg:mt-0">
            <h3 className="text-3xl font-bold text-gray-50 mb-6 font-serif">
            Huyền Thoại Nguyên Liệu và Kỹ Thuật Đỉnh Cao
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
            L'ESSENCE được khai sinh từ khát vọng kết hợp **kỹ thuật nấu ăn cổ điển Pháp** tinh tế với sự nhẹ nhàng, cân bằng của **ẩm thực dưỡng sinh Á Đông**. Chúng tôi đã tạo ra một thực đơn độc nhất vô nhị, nơi hương vị phương Tây và lợi ích sức khỏe phương Đông hòa quyện.
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-8 italic">
            Từ những loại thảo mộc quý hiếm đến các loại hải sản tươi sống nhập khẩu, mỗi thành phần đều được kiểm định nghiêm ngặt để đảm bảo chất lượng và giá trị dinh dưỡng cao nhất.
            </p>

            {/* Các điểm nhấn quan trọng */}
            <div className="space-y-6">
              {/* Kỹ Thuật Cổ Điển Pháp */}
              <div className="flex items-start space-x-4">
                <Sparkles className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-50">Kỹ Thuật Cổ Điển Pháp</h4>
                  <p className="text-gray-400">Đội ngũ đầu bếp được đào tạo bài bản, áp dụng sự tinh tế trong từng đường nét chế biến.</p>
                </div>
              </div>
              {/* Triết Lý Dưỡng Sinh */}
              <div className="flex items-start space-x-4">
                <Sprout className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-50">Triết Lý Dưỡng Sinh</h4>
                  <p className="text-gray-400">Chú trọng sự cân bằng dinh dưỡng, sử dụng ít bơ, muối và đường.</p>
                </div>
              </div>
               {/* Hầm rượu vang */}
               <div className="flex items-start space-x-4">
                <Wine className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-50">Bộ Sưu Tập Rượu Vang</h4>
                  <p className="text-gray-400">Tuyển chọn các loại vang Grand Cru từ Bordeaux và Burgundy.</p>
                </div>
              </div>
            </div>

            {/* Đã chuyển từ <button> sang <Link> */}
            <Link
                to="/gioi-thieu" // Đường dẫn giả định cho trang câu chuyện/triết lý
                className="mt-10 px-8 py-3 bg-amber-600 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-amber-700 transition duration-300 transform hover:scale-105 inline-block"
            >
                Khám Phá Triết Lý Dưỡng Sinh
            </Link>

          </div>
        </div>
        
        {/* Phần bổ sung cho mobile (nếu thẻ nhỏ bị ẩn trên mobile) */}
        <div className="mt-16 text-center md:hidden">
            <p className="text-gray-300 font-bold">Bếp Trưởng L'ESSENCE: Hơn 20 năm kinh nghiệm tại các sao Michelin.</p>
        </div>
      </div>
    </section>
  );
};

export default StorySection;