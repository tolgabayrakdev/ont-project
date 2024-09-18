from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import model
from fastapi.staticfiles import StaticFiles

from app.routes import auth_router, user_router, interest_router, post_router

model.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["http://ont-project-demo-v1.vercel.app", "https://ont-project-demo-v1.vercel.app"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")

app.include_router(router=auth_router.router, prefix="/api/v1/auth")
app.include_router(router=user_router.router, prefix="/api/v1/user")
app.include_router(router=interest_router.router, prefix="/api/v1/interest")
app.include_router(router=post_router.router, prefix="/api/v1/post")


@app.get("/")
def index():
    return {"message": "Hello World"}
