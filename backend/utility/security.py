from passlib.context import CryptContext

from dotenv import load_dotenv
# from otp import generate_otp


load_dotenv()


pwd = CryptContext(
    schemes=['argon2'],
    deprecated='auto'
)



def hash_otp(otp):
    print(pwd.hash(otp))
    print()
    
hash_otp("567")
