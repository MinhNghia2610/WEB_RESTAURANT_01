import React from 'react';
// Import icons từ lucide-react
import { Trash2, Edit, CheckCircle } from 'lucide-react'; 

const DataTable = ({ title, columns, data }) => {
    
    // Hàm hiển thị tag trạng thái với màu sắc dựa trên giá trị Status
    const renderStatusTag = (status) => {
        let colorClass = 'bg-gray-200 text-gray-800';
        if (status === 'Đã xác nhận') {
            colorClass = 'bg-green-100 text-green-700';
        } else if (status === 'Chờ xử lý') {
            colorClass = 'bg-yellow-100 text-yellow-700';
        } else if (status === 'Đã hủy' || status === 'Đã hoàn thành') {
            // Dùng màu đỏ cho đã hủy/hoàn thành (hoàn thành có thể dùng xanh dương)
            colorClass = 'bg-red-100 text-red-700'; 
        }
        return (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <h2 className="text-2xl font-semibold p-6 border-b border-gray-200 text-gray-800">{title}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {col}
                                </th>
                            ))}
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động {/* Đặt tiêu đề cho cột Hành động */}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50 transition duration-100">
                                {/* Dữ liệu được render theo key để đảm bảo thứ tự khớp với columns */}
                                
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.customer}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.time}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{item.guests}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.table}</td>
                                
                                {/* CỘT TRẠNG THÁI: Sử dụng thẻ màu */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {renderStatusTag(item.status)}
                                </td>

                                {/* CỘT HÀNH ĐỘNG */}
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    {/* Nút Xác nhận chỉ hiển thị nếu trạng thái là "Chờ xử lý" */}
                                    {item.status === 'Chờ xử lý' && (
                                        <button 
                                            className="text-green-500 hover:text-green-700 mx-1 p-1 rounded transition"
                                            title="Xác nhận đặt bàn"
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                    )}
                                    <button 
                                        className="text-blue-500 hover:text-blue-700 mx-1 p-1 rounded transition"
                                        title="Chỉnh sửa chi tiết"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        className="text-red-500 hover:text-red-700 mx-1 p-1 rounded transition"
                                        title="Hủy/Xóa đặt bàn"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
