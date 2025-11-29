import email
import jwt
import os
import datetime


def generate_access_token(email,role='user'):
    payload ={
        'email':email,
        'role':role,
        'exp':datetime.datetime.utcnow() + datetime.timedelta(minutes=int(os.getenv('ACCESS_TOKEN_EXPIRES_MINUTES',15))),
        'iat':datetime.datetime.utcnow()
    }
    token = jwt.encode(payload,os.getenv('JWT_KEY'),algorithm='HS256')
    return token


def generate_refresh_token(email,role-'user'):
    payload = {
        'email':email,
        'role':role,
        'exp':datetime.datetime.utcnow() + datetime.timedelta
    }