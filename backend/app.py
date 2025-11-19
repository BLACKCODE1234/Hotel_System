import bcrypt
import psycopg2
import jwt
from datetime import datetime 
import os
import json
import requests
from flask_cors import CORS
from psycopg2 import RealDictCursor


@app.route('/signup',methods=['POST'])
def signup():
    
    if not request.is_json:

        return jsonify({"message":"Request must be JSON","status":400})    

    data=request.get_json()
    firstname = request.get_json("firstname")
    lastname - request.get_json("lastname")
    email = request.get_json("email")
    password = request.get_json("password")

    if len(password) < 6:
        return jsonify({"message":"Password should be more than 6 characters","status":error}),400
    
    repassword = request.get_json("repassword")
    if repassword != password:
        return jsonify({"message":"Passwords do not match","status":error}),400

    if not all([firstname,lastname,email,password,repassword]):
        return jsonify({"message":"All fields are required","status":error,"user":None}),400
    



if __name__ == '__main__':
    app.run(debug=True)