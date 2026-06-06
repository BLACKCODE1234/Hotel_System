import smtplib
import os
from flask import jsonify
from email.message import EmailMessage
from dotenv import load_dotenv

from utility.otp import generate_otp

load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

def send_email(email: str, otp: str):
    
    msg = EmailMessage()
    msg["From"] = EMAIL_USER
    msg["To"] = email
    msg["Subject"] = "Your OTP"
    msg.set_content(f"Your OTP is {otp}. It expires in 5 minutes.")

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_USER,EMAIL_PASS)
            server.send_message(msg)
    except Exception as e:
        print("Email error:", e)
        return jsonify({"message":"Email Server is down","status":"error"}),500
            