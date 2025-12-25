

from types import MethodDescriptorType
from psycopg2.extensions import cursor
import os
from flask import Flask,jsonify,request,session
import bcrypt
import psycopg2
import jwt
from datetime import datetime 
import json
import requests
from flask_cors import CORS
from psycopg2 import RealDictCursor
from datetime import datetime,timedelta
from helper.generate_token import generate_access_token,generate_refresh_token,decoded_token
from flask_mail import Mail, Message
import random
import smtplib
import secrets
import string 
import time
from email.message import EmailMessage


from dotenv import load_dotenv
load_dotenv()

# Global OTP storage
otp_store = {}

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY","SECRET_KEY")


frontend_origins = os.getenv("FRONTEND_ORIGINS", "")
frontend_origins = [origin.strip() for origin in frontend_origins.split(",") if origin.strip()]


gmail_user = os.getenv("GMAIL_USER")
Gmail_app_password = os.getenv("GMAIL_APP_PASSWORD")

if not gmail_user or not Gmail_app_password:
    raise RuntimeError("System Email Not In Place")

CORS  (
        app,supports_credentials=True,
        resources={r"/*": {"origins": frontend_origins}},
        expose_headers=["Set-Cookie"],
        allow_headers=["Content-Type","Authorization"],
        methods=["GET","POST","PUT","DELETE","PATCH","OPTIONS"]
)



JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_MINUTES = 60


def database_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD")
        )
        return conn
    except psycopg2.Error as e:
        return jsonify({"message":"Server is down","status":"error"}),500

def get_cookie_settings():
    is_local = ("localhost" in request.host) or ("127.0.0.1" in request.host)
    secure_cookie = False if is_local else True
    samesite_cookie = "Lax" if is_local else "None"  
    domain_cookie = None  
    return secure_cookie, samesite_cookie, domain_cookie

def generate_otp():
    character = string.ascii_uppercase + string.ascii_lowercase + string.digits
    otp = ''.join(secrets.choice(character)for _ in range(6))
    return otp

def send_otp_email(receiver_email,otp):
    msg = EmailMessage()
    msg["Subject"]= "Your OTP code " 
    msg["From"] =    gmail_user
    msg["To"] = receiver_email
    msg.set_content(f"Your otp is {otp}.It will expire in 5 minutes")

    with smtplib.SMTP_SSL("smtp.gmail.com",465) as server:
        server.login(gmail_user,Gmail_app_password)
        server.send_message(msg)


@app.route('/send-otp',methods=['POST'])
def send_otp():
    if not request.is_json:
        return jsonify({"message":"Request must be JSON"}),400

    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"message":"Email is required"}),400

    otp = generate_otp()

    try:
        hashed_otp = bcrypt.hashpw(otp.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    except Exception:
        return jsonify({"message":"Failed to generate OTP"}),500
    
    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)

        # Remove any existing OTPs for this email
        cursor.execute("DELETE FROM email_otps WHERE email = %s", (email,))

        expires_at = datetime.utcnow() + timedelta(minutes=5)

        cursor.execute("""
            INSERT INTO email_otps (email, otp_hash, expires_at, used, created_at)
            VALUES (%s, %s, %s, %s, NOW())
        """, (email, hashed_otp, expires_at, False))

        db.commit()
    except psycopg2.Error as e:
        if 'db' in locals():
            db.rollback()
        return jsonify({"message":"Server error","error":str(e)}),500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()

    try:
        send_otp_email(email, otp)
    except Exception:
        return jsonify({"message":"Failed to send OTP email"}),500

    return jsonify({"message":"OTP sent to email"}),200


@app.route('/verify-otp',methods=['POST'])
def verify_otp():
    if not request.is_json:
        return jsonify({"message":"Request must be JSON"}),400

    data = request.get_json()
    email = data.get("email")
    user_otp = data.get("otp")

    if not email or not user_otp:
        return jsonify({"message":"Email and OTP are required"}),400
    
    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT id, otp_hash, expires_at, used, created_at
            FROM email_otps
            WHERE email = %s
            ORDER BY created_at DESC
            LIMIT 1
        """, (email,))

        record = cursor.fetchone()
        if not record:
            return jsonify({"message":"OTP NOT FOUND"}),400

        if record.get('used'):
            return jsonify({"message":"OTP has already been used"}),400

        expires_at = record['expires_at']
        if isinstance(expires_at, datetime):
            now = datetime.utcnow()
        else:
            # Fallback: treat non-datetime as expired
            now = datetime.utcnow()

        if now > expires_at:
            cursor.execute("UPDATE email_otps SET used = TRUE WHERE id = %s", (record['id'],))
            db.commit()
            return jsonify({"message":"OTP has expired"}),400

        otp_hash = record['otp_hash']

        try:
            if not bcrypt.checkpw(user_otp.encode('utf-8'), otp_hash.encode('utf-8')):
                return jsonify({"message":"Invalid OTP"}),400
        except Exception:
            return jsonify({"message":"Invalid OTP"}),400

        cursor.execute("UPDATE email_otps SET used = TRUE WHERE id = %s", (record['id'],))
        cursor.execute("""
            UPDATE loginusers
            SET verified = TRUE
            WHERE email = %s
        """, (email,))
        db.commit()

        return jsonify({"message":"OTP verified successfully","account_verified": True}),200
    except psycopg2.Error as e:
        if 'db' in locals():
            db.rollback()
        return jsonify({"message":"Server error","error":str(e)}),500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()



@app.route('/signup',methods=['POST'])
def signup():
    if not request.is_json:
        return jsonify({"message":"Request must be JSON","status":400})    

    data=request.get_json()
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    email = data.get("email")
    password = data.get("password")

    if len(password) < 6:
        return jsonify({"message":"Password should be more than 6 characters","status":"error"}),400
    
    repassword = data.get("repassword")
    if repassword != password:
        return jsonify({"message":"Passwords do not match","status":"error"}),400

    if not all([firstname,lastname,email,password,repassword]):
        return jsonify({"message":"All fields are required","status":"error","user":None}),400
    
    try:
        hashed = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt()).decode('utf-8')
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)

        cursor.execute("select email from loginusers where email = %s ",(email,))
        if cursor.fetchone():
            return jsonify({"message":"Account already exist","status":"error"}),400

        cursor.execute("INSERT INTO loginusers (firstname,lastname,email,password) VALUES (%s,%s,%s,%s)",(firstname,lastname,email,hashed))
        db.commit()

        access_token = generate_access_token(email,role='user')
        refresh_token = generate_refresh_token(email,role='user')
        secure_cookie, samesite_cookie, domain_cookie = get_cookie_settings()

        user = {"first_name": firstname, "last_name": lastname, "email": email}
        response = jsonify({"message": "Signup successful", "status": "success", "user": user}),201

        response.set_cookie(
            'refresh_token',
            refresh_token,
            httponly=True,
            secure=secure_cookie,
            samesite=samesite_cookie,
            domain=domain_cookie,
            max_age=7 * 24 * 60 * 60
        )
        response.set_cookie(
            'access_token',
            access_token,
            httponly=True,
            secure=secure_cookie,
            samesite=samesite_cookie,
            domain=domain_cookie,
            max_age=15 * 60
        )
        return response, 201
    
        

    except psycopg2.Error as e:
        return jsonify({"message":"Server is down","status":"error"}),500
    finally:
        if 'cursor'in locals():
            cursor.close()
        if 'db' in locals():
             db.close()
    

@app.route('/login',methods=['POST'])
def login():
    
    if not request.is_json:
        return jsonify({"message":"All fields are required","status":"error"}),404
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not all ([email,password]):
        return jsonify({"message":"All fields are required","status":"error"}),400

    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("select password,role,email from loginusers where email = %s",(email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message":"Account not found","status":"error"}),404
            
        hashedpassword = user['password'].encode('utf-8') if isinstance (user['password'],str) else user['password']

        if not bcrypt.checkpw(password.encode('utf-8'),hashedpassword):
            return jsonify({"message":"Password incorrect","status":"error"}),404

        role = user.get('role','user')

        
        try:
            cursor.execute("""
                UPDATE loginusers SET last_login = NOW()
                WHERE email = %s AND role IN ('admin','superadmin')
            """, (email,))
            db.commit()
        except Exception:
            db.rollback()

        access_token = generate_access_token(email,role)
        refresh_token = generate_refresh_token(email,role)
        secure_cookie, samesite_cookie, domain_cookie = get_cookie_settings()

        response = jsonify({"message": "Login successful",
                            "access_token": access_token,
                           "user":{
                               "email":user["email"],
                               "role":role,
                               "firstname":user.get("first_name"),
                               "lastname":user.get("last_name")
                           }})



        response.set_cookie('refresh_token', refresh_token,
                            httponly=True,
                            secure=secure_cookie,
                            samesite=samesite_cookie,
                            domain=domain_cookie,
                            max_age=7*24*60*60,
                            path='/'
                            )

        response.set_cookie('access_token', access_token,
                            httponly=True,
                            secure=secure_cookie,
                            samesite=samesite_cookie,
                            domain=domain_cookie,
                            max_age=15*60,
                            path='/'
                            )
        return response

    except psycopg2.Error as e:
        return jsonify({"message":"Server is down","status":"error"}),500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()



@app.route('/stafflogin',methods=['POST'])
def stafflogin():
    pass

@app.route('/adminlogin',methods=['POST'])
def adminlogin():
    pass


@app.route('/logout',methods=['POST'])
def logout():
    secure_cookie, samesite_cookie, domain_cookie = get_cookie_settings()
    response = jsonify({"message": "Logout successful", "status": "success"})

    
    response.delete_cookie('access_token', path='/', secure=secure_cookie, samesite=samesite_cookie, domain=domain_cookie)
    response.delete_cookie('refresh_token', path='/', secure=secure_cookie, samesite=samesite_cookie, domain=domain_cookie)

    return response, 200

@app.route('/me',methods=['POST'])
def me():
    access_token = request.cookies.get('access_token')
    if not access_token:
        return jsonify({"message": "No token", "user": None}), 401

    decoded = decoded_token(access_token)
    if not decoded:
        return jsonify({"message": "Invalid token", "user": None}), 401

    email = decoded.get('email')
    db = database_connection()
    cursor = db.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT first_name, last_name, email,role FROM loginusers WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    db.close()

    if user:
       
        user_data = {
            "email": user["email"],
            "role": user["role"],
            "firstname": user.get("first_name"),
            "lastname": user.get("last_name")
        }
        return jsonify({"user": user_data}), 200
    return jsonify({"user": None}), 404



@app.route('/refresh',methods=['POST'])
def refresh():
    refresh_token = request.cookies.get('refresh_token')
    if not refresh_token:
        return jsonify({"message": "Refresh token missing", "code": "NO_REFRESH_TOKEN"}), 401

    decoded = decoded_token(refresh_token, is_refresh=True)
    if not decoded:
        return jsonify({"message": "Invalid or expired refresh token", "code": "INVALID_REFRESH_TOKEN"}), 401

    try:
        new_access_token = generate_access_token(decoded['email'], decoded['role'])
        secure_cookie, samesite_cookie, domain_cookie = get_cookie_settings()
        response = jsonify({"message": "Token refreshed successfully"})
        response.set_cookie('access_token', new_access_token,
                            httponly=True,
                            secure=secure_cookie,
                            samesite=samesite_cookie,
                            domain=domain_cookie,
                            max_age=15*60,
                            path='/'
                            )
        return response
    except Exception as e:
        return jsonify({"message": "Failed to generate new token", "error": str(e)}), 500


    
@app.route('/bookings',methods=['POST'])
def bookings():
    access_token = request.cookies.get('access_token')
    if not access_token:
        return jsonify({"message":"No Token "}),401
    
    decoded = decoded_token(access_token)
    if not decoded:
        return jsonify({"message":"Invalid or Expired Token"}),401

    user_email = decoded.get('email')
    if not user_email:
        return jsonify({"message":"Account not found"}),401

    data = request.get_json()
    
    first_name = data.get('first_name')
    last_name = data.get("last_name")
    email = data.get("email")
    phone = data.get("phone")
    street = data.get("street")
    city = data.get("city")
    country = data.get("country")
    in_date = data.get("in_date")
    out_date = data.get("out_date")
    adults = data.get("adult")
    children = data.get("children")
    rooms = data.get("rooms")
    room_type = data.get("room_type")
    sp_request = data.get("special_request")


    missing_fields = []

    if not first_name:missing_fields.append("first_name")
    if not last_name:missing_fields.append("last_name")
    if not email:missing_fields.append("email")
    if not phone:missing_fields.append("phone")
    if not adults:missing_fields.append("adults")
    if not children:missing_fields.append("children")
    if not rooms:missing_fields.append("rooms")
    if not room_type:missing_fields.append("room_type")
    if not in_date:missing_fields.append("in_date")
    if not out_date:missing_fields.append("out_date")

    if missing_fields:
        return jsonify({"message":f"Required fields missing: {',  '.join(missing_fields)}"}),400

    """user name 
        To be like the account info on top with let say an image 
        or something """

    
    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        
        # TODO: Implement room availability check and booking creation
        # Check room availability for the given dates and room type
        # cursor.execute("SELECT room_id, room, roomtype FROM rooms WHERE roomtype = %s AND available = true", (room_type,))
        # available_rooms = cursor.fetchall()
        
        # If rooms available, create booking
        # cursor.execute("INSERT INTO bookings (...) VALUES (...)")
        # db.commit()
        
        return jsonify({"message": "Booking functionality not yet implemented"}), 501




    except psycopg2.Error as e:
        return jsonify({"message": "Something happened Server Down. We are trying to resolve it", "error": str(e)}), 500

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()



@app.route("/superadmin/create_admin",methods=["POST"])
def create_admin():
    access_token = request.cookies.get('access_token')
    if not access_token:
        return jsonify({"message":"Invalid or Expired token"}),401
    decoded = decoded_token(access_token)

    if not decoded:
        return jsonify({"message":"Invalid or Expired token"}),401
    
    if decoded.get("role") != "superadmin":
        return jsonify({"message":"Forbidden.Do not have the clearance"}),403

    data = request.get_json()
    first_name = data.get("firstname")
    last_name = data.get("lastname")
    email = data.get("email")
    password = data.get("password")

    if not all ([first_name,last_name,email,password]):
        return jsonify({"message":"All fields are required"}),400

    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("select email from loginusers where email = %s",(email,))
        

        if cursor.fetchone():
            return jsonify({"message":"Account already exist"}),401

        hashed_password = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt()).decode('utf-8')

        cursor.execute("""insert into loginusers (first_name,last_name,email,password,role)
                    values(%s,%s,%s,%s,%s)""",
        (first_name,last_name,email,hashed_password,"admin"))
        db.commit()

        return jsonify({"message":"ADmin Created Successfully"}),201

    except Exception as e:
        db.rollback()
        return jsonify({"message":"Server error"}),500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()



@app.route('/superadmin/deleteadmin', methods=['DELETE'])
def delete_admin():
    access_token = request.cookies.get('access_token')
    if not access_token:
        return jsonify({"message": "No Token"}), 401

    decoded = decoded_token(access_token)
    if not decoded:
        return jsonify({"message": "Invalid or expired token"}), 401

    if decoded.get("role") != "superadmin":
        return jsonify({"message": "Forbidden: Super Admins only"}), 403

    
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"message": "Email is required"}), 400

    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)

   
        cursor.execute("SELECT role FROM loginusers WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"message": "User not found"}), 404

       
        if user["role"] != "admin":
            return jsonify({"message": "Only admins can be deleted"}), 400

        
        cursor.execute("DELETE FROM loginusers WHERE email = %s", (email,))
        db.commit()

        # Audit log: Admin deleted successfully
        # log_audit(decoded.get('email'), "DELETE_ADMIN", f"Deleted admin account {email}", "SUCCESS", "USER", email)

        return jsonify({"message": f"Admin with email {email} deleted successfully"}), 200

    except Exception as e:
        db.rollback()
        # Audit log: Failed to delete admin
        # log_audit(decoded.get('email'), "DELETE_ADMIN", f"Failed to delete admin: {str(e)}", "FAILED", "USER", email)
        return jsonify({"error": str(e)}), 500

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()




@app.route('/cancelbooking', methods=['POST'])
def cancel_booking():
    print(f"CANCEL BOOKING - Request received")
    access_token = request.cookies.get('access_token')
    if not access_token:
        print(f"CANCEL BOOKING - No access token")
        return jsonify({"message": "No Token"}), 401

    decoded = decoded_token(access_token)
    if not decoded:
        print(f"CANCEL BOOKING - Invalid token")
        return jsonify({"message": "Invalid or expired token"}), 401

    email = decoded.get('email')
    role = decoded.get('role')
    data = request.get_json()
    booking_id = data.get("booking_id")
    
    print(f"CANCEL BOOKING - User: {email}, Role: {role}, Booking ID: {booking_id}")

    if not booking_id:
        return jsonify({"message": "Booking ID is required"}), 400

    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)

        
        if role in ['admin', 'superadmin']:
            
            cursor.execute("SELECT * FROM bookings WHERE booking_id = %s", (booking_id,))
        else:
            
            cursor.execute("SELECT * FROM bookings WHERE booking_id = %s AND user_email = %s", 
                           (booking_id, email))
        
        booking = cursor.fetchone()
        if not booking:
            return jsonify({"message": "Booking not found"}), 404

        cursor.execute("UPDATE bookings SET status = %s WHERE booking_id = %s RETURNING *",
                        ("cancelled", booking_id))
        updated = cursor.fetchone()
        db.commit()


    
        # Audit log: Booking cancelled successfully
        # log_audit(email, "CANCEL_BOOKING", f"Cancelled booking {booking_id}", "SUCCESS", "BOOKING", str(booking_id))

        return jsonify({"message": "Booking cancelled", "booking": updated}), 200

    except Exception as e:
        db.rollback()
        # Audit log: Failed to cancel booking
        # log_audit(email, "CANCEL_BOOKING", f"Failed to cancel booking: {str(e)}", "FAILED", "BOOKING", str(booking_id))
        return jsonify({"message":"Server error"}), 500

    finally:
        if 'cursor' in locals(): 
            cursor.close()
        if 'db' in locals(): 
            db.close()




@app.route('/userdetails',methods=['GET'])
def userdetails():
    access_token = request.cookies.get('access_token')
    if not access_token:
        return jsonify({"message":"No Token was returned"}),401
        
    decoded = decoded_token(access_token)
    if not decoded:
        return jsonify({"message":"Invalid or expired token"}),401

    useremail = decoded.get('email')
    if not useremail:
        return jsonify({"message":"Invalid token payload"}),401

    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""select first_name,last_name,email,
                       role,phone from loginusers where email =%s """,
                       (useremail,))
        details = cursor.fetchone()
        
        if not details:
            return jsonify({"message":"User not found"}),404
        return jsonify(details),200
    
    except Exception as e:
        return jsonify({"message":"Server error"}),500
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()






@app.route('/change-password', methods=['POST'])
def change_profile():
    access_token = request.cookies.get('access_token')
    if not access_token:
        return jsonify({"message": "No Token was returned"}), 401

    decoded = decoded_token(access_token)
    if not decoded:
        return jsonify({"message": "Invalid or expired token"}), 401

    user_email = decoded.get('email')
    if not user_email:
        return jsonify({"message": "Invalid token payload"}), 401

    data = request.get_json() or {}

    
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    new_email = data.get('email')
    phone = data.get('phone')

    
    current_password = data.get('currentPassword') or data.get('current_password')
    new_password = data.get('newPassword') or data.get('new_password')
    confirm_password = data.get('confirmPassword') or data.get('confirm_password')

    change_password_flag = bool(new_password or confirm_password)

    if change_password_flag:
        if not current_password or not new_password:
            return jsonify({"message": "Current and new password are required"}), 400

        if confirm_password and new_password != confirm_password:
            return jsonify({"message": "New passwords do not match"}), 400

        if len(new_password) < 6:
            return jsonify({"message": "Password should be more than 6 characters"}), 400

    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)

        cursor.execute("SELECT email, password FROM loginusers WHERE email = %s", (user_email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "User not found"}), 404

    
        if new_email and new_email != user['email']:
            cursor.execute("SELECT 1 FROM loginusers WHERE email = %s", (new_email,))
            if cursor.fetchone():
                return jsonify({"message": "Email already in use"}), 400

        new_hashed = None
        if change_password_flag:
            stored_password = user['password'].encode('utf-8') if isinstance(user['password'], str) else user['password']

            if not bcrypt.checkpw(current_password.encode('utf-8'), stored_password):
                return jsonify({"message": "Current password is incorrect"}), 400

            new_hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        update_fields = []
        params = []

        if first_name is not None:
            update_fields.append("first_name = %s")
            params.append(first_name)
        if last_name is not None:
            update_fields.append("last_name = %s")
            params.append(last_name)
        if new_email is not None:
            update_fields.append("email = %s")
            params.append(new_email)
        if phone is not None:
            update_fields.append("phone = %s")
            params.append(phone)
        if new_hashed is not None:
            update_fields.append("password = %s")
            params.append(new_hashed)

        if not update_fields:
            return jsonify({"message": "No profile fields to update"}), 400

        update_sql = "UPDATE loginusers SET " + ", ".join(update_fields) + " WHERE email = %s"
        params.append(user_email)

        cursor.execute(update_sql, tuple(params))
        db.commit()

        return jsonify({"message": "Profile updated successfully"}), 200

    except psycopg2.Error:
        if 'db' in locals():
            db.rollback()
        return jsonify({"message": "Server error"}), 500

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()


 
@app.route('/user/history', methods=['GET'])
def user_history():
    access_token = request.cookies.get('access_token')
    if not access_token:
        return jsonify({"message": "No token provided"}), 401

    decoded = decoded_token(access_token)
    if not decoded:
        return jsonify({"message": "Invalid or expired token"}), 401

    user_email = decoded.get("email")
    if not user_email:
        return jsonify({"message": "Invalid token payload"}), 401

    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT booking_id, user_email, room_type, in_date, out_date, status, created_at
            FROM bookings 
            WHERE user_email = %s
            ORDER BY created_at DESC
        """, (user_email,))
        
        history = cursor.fetchall()

        return jsonify(history), 200

    except Exception as e:
        return jsonify({"message":"Server error"}), 500

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()




@app.route('/superadmin/list_admin', methods=['GET'])
def list_admins():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "No token provided"}), 401
        token = auth_header.split(' ')[1]
        decoded = decoded_token(token)

        if not decoded:
            return jsonify({"message": "Invalid token"}), 401
        email = decoded.get('email')

        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT role FROM loginusers WHERE email = %s", (email,))
        me = cursor.fetchone()
        if not me or me['role'] != 'superadmin':
            return jsonify({"message": "Unauthorized - SuperAdmin access required"}), 403

        cursor.execute("""
            SELECT id, first_name, last_name, email, role, last_login, status
            FROM loginusers
            WHERE role = 'admin'
            ORDER BY created_at DESC
        """)
        admins = cursor.fetchall()
        cursor.close(); db.close()
        return jsonify([
            {
                'id': a['id'],
                'name': f"{a['first_name']} {a['last_name']}",
                'email': a['email'],
                'permissions': a.get('permissions', []),
                'lastLogin': a.get('last_login'),
                'status': a.get('status','active')
            } for a in admins
        ])
    except Exception as e:
        return jsonify({"message": f"Error listing admins: {str(e)}"}), 500


@app.route('/payments',methods=['POST'])
def payments():
    access_token = request.cookies.get('access_token')
    if not access_token:
        return jsonify({"message":"No Token was returned"}),401

    decoded = decoded_token(access_token)
    if not decoded:
        return jsonify({"message":"No Token was returned"}),401

    data = request.get_json() or {}
    booking_data = data.get('bookingData') or {}
    payment_data = data.get('paymentData') or {}
    payment_method = data.get('paymentMethod')
    total_amount = data.get('totalAmount')

    missing_fields = []
    if not booking_data:
        missing_fields.append('bookingData')
    if not payment_method:
        missing_fields.append('paymentMethod')
    if total_amount is None:
        missing_fields.append('totalAmount')

    if missing_fields:
        return jsonify({"message": f"Required fields missing: {', '.join(missing_fields)}"}), 400

    user_email = decoded.get('email') or booking_data.get('email')

    in_date = booking_data.get('checkIn')
    out_date = booking_data.get('checkOut')
    room_type = booking_data.get('roomType')

    booking_status = 'pending' if payment_method == 'cash-front-desk' else 'confirmed'

    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            INSERT INTO bookings (user_email, room_type, in_date, out_date, status, created_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
            RETURNING booking_id, user_email, room_type, in_date, out_date, status, created_at
        """, (user_email, room_type, in_date, out_date, booking_status))
        booking = cursor.fetchone()

        method_description = None
        if payment_method == 'credit-card':
            card_number = (payment_data.get('cardNumber') or '').replace(' ', '')
            last4 = card_number[-4:] if len(card_number) >= 4 else ''
            method_description = f"Card **** {last4}" if last4 else 'Card'
        elif payment_method == 'paypal':
            paypal_email = payment_data.get('paypalEmail')
            method_description = f"PayPal ({paypal_email})" if paypal_email else 'PayPal'
        elif payment_method == 'mobile-money':
            carrier = payment_data.get('mobileCarrier') or 'Mobile Money'
            phone_number = payment_data.get('phoneNumber') or ''
            method_description = f"{carrier} {phone_number}".strip()
        elif payment_method == 'cash-front-desk':
            method_description = 'Cash at front desk'
        else:
            method_description = payment_method

        payment_status = 'pending' if payment_method == 'cash-front-desk' else 'completed'

        cursor.execute("""
            INSERT INTO payments (booking_id, user_email, amount, payment_method, status, created_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
            RETURNING payment_id, booking_id, user_email, amount, payment_method, status, created_at
        """, (booking['booking_id'], user_email, total_amount, method_description, payment_status))
        payment = cursor.fetchone()

        db.commit()

        return jsonify({
            "message": "Payment processed successfully",
            "booking": booking,
            "payment": payment
        }), 201
    except psycopg2.Error as e:
        if 'db' in locals():
            db.rollback()
        return jsonify({"message": "Server error", "error": str(e)}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()




if __name__ == '__main__':
    app.run(debug=True)
