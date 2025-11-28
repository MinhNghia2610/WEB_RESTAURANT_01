import { useState } from "react";
import ChatPopup from "./ChatPopup";
import "./chatbot.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <div className="chat-widget-btn" onClick={() => setOpen(true)}>
          👨‍🍳
        </div>
      )}

      {open && <ChatPopup onClose={() => setOpen(false)} />}
    </>
  );
}
