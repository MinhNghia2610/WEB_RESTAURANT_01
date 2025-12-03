import subprocess

def ask_ollama(message: str):
    result = subprocess.run(
        ["ollama", "run", "llama3.1"],
        input=message.encode("utf-8"),
        stdout=subprocess.PIPE
    )
    return result.stdout.decode()
