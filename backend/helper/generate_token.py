import email
import jwt
import os
import datetime


def generate_access_token(email):
    payload ={
        'email':email,
        'exp':datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    }