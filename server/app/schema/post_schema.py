from pydantic import BaseModel


class PostBase(BaseModel):
    title: str
    content: str
    interest_id: int

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None

class Post(PostBase):
    id: int
    author_id: int

    class Config:
        orm_mode = True

