from pydantic import BaseModel, EmailStr




class UserSignup(BaseModel):
    firstname: str 
    lastname:str
    email:EmailStr
    password:str
    confirmpassword:str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OTPVerify(BaseModel):
    email: str
    otp: str
    
class OTPRequest(BaseModel):
    email: str
    
    
class StaffLogin(BaseModel):
    staff_id:str
    password: str
    
    
class AdminLogin(BaseModel):
    admin_id:str    
    password: str