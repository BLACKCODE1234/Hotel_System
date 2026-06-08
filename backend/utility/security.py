from passlib.context import CryptContext

from dotenv import load_dotenv
# from otp import generate_otp


load_dotenv()


pwd = CryptContext(
    schemes=['argon2'],
    deprecated='auto'
)



def hash_otp(otp):
    return pwd.hash(otp)

def verify_otp(otp,hashed_otp):
    return pwd.verify(otp,hashed_otp)

def hash_password(password:str):
    return pwd.hash(password)


def verify_password(password:str,hashed_password:str):
    return pwd.verify(password,hashed_password)