import secrets

l = secrets.token_hex(32)
print(f"FLASK_SECRET_KEY={l}")