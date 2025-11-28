import React, { useEffect, useRef, useState } from "react";

// ChatBot component - popup chat nhỏ với rule-based replies
// Tác giả: sửa đổi để fix bug và thêm tính năng (Tiếng Việt comment)
const ChatBot = () => {
  // trạng thái popup (mở/đóng)
  const [isOpen, setIsOpen] = useState(false);
  // danh sách messages, mỗi message có { from: 'bot' | 'user', text }
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);
  // nội dung input hiện tại
  const [input, setInput] = useState("");
  // trạng thái typing indicator (bot đang nhập)
  const [isTyping, setIsTyping] = useState(false);

  // ref tới vùng chat để auto-scroll khi có tin nhắn mới
  const chatRef = useRef(null);

  // rules đơn giản dựa trên từ khoá
  const rules = [
    { keywords: ["menu", "thực đơn"], response: "Hôm nay chúng tôi có các món: Phở, Bún chả, Cơm tấm." },
    { keywords: ["giờ mở cửa", "mở cửa"], response: "Chúng tôi mở cửa từ 8h sáng đến 10h tối hàng ngày." },
    { keywords: ["địa chỉ", "address"], response: "Chúng tôi ở số 123 Đường ABC, Quận 1, TP.HCM." },
    { keywords: ["cảm ơn", "thank"], response: "Rất vui được giúp đỡ bạn!" },
  ];

  // hàm lấy phản hồi theo rule (nếu có)
  const getRuleResponse = (msg) => {
    if (!msg) return null;
    const text = msg.toLowerCase();
    for (const rule of rules) {
      if (rule.keywords.some((keyword) => text.includes(keyword))) {
        return rule.response;
      }
    }
    return null;
  };

  // gửi tin nhắn (gọi khi bấm Gửi hoặc Enter)
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // thêm message của user
    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");

    // hiển thị typing indicator trong 700-1200ms
    setIsTyping(true);
    const processingDelay = 800;

    setTimeout(() => {
      const ruleResponse = getRuleResponse(trimmed);
      let botReply = ruleResponse;
      if (!botReply) {
        botReply = "Xin lỗi, tôi không hiểu yêu cầu của bạn. Bạn có thể nói rõ hơn được không ?";
      }

      // cập nhật message bot: ẩn typing, thêm reply
      setIsTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    }, processingDelay);
  };

  // cho phép nhấn Enter để gửi (Shift+Enter để xuống dòng nếu cần)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // auto-scroll xuống cuối khi messages thay đổi
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* typing indicator hiển thị ngoài popup để người dùng thấy */}
      {isTyping && (
        <div className="mb-2 bg-white p-2 rounded-lg shadow-md text-sm text-gray-600">
          ChefBot đang nhập...
        </div>
      )}

      {/* popup chat */}
      {isOpen ? (
        <div className="bg-white border shadow-2xl rounded-2xl w-80 h-96 flex flex-col overflow-hidden">
          {/* Header: tiêu đề và nút đóng */}
          <div className="bg-red-600 text-white p-3 flex justify-between items-center">
            <span className="font-semibold">ChefBot</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-lg font-bold hover:text-gray-200"
              aria-label="Đóng chat"
            >
              ✕
            </button>
          </div>

          {/* Nội dung chat: message list */}
          <div
            ref={chatRef}
            className="flex-1 p-3 overflow-y-auto space-y-2 flex flex-col bg-gray-50"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-sm max-w-[80%] ${
                  msg.from === "bot"
                    ? "bg-gray-200 text-left"
                    : "bg-red-500 text-white self-end ml-auto text-right"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Ô nhập chat */}
          <div className="p-3 border-t flex bg-white">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border rounded-lg px-2 py-1 text-sm focus:outline-none resize-none"
              placeholder="Nhập tin nhắn... (Enter để gửi)"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              aria-label="Gửi tin nhắn"
            >
              Gửi
            </button>
          </div>
        </div>
      ) : (
        // Khi popup đóng → hiển thị nút tròn màu đỏ
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition"
          aria-label="Mở chat"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatBot;
