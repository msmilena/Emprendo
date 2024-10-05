from pydantic import BaseModel


class EntrepreneurInput(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    image: str

class EntrepreneurOutput(BaseModel):
    id: str
    name: str
    description: str
    price: float
    stock: int
    image: str
