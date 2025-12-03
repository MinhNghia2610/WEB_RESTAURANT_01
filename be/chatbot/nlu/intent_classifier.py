import subprocess
import json

INTENTS = {
    "ask_menu": ["menu", "món ăn", "đồ ăn"],
    "ask_hours": ["giờ mở cửa", "open", "mở cửa"],
    "ask_reservation": ["đặt bàn", "reserve", "booking"],
    "ask_contact": ["liên hệ", "contact", "số điện thoại"],
}

def classify_intent(text: str):
    prompt = f"""
Hãy phân loại intent của câu sau thành một trong các intent sau:
- ask_menu
- ask_hours
- ask_reservation
- ask_contact

Chỉ trả về JSON dạng:
{{
  "intent": "...",
  "confidence": 0.xx
}}

Câu cần phân loại: "{text}"
"""

    result = subprocess.run(
        ["ollama", "run", "llama3.1"],
        input=prompt.encode("utf-8"),
        stdout=subprocess.PIPE
    )

    try:
        response = json.loads(result.stdout.decode())
        return response["intent"], response["confidence"]
    except:
        return None, 0
