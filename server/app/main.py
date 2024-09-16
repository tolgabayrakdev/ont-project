from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import model
from fastapi.staticfiles import StaticFiles

from app.routes import auth_router

model.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["http://localhost:5173", "https://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(router=auth_router.router, prefix="/api/v1/auth")


@app.get("/")
def index():
    return {"message": "Hello World"}
