import bcrypt
import psycopg2
import jwt
from datetime import datetime 
import os
import json
import requests
from flask_cors import CORS
from psycopg2 import RealDictCursor


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
        return jsonify({"message":"Account created successfully","status":success}),201
    
    
    
    
    except psycopg2.Error as e:
        return jsonify({"message":"Server is down","status":error}),500
    finally:
        cursor.close()
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

if __name__ == '__main__':
    app.run(debug=True)