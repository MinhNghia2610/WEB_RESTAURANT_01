import { useState } from "react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Tôi đang xử lý yêu cầu của bạn..." },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Nếu isOpen = true thì hiện popup, ẩn nút 💬 */}
      {isOpen ? (
        <div className="bg-white border shadow-2xl rounded-2xl w-80 h-96 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 text-white p-3 flex justify-between items-center">
            <span className="font-semibold">ChefBot</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-lg font-bold hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 flex flex-col bg-gray-50">
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
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg px-2 py-1 text-sm focus:outline-none"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
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
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatBot;
