import json
import os

RULE_PATH = os.path.join(os.path.dirname(__file__), "rules.json")

rules = json.load(open(RULE_PATH, "r", encoding="utf8"))

def check_rules(message):
    message = message.lower()
    for key, r in rules.items():
        for kw in r["keywords"]:
            if kw in message:
                return r["reply"], r["suggestions"], "rule"
    return None, None, None
