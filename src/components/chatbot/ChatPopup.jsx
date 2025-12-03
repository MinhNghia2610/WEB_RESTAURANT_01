import { useEffect, useRef, useState } from "react";

export default function ChatPopup({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    if (!text.trim()) return;

    const userMsg = { sender: "user", text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();

      setMessages((m) => [
        ...m,
        { sender: "bot", text: data.reply || "Bot không trả lời." }
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { sender: "bot", text: "⚠️ Không kết nối được với server!" }
      ]);
    }

    setLoading(false);
    setText("");
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <span>ChefBot AI</span>
        <button onClick={onClose}>X</button>
      </div>

      <div className="chat-body" ref={bodyRef}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender}>
            {msg.text}
          </div>
        ))}

        {loading && <div className="bot">Đang xử lý...</div>}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
}
