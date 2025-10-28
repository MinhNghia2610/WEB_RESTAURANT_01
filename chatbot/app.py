from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

# ---------------- RULE-BASED ----------------
rules = {
    r"(menu|thực đơn)": "Hôm nay nhà hàng có các món Pháp đặc biệt: Bò hầm rượu vang và Bánh mì bơ tỏi 🥖🍷",
    r"(giờ mở cửa|open)": "Chúng tôi mở cửa từ 10:00 - 22:00 hàng ngày.",
    r"(địa chỉ|address)": "Nhà hàng ở số 99 Rue de Saigon, Quận 1, TP.HCM 🇫🇷",
    r"(đặt bàn|reservation)": "Bạn muốn đặt bàn cho mấy người và khung giờ nào ạ?",
}

# ---------------- FALLBACK NLU ----------------
def nlu_response(user_text):
    # (giả lập LLM/NLU, bạn có thể nâng cấp dùng HuggingFace hoặc OpenAI)
    return f"Xin lỗi, tôi chưa hiểu '{user_text}', bạn có thể diễn đạt lại rõ hơn không?"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "").lower()

    # 1️⃣ Rule-based trước
    for pattern, reply in rules.items():
        if re.search(pattern, message):
            return jsonify({"reply": reply})

    # 2️⃣ Nếu không khớp → NLU
    ai_reply = nlu_response(message)
    return jsonify({"reply": ai_reply})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
