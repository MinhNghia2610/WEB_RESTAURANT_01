import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Lấy giỏ hàng của user hiện tại
// @route   GET /api/cart
// @access  Private (Cần đăng nhập)
export const getUserCart = asyncHandler(async (req, res) => {
  // req.user được lấy từ middleware bảo vệ (protect)
  const user = await User.findById(req.user._id);

  if (user) {
    // Trả về mảng cart
    // Frontend cần map lại field '_id' nếu muốn nhất quán với LocalStorage
    const formattedCart = user.cart.map(item => ({
      _id: item.dish, // Trả về ID món ăn dưới dạng _id cho frontend dễ xử lý
      name: item.name,
      price: item.price,
      imageURL: item.imageURL,
      quantity: item.quantity
    }));
    
    res.json(formattedCart);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Cập nhật toàn bộ giỏ hàng (Đồng bộ từ Client lên Server)
// @route   PUT /api/cart
// @access  Private (Cần đăng nhập)
export const updateUserCart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body; // Frontend gửi lên mảng giỏ hàng mới nhất
  const user = await User.findById(req.user._id);

  if (user) {
    // Ghi đè giỏ hàng cũ bằng giỏ hàng mới từ Frontend gửi lên
    // Map dữ liệu để khớp với Schema trong User Model
    user.cart = cartItems.map(item => ({
      dish: item._id || item.dish, // Chấp nhận cả _id hoặc dish
      name: item.name,
      price: item.price,
      imageURL: item.imageURL,
      quantity: item.quantity
    }));

    await user.save();
    
    res.json({ 
      success: true, 
      message: "Cart updated successfully", 
      cart: user.cart 
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});