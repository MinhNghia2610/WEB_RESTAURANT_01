import moment from 'moment';
import crypto from 'crypto';
import qs from 'qs';

// 1. Hàm tiện ích: Sắp xếp tham số (Bắt buộc của VNPay)
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// 2. Hàm tạo URL thanh toán
export const generateVnpayUrl = ({ ipAddr, orderId, amount, orderInfo, returnUrl }) => {
    
    // Config từ biến môi trường
    const tmnCode = process.env.VNPAY_TMNCODE;
    const secretKey = process.env.VNPAY_HASHSECRET;
    let vnpUrl = process.env.VNPAY_URL;

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    // Đảm bảo amount là số nguyên và nhân 100 (theo yêu cầu VNPay)
    const vnpAmount = parseInt(amount) * 100;

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = vnpAmount;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    // Sắp xếp và tạo chữ ký
    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    // Sử dụng Buffer.from thay vì new Buffer (để tránh lỗi Deprecated)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
    
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    return vnpUrl;
};

// 3. Hàm kiểm tra chữ ký khi VNPay trả về (Verify Return Url)
export const verifyVnpayReturn = (vnp_Params) => {
    let secureHash = vnp_Params['vnp_SecureHash'];
    
    // Xóa các param hash để tính toán lại
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNPAY_HASHSECRET;
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    // So sánh chữ ký
    if (secureHash === signed) {
        return {
            isValid: true,
            rspCode: vnp_Params['vnp_ResponseCode'],
            orderId: vnp_Params['vnp_TxnRef'],
            amount: vnp_Params['vnp_Amount'],
            transactionNo: vnp_Params['vnp_TransactionNo']
        };
    } else {
        return {
            isValid: false
        };
    }
};