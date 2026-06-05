import secrets
import string

def generate_otp(length=6):
    chars = string.digits
    otp = ''.join(secrets.choice(chars) for _ in range(length))
    print(otp)
    
generate_otp()