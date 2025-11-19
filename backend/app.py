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
        return jsonify({"message":"Missing Data,400"})    

    


if __name__ == '__main__':
    app.run(debug=True)