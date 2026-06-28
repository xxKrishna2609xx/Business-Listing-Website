from pydantic import BaseModel

class UserRegister(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UpdateProfile(BaseModel):
    name: str
    phone: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str