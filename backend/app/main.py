import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

load_dotenv()

app = FastAPI(title="Interview From Hell API", version="1.0.0")

raw_origins = os.getenv("CORS_ORIGINS", "*")
origins = ["*"] if raw_origins.strip() == "*" else [o.strip() for o in raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
