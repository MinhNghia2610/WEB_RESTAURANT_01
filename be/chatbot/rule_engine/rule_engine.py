def check_rules(text: str):
    text = text.lower()

    rules = {
        "menu": "Menu hôm nay gồm có bò bít tết, salad và mì Ý.",
        "giờ mở cửa": "Nhà hàng mở cửa từ 9h đến 22h.",
        "đặt bàn": "Bạn muốn đặt bàn mấy người ạ?",
        "liên hệ": "Hotline: 090-123-4567"
    }

    for keyword, reply in rules.items():
        if keyword in text:
            return reply, None, "rule"

    return None, None, None
