import re
import unicodedata

def normalize_text(text: str):
    text = text.lower().strip()
    text = unicodedata.normalize("NFKC", text)
    text = re.sub(r"\s+", " ", text)
    return text
