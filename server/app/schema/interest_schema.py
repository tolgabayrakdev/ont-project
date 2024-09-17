from pydantic import BaseModel

class InterestCreate(BaseModel):
    id: int
    name: str
    

class InterestUpdate(BaseModel):
    id: int
    name: str
