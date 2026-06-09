import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

load_dotenv()

GMAIL_USER = os.getenv("GMAIL_USER") or os.getenv("EMAIL_USER")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD") or os.getenv("EMAIL_PASS")


def send_otp_email(receiver_email: str, otp: str) -> None:
    if not GMAIL_USER or not GMAIL_APP_PASSWORD:
        raise RuntimeError("System email is not configured")

    msg = EmailMessage()
    msg["Subject"] = "Your OTP code"
    msg["From"] = GMAIL_USER
    msg["To"] = receiver_email
    msg.set_content(f"Your otp is {otp}. It will expire in 5 minutes")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        server.send_message(msg)
