
from email.errors import MissingHeaderBodySeparatorDefect
import resource

from psycopg2.extensions import cursor
from werkzeug.datastructures import Authorization

from flask import Flask,jsonify,request 
import bcrypt
import psycopg2
import jwt
from datetime import datetime 
import os
import json
import requests
from flask_cors import CORS
from psycopg2 import RealDictCursor
from datetime import datetime,timedelta
from helper.generate_token import generate_access_token,generate_refresh_token,decoded_token


app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY","SECRET_KEY")

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

@app.route('/signup',methods=['POST'])
def signup():
    if not request.is_json:
        return jsonify({"message":"Request must be JSON","status":400})    

    data=request.get_json()
    firstname = data.get_json("firstname")
    lastname = data.get_json("lastname")
    email = data.get_json("email")
    password = data.get_json("password")

    if len(password) < 6:
        return jsonify({"message":"Password should be more than 6 characters","status":error}),400
    
    repassword = request.get_json("repassword")
    if repassword != password:
        return jsonify({"message":"Passwords do not match","status":error}),400

    if not all([firstname,lastname,email,password,repassword]):
        return jsonify({"message":"All fields are required","status":error,"user":None}),400
    
    try:
        hashed = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt()).decode('utf-8')
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)

        cursor.execute("select email from login where email = %s ",(email,))
        if cursor.fetchone():
            return jsonify({"message":"Account already exist","status":error}),400

        cursor.execute("INSERT INTO users (firstname,lastname,email,password) VALUES (%s,%s,%s,%s)",(firstname,lastname,email,hashed))
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
        return jsonify({"message":"Server is down","status":error}),500
    finally:
        if 'cursor'in locals:
            cursor.close()
        if 'db' in locals:
             db.close()
    

@app.route('login',methods=['POST'])
def login():
    if not requests.is_json:
        return jsonify({"message":"All fields are required","status":"error"}),404
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not all ([email,password]):
        return jsonify({"message":"All fields are required","status":"error"}),400

    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("select passwords,role,email from loginusers where email = %s,")
        user = cursor.fetchone()

        if not user:
            return jsonify({"message":"Account not found","status":"error"}),404
            
        hashedpassword = user['passwords'].encode('utf-8') if isinstance (user['passwords'],str) else user['passwords']

        if not bcrypt.checkpw(password.encode('utf-8'),hashedpassword):
            return jsonify({"message":"Password incorrect","status":"error"}),404

        role = user.get('role','user')

        
        try:
            cursor.execute("""
                UPDATE login_users SET last_login = NOW()
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

    decoded = decode_token(access_token)
    if not decoded:
        return jsonify({"message": "Invalid token", "user": None}), 401

    email = decoded.get('email')
    db = database_connection()
    cursor = db.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT first_name, last_name, email,role FROM login_users WHERE email = %s", (email,))
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

    decoded = decode_token(refresh_token, is_refresh=True)
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
    
    decoded = decoded_token(decoded_token)
    if not decoded:
        return jsonify({"message":"Invalid or Expired Token"})

    user_email = decoded.get('email')
    if not user_email:
        return jsonify({"messaage":"Account not found"}),401

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


    missing_field = []

    if not first_name:missing_field.append("first_name")
    if not last_name:missing_field.append("last_name")
    if not email:missing_field.append("email")
    if not phone:missing_field.append("phone")
    if not adults:missing_field.append("adults")
    if not children:missing_field.append("children")
    if not rooms:missing_field.append("rooms")
    if not room_type:missing_field.append("room_type")
    if not in_date:missing_field.append("in_date")
    if not out_date:missing_field.append("out_date")

    if missing_fields:
        return jsonify({"message":f"Required fields missing: {',  '.join(missing_field)}"}),400

    """user name 
        To be like the account info on top with let say an image 
        or something """

    
    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("select room_id,room,roomtype, ")






    except psycopg2.Error as e:
        return jsonify({f"message":"Something happened Server Down."
                        "We are trying to resolve it ","error":str(e),}),500

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

        if cursor.execute.fetchone():
            return jsonify({"message":"Account already exist"}),401

        hashed_password = bcrypt.hashpw(password.encode('UTF-8'),bcrypt.gensalt()).decode('UTF-8')

        cursor.execute("""insert into loginusers (first_name,last_name,email,passwords,role)
                    values(%s,%s,%s,%s,%s)""",
        (first_name,last_name,email,password,"admin"))
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

        # Log audit
        log_audit(decoded.get('email'), "DELETE_ADMIN", f"Deleted admin account {email}", "SUCCESS", "USER", email)

        return jsonify({"message": f"Admin with email {email} deleted successfully"}), 200

    except Exception as e:
        db.rollback()
        log_audit(decoded.get('email'), "DELETE_ADMIN", f"Failed to delete admin: {str(e)}", "FAILED", "USER", email)
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


    
        log_audit(
            user_email, 
            "CANCEL_BOOKING", 
            f"Cancelled booking {booking_id}", 
            "SUCCESS", 
            "BOOKING", 
            str(booking_id)
        )

        return jsonify({"message": "Booking cancelled", "booking": updated}), 200

    except Exception as e:
        db.rollback()
        log_audit(user_email, "CANCEL_BOOKING", f"Failed to cancel booking: {str(e)}", "FAILED", "BOOKING", str(booking_id))
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
        return jsonify({"message":"No Token was returned"}),401
        
    useremail = request.args.get('email')
    if not useremail:
        return jsonify({"message":"Email required"}),400
    
   
    
    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""select first_name,last_name,email,
                       role from loginusers where email =%s """,
                       (email,))
        details = cursor.fetchone()
        
        if not details:
            return jsonify({"message":"Something Happened"}),404
        return jsonify(details),200
    
    except Exception as e:
        return jsonify({"message":"Server error"}),500
    
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
            SELECT 
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


if __name__ == '__main__':
    app.run(debug=True)
