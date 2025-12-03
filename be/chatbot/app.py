from flask import Flask, request, jsonify
from flask_cors import CORS
from rule_engine.rule_engine import check_rules
from utils.text_cleaner import normalize_text
from nlu.intent_classifier import classify_intent
from llm.ollama_chat import ask_ollama

app = Flask(__name__)
CORS(app)

# Intent → Response template
INTENT_RESPONSES = {
    "ask_menu": "Menu hôm nay gồm có bò bít tết, salad và mì Ý.",
    "ask_hours": "Nhà hàng mở cửa từ 9h đến 22h.",
    "ask_reservation": "Bạn muốn đặt bàn mấy người ạ?",
    "ask_contact": "Hotline: 090-123-4567."
}


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    message = normalize_text(data.get("message", ""))

    if not message:
        return jsonify({"reply": "Bạn chưa nhập nội dung."})

    # 1️⃣ Rule-based
    rule_reply, _, source = check_rules(message)
    if rule_reply:
        return jsonify({
            "reply": rule_reply,
            "source": "rule"
        })

    # 2️⃣ Intent classifier (Ollama)
    intent, confidence = classify_intent(message)

    if intent and confidence > 0.5:
        reply = INTENT_RESPONSES.get(intent, "Tôi đã hiểu câu hỏi của bạn.")
        return jsonify({
            "reply": reply,
            "intent": intent,
            "confidence": confidence,
            "source": "intent"
        })

    # 3️⃣ Fallback → gọi Ollama chat
    ai_reply = ask_ollama(message)

    return jsonify({
        "reply": ai_reply,
        "source": "ollama"
    })


@app.route("/")
def index():
    return "Chatbot + Rule + Intent + Ollama OK"

@app.route("/", methods=["GET"])
def home():
    return {"status": "backend running"}

@app.route("/test", methods=["GET"])
def test():
    return {"message": "test ok"}

if __name__ == "__main__":
    app.run(debug=True, port=5000)
