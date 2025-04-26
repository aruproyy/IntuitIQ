from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from apps.calculator.imageRoute import image_router, image_history_router
from apps.calculator.textRoute import text_router, text_history_router
from constants import SERVER_URL, PORT, ENV

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://intuitiq-v2.netlify.app/",  # Your Netlify URL
        "http://localhost:3000",                  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
async def root():
    return {"message": "Server is running"}

app.include_router(image_router, prefix="/image_calculate", tags=["image"])
app.include_router(image_history_router, prefix="/image_history", tags=["image_history"])
app.include_router(text_router, prefix="/text_calculate", tags=["text"])
app.include_router(text_history_router, prefix="/text_history", tags=["text_history"])

# if __name__ == "__main__":
#     uvicorn.run("main:app", host=SERVER_URL, port=int(PORT), reload=(ENV == "dev"))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=False)