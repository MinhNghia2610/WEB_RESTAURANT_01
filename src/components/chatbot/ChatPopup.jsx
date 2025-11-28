import { useState } from "react";

export default function ChatPopup({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  async function sendMessage() {
    if (!text.trim()) return;

    const userMsg = { sender: "user", text };
    setMessages((m) => [...m, userMsg]);

    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    setMessages((m) => [...m, { sender: "bot", text: data.reply }]);

    setText("");
  }

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <span>ChefBot AI</span>
        <button onClick={onClose}>X</button>
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
}
