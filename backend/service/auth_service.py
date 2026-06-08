from datetime import datetime, timedelta
from utility.security import hash_otp, hash_password, verify_otp, verify_password, create_access_token
from utility.otp import generate_otp
from utility.utility_email import send_email


from repository.user_repository import (
    create_user,
    user_account_check,
    get_user_by_email
)
from fastapi import jsonify
from models.schemas import (UserLogin,
    UserSignup,
    AdminLogin,
    StaffLogin,
    OTPRequest,
    OTPVerify
)




def signup(data: UserSignup):
    existing_user = user_account_check(data.email)
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if data.password != data.confirmpassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    password = hash_password(data.password)
    otp = generate_otp()
    hashedotp = hash_otp(otp)
    expiry = datetime.now() + timedelta(minutes=5)
    attempts = 0
    
    save_pending_user(
        data.username,
        data.email,
        password
    )
    save_otp(data.email, hashedotp, expiry, attempts)
    send_email(data.email, otp)
    return {"message": "Check your email for OTP."}  