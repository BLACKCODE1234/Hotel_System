from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from otp import generate_otp


load_dotenv()


pwd = CryptContext(
    schemes=['argon2'],
    deprecated='auto'
)

# otp = generate_otp

def hash_otp(otp):
    # otp = generate_otp()
    print(pwd.hash(otp))
    print()
    
hash_otp(9)
