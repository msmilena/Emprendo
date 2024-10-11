from pydantic import BaseModel

class UserInput(BaseModel):
    name: str
    lastName:str
    email: str
    password: str
    tipo: str

class UserOutput(BaseModel):
    id: str
    name: str
    lastName:str
    email: str
    tipo: str

class UserLoginInput(BaseModel):
    email: str
    password: str
