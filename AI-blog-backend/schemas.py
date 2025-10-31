from pydantic import BaseModel

class BlogCreate(BaseModel):
    title: str
    content: str
    tags: str = ""

class BlogResponse(BaseModel):
    id: int
    title: str
    content: str
    tags: str

    class Config:
        orm_mode = True
