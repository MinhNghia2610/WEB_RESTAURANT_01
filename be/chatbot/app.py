import os
from flask import Flask, request, jsonify
from rasa.nlu.model import Interpreter
from rules.rule_engine import check_rules
from utils.text_cleaner import normalize_text, remove_noise
import re

app = Flask(__name__)

# Load Rasa NLU model
RASA_MODEL_PATH = "rasa/models"
interpreter = None

try:
    interpreter = Interpreter.load(RASA_MODEL_PATH)
    print("[INFO] Rasa NLU model loaded.")
except Exception as e:
    print(f"[WARN] Failed to load Rasa model: {e}")

# Intent → Response map
INTENT_RESPONSES = {
    "ask_menu": "Bạn có thể xem menu tại /menu.",
    "ask_hours": "Nhà hàng mở cửa 11:30 - 22:30 mỗi ngày.",
    "ask_reservation": "Bạn muốn đặt bàn cho bao nhiêu người và vào lúc mấy giờ?",
    "ask_contact": "SDT: +84 90 123 4567.",
    "general": "Mình chưa hiểu ý bạn, bạn có thể hỏi lại ngắn hơn được không?"
}

def extract_phone(msg):
    m = re.search(r"(\+?\d[\d\s\-]{7,}\d)", msg)
    return m.group(1) if m else None


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    message = normalize_text(data.get("message", ""))

    if not message:
        return jsonify({"reply": "Bạn chưa nhập nội dung."})

    # Rule-based
    rule_resp, suggestions, source = check_rules(message)
    if rule_resp:
        return jsonify({
            "reply": rule_resp,
            "suggestions": suggestions,
            "source": source
        })

    # Rasa NLU
    if interpreter:
        try:
            parsed = interpreter.parse(message)
            intent = parsed["intent"]["name"]
            confidence = parsed["intent"]["confidence"]
        except:
            intent = None
            confidence = 0
    else:
        intent = None
        confidence = 0

    if not intent or confidence < 0.45:
        phone = extract_phone(message)
        if phone:
            return jsonify({
                "reply": f"Tôi thấy số điện thoại {phone}. Bạn muốn đặt bàn?",
                "source": "extraction"
            })
        return jsonify({
            "reply": "Xin lỗi mình chưa hiểu. Bạn có thể hỏi Menu, Đặt bàn hoặc Giờ mở cửa.",
            "source": "fallback"
        })

    reply = INTENT_RESPONSES.get(intent, INTENT_RESPONSES["general"])
    return jsonify({
        "reply": reply,
        "intent": intent,
        "confidence": confidence,
        "source": "rasa"
    })


@app.route("/", methods=["GET"])
def index():
    return "Backend chatbot OK"


if __name__ == "__main__":
    app.run(debug=True, port=5000)
