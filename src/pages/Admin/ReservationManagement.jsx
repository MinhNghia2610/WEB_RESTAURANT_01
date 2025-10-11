import React, { useState, useMemo } from 'react';
// Đảm bảo đường dẫn DataTable khớp với Canvas
import DataTable from '../../components/AdminComponents/DataTable'; 
import { Search, RotateCcw } from 'lucide-react';

const sampleReservations = [
    {
        id: 'R001',
        customer: 'Nguyễn Văn A',
        date: '2025-11-15',
        time: '19:00',
        guests: 4,
        table: 'Bàn 12',
        status: 'Đã xác nhận'
    },
    {
        id: 'R002',
        customer: 'Trần Thị B',
        date: '2025-11-15',
        time: '20:30',
        guests: 2,
        table: 'Chưa xếp',
        status: 'Chờ xử lý'
    },
    {
        id: 'R003',
        customer: 'Phạm Đức C',
        date: '2025-11-14',
        time: '18:30',
        guests: 6,
        table: 'Bàn VIP',
        status: 'Đã hoàn thành'
    },
    {
        id: 'R004',
        customer: 'Lê Văn D',
        date: '2025-11-16',
        time: '12:00',
        guests: 3,
        table: 'Bàn 5',
        status: 'Chờ xử lý'
    },
    {
        id: 'R005',
        customer: 'Vũ Thị E',
        date: '2025-11-14',
        time: '21:00',
        guests: 2,
        table: 'Bàn 8',
        status: 'Đã hủy'
    },
];

const ReservationManagement = () => {
    // State để lưu trữ dữ liệu chính (Giả lập việc fetch từ Firestore)
    const [reservations, setReservations] = useState(sampleReservations);
    
    // State quản lý bộ lọc
    const [filterStatus, setFilterStatus] = useState('Tất cả');
    const [filterDate, setFilterDate] = useState('');

    // Hàm giả lập các hành động quản lý
    const handleConfirm = (id) => {
        // Thay đổi trạng thái trong state (giả lập cập nhật Firestore)
        setReservations(prev => 
            prev.map(r => r.id === id ? { ...r, status: 'Đã xác nhận' } : r)
        );
        console.log(`Xác nhận đặt bàn: ${id}`);
    };

    const handleDelete = (id) => {
        // Xóa khỏi state (giả lập xóa trên Firestore)
        setReservations(prev => prev.filter(r => r.id !== id));
        console.log(`Xóa đặt bàn: ${id}`);
    };
    
    // Hàm này sẽ mở modal chỉnh sửa trong ứng dụng thực
    const handleEdit = (id) => {
        console.log(`Chỉnh sửa đặt bàn: ${id}`);
        // Logic mở modal chỉnh sửa sẽ được thêm vào sau
    };


    // Dữ liệu đã được lọc: Dùng useMemo để chỉ tính toán lại khi filter hoặc data thay đổi
    const filteredReservations = useMemo(() => {
        let filtered = reservations;

        if (filterStatus !== 'Tất cả') {
            filtered = filtered.filter(r => r.status === filterStatus);
        }

        if (filterDate) {
            filtered = filtered.filter(r => r.date === filterDate);
        }

        return filtered;
    }, [reservations, filterStatus, filterDate]);

    // Truyền các hàm xử lý hành động vào DataTable dưới dạng props
    const actions = {
        onConfirm: handleConfirm,
        onEdit: handleEdit,
        onDelete: handleDelete,
    };
    
    const columns = ['Mã ĐB', 'Khách hàng', 'Ngày', 'Giờ', 'SL Khách', 'Bàn', 'Trạng thái'];

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-3xl font-extrabold text-gray-900">🗓️ Quản lý Đặt bàn</h1>
            
            {/* Thanh công cụ và Bộ lọc */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-lg">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                    
                    {/* Bộ lọc Trạng thái */}
                    <select 
                        className="border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="Tất cả">Tất cả trạng thái</option>
                        <option value="Chờ xử lý">Chờ xử lý</option>
                        <option value="Đã xác nhận">Đã xác nhận</option>
                        <option value="Đã hủy">Đã hủy</option>
                        <option value="Đã hoàn thành">Đã hoàn thành</option>
                    </select>
                    
                    {/* Bộ lọc Ngày */}
                    <input 
                        type="date" 
                        className="border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                    
                    {/* Nút Reset Filter */}
                    <button 
                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                        onClick={() => {
                            setFilterStatus('Tất cả');
                            setFilterDate('');
                        }}
                        title="Đặt lại bộ lọc"
                    >
                        <RotateCcw size={18} className="mr-2"/> Đặt lại
                    </button>
                </div>
                
                {/* Nút Thêm Thủ công */}
                <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition mt-4 md:mt-0 w-full md:w-auto shadow-md">
                    + Thêm Đặt bàn Thủ công
                </button>
            </div>

            {/* Bảng dữ liệu Đặt bàn */}
            <DataTable 
                title={`Danh sách Đặt bàn (${filterDate ? `Ngày ${filterDate}` : 'Tất cả'})`} 
                columns={columns} 
                data={filteredReservations} 
                actions={actions} // Truyền các hàm hành động vào DataTable
            />

        </div>
    );
};

export default ReservationManagement;
