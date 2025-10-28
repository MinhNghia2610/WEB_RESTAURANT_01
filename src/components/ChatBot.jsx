import React, { useState, useRef, useEffect } from "react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Bonjour! Tôi là ChefBot – trợ lý nhà hàng Pháp. Tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  // --- gửi message lên backend (Python Flask) ---
  const sendMessage = async (userText) => {
    try {
      const res = await fetch("http://127.0.0.1:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      return data.reply || "Xin lỗi, tôi chưa hiểu ý bạn.";
    } catch (err) {
      console.error(err);
      return "Lỗi kết nối đến ChefBot 😢";
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);

    const reply = await sendMessage(trimmed);
    setIsTyping(false);
    setMessages((prev) => [...prev, { from: "bot", text: reply }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="bg-white border shadow-xl rounded-2xl w-80 h-96 flex flex-col overflow-hidden">
          <div className="bg-amber-600 text-white p-3 flex justify-between items-center">
            <span className="font-semibold">ChefBot 🍷</span>
            <button onClick={() => setIsOpen(false)} className="text-lg font-bold hover:text-gray-200">✕</button>
          </div>

          <div ref={chatRef} className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-sm max-w-[80%] ${
                  msg.from === "bot"
                    ? "bg-gray-200 text-left"
                    : "bg-amber-600 text-white self-end ml-auto text-right"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="bg-gray-200 p-2 rounded-lg text-sm text-gray-500">ChefBot đang nhập...</div>
            )}
          </div>

          <div className="p-3 border-t flex bg-white">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border rounded-lg px-2 py-1 text-sm focus:outline-none resize-none"
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={handleSend} className="ml-2 bg-amber-600 text-white px-3 py-1 rounded-lg hover:bg-amber-700">
              Gửi
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-amber-600 text-white p-4 rounded-full shadow-lg hover:bg-amber-700 transition"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatBot;
