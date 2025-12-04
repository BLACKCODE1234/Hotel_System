from flask import Flask,jsonify
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

def database_connection():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="",
            user="",
            password=""
        )
        return conn
    except psycopg2.Error as e:
        return jsonify({"message":"Server is down","status":error}),500

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
        cursor.execute("select hashpassword,role,email from login_users where email = %s,")
        user = cursor.fetchone()

        if not user:
            return jsonify({"message":"Account not found","status":"error"}),404
            
        hashedpassword = user['hashpassword'].encode('utf-8') if isinstance (user['hashpassword'],str) else user['hashpassword']

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

    except psycopg2.Error as e:
        return jsonify({"message":"Server is down","status":"error"}),500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()



@app.route('/logout',methods=['POST'])
def logout():
    pass



@app.route('/me',methods=['POST'])
def me():
    pass


@app.route('/refresh',methods=['POST'])
def refresh():
    pass
    


if __name__ == '__main__':
    app.run(debug=True)