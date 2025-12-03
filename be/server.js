import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import dishRoutes from "./routes/dishRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from './routes/dashboardRoutes.js';
import reservationRoutes from "./routes/reservationRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ================= 1. ĐỊNH NGHĨA RULE BASE (Luật cứng) =================
// Đây là logic bạn muốn chạy trước khi gọi AI
const RULES = {
  "menu": "Thực đơn hôm nay gồm có: Bò bít tết, Salad Caesar, Mì Ý Carbonara, và Súp bí đỏ.",
  "giờ mở cửa": "Nhà hàng mở cửa từ 09:00 sáng đến 22:00 tối tất cả các ngày trong tuần.",
  "địa chỉ": "Nhà hàng L'ESSENCE nằm tại số 123 Đường Ẩm Thực, Quận 1, TP.HCM.",
  "liên hệ": "Hotline hỗ trợ: 090-123-4567.",
  "đặt bàn": "Bạn có thể đặt bàn trực tiếp qua website này ở mục 'Đặt Bàn' hoặc gọi hotline 090-123-4567."
};

function checkRules(message) {
  // Chuyển tin nhắn về chữ thường để so sánh dễ hơn
  const lowerMsg = message.toLowerCase();
  
  // Kiểm tra xem tin nhắn có chứa từ khóa nào trong danh sách luật không
  for (const [key, reply] of Object.entries(RULES)) {
    if (lowerMsg.includes(key)) {
      return reply; // Nếu tìm thấy, trả về câu trả lời cứng ngay
    }
  }
  return null; // Không tìm thấy luật nào
}
// =======================================================================

app.use("/api/auth", authRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/cart", cartRoutes);

// ================= 2. API CHATBOT (Logic Kết hợp) =================
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Vui lòng nhập tin nhắn!" });

    console.log("📩 User:", message);

    // --- BƯỚC 1: KIỂM TRA RULE BASE TRƯỚC ---
    const ruleReply = checkRules(message);
    if (ruleReply) {
      console.log("⚡ Rule-Base trả lời:", ruleReply);
      return res.json({ reply: ruleReply }); // Trả về ngay, KHÔNG gọi AI
    }

    // --- BƯỚC 2: NẾU KHÔNG CÓ LUẬT -> GỌI OLLAMA (AI) ---
    console.log("🤖 Không khớp luật, gọi AI...");
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1",
        prompt: message, // Bạn có thể thêm ngữ cảnh: "Bạn là nhân viên nhà hàng... " + message
        stream: false
      }),
    });

    const data = await response.json();
    if (data && data.response) {
      res.json({ reply: data.response });
    } else {
      res.json({ reply: "Xin lỗi, tôi chưa hiểu ý bạn." });
    }

  } catch (error) {
    console.error("❌ Lỗi Chatbot:", error.message);
    res.status(500).json({ reply: "Server AI đang bận, vui lòng thử lại sau." });
  }
});

app.get("/", (req, res) => res.send("🍽️ L'ESSENCE Backend is running"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));