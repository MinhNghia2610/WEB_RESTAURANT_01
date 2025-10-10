import React from 'react';
import { Leaf, Utensils, Award } from 'lucide-react';

const GioiThieuPage = () => {
  return (
    <div className="pt-24 pb-16 bg-gray-900 min-h-screen text-white font-sans">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h1 className="text-5xl md:text-6xl font-extrabold font-serif text-center text-amber-500 mb-4 tracking-wider">
          Triết Lý Dưỡng Sinh Tại L'ESSENCE
        </h1>
        <p className="text-center text-gray-400 mb-12 max-w-4xl mx-auto text-lg">
          L'ESSENCE không chỉ là ẩm thực, mà là hành trình cân bằng cơ thể và tâm hồn, nơi tinh hoa ẩm thực Pháp giao thoa với triết lý dưỡng sinh Á Đông.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Cột 1: Hình ảnh nhà hàng */}
          <div className="order-2 lg:order-1">
            <img 
              src="https://placehold.co/600x450/444444/F5D050?text=L'ESSENCE+Interior" 
              alt="Không gian nhà hàng L'ESSENCE Fine Dining" 
              className="w-full rounded-2xl shadow-2xl border-4 border-amber-800/30 hover:scale-[1.01] transition duration-500 object-cover h-[450px]"
            />
          </div>

          {/* Cột 2: Tầm nhìn & Sứ mệnh */}
          <div className="order-1 lg:order-2 p-8 bg-gray-800 rounded-xl shadow-2xl border-t-4 border-amber-600">
            <h2 className="text-3xl font-bold font-serif text-amber-500 mb-6 border-b border-gray-700 pb-3">
              Tầm Nhìn & Sứ Mệnh
            </h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              **Tầm nhìn:** Định hình lại khái niệm Fine Dining, đưa L'ESSENCE trở thành điểm đến hàng đầu thế giới cho ẩm thực sức khỏe cao cấp.
            </p>
            <p className="text-gray-300 leading-relaxed">
              **Sứ mệnh:** Sáng tạo các kiệt tác ẩm thực, sử dụng 100% nguyên liệu tự nhiên, hữu cơ, kết hợp kỹ thuật chế biến tinh hoa của Pháp để mang lại trải nghiệm vị giác trọn vẹn và lợi ích sức khỏe lâu dài.
            </p>
            
            <div className="mt-8 pt-4 border-t border-gray-700">
                <p className="text-xl font-semibold text-amber-500 flex items-center">
                    <Award className="w-5 h-5 mr-2" /> Đầu bếp sáng tạo: Julien DuBois
                </p>
                <p className="text-sm text-gray-400 mt-2">
                    Julien DuBois, bếp trưởng người Pháp với hơn 20 năm kinh nghiệm tại các nhà hàng Michelin, là người dẫn dắt triết lý dưỡng sinh tại L'ESSENCE.
                </p>
            </div>
          </div>
        </div>

        {/* Nguyên tắc cốt lõi */}
        <div className="mt-20 text-center">
            <h3 className="text-3xl font-extrabold font-serif text-amber-500 mb-10">NGUYÊN TẮC CỐT LÕI</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 bg-gray-800 rounded-xl shadow-xl transition duration-300 hover:shadow-amber-900/50 border border-gray-700">
                    <Leaf className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-white mb-2">Hữu Cơ & Thuần Khiết</p>
                    <p className="font-light text-gray-400 text-sm">
                        Mọi nguyên liệu đều được chọn lọc từ các trang trại hữu cơ và đối tác bền vững.
                    </p>
                </div>
                <div className="p-8 bg-gray-800 rounded-xl shadow-xl transition duration-300 hover:shadow-amber-900/50 border border-gray-700">
                    <Utensils className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-white mb-2">Kỹ Thuật & Tinh Hoa</p>
                    <p className="font-light text-gray-400 text-sm">
                        Áp dụng các kỹ thuật ẩm thực Pháp cổ điển và hiện đại để giữ trọn vẹn dinh dưỡng.
                    </p>
                </div>
                <div className="p-8 bg-gray-800 rounded-xl shadow-xl transition duration-300 hover:shadow-amber-900/50 border border-gray-700">
                    <Award className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-white mb-2">Cân Bằng & Sáng Tạo</p>
                    <p className="font-light text-gray-400 text-sm">
                        Mỗi món ăn là một sự kết hợp khoa học, đảm bảo sự cân bằng hương vị và năng lượng.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GioiThieuPage;