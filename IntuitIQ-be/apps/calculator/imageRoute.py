from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
import base64
from io import BytesIO
from apps.calculator.imageUtils import analyze_image
from PIL import Image
from pymongo import MongoClient
from datetime import datetime
from pytz import timezone
import os
import dotenv
from bson import ObjectId

dotenv.load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["intuitiq"]
collection = db["image_io_history"]

image_router = APIRouter()
image_history_router = APIRouter()

class ImageData(BaseModel):
    user_id: str
    image: str
    dict_of_vars: dict

@image_router.post("")
async def run(data: ImageData):
    try:
        image_data = base64.b64decode(data.image.split(",")[1])
        image_bytes = BytesIO(image_data)
        image = Image.open(image_bytes)
        responses = analyze_image(image, dict_of_vars=data.dict_of_vars)
        record = {
            "user_id": data.user_id,
            "image": data.image,
            "dict_of_vars": data.dict_of_vars,
            "responses": responses,
            "date": datetime.now(timezone("Asia/Kolkata")).strftime("%d/%m/%Y %H:%M:%S")
        }
        collection.insert_one(record)
        return {
            "message": "Image processed",
            "data": responses,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@image_history_router.get("")
async def get_history(user_id: str = Query(...)):
    try:
        history = list(collection.find({"user_id": user_id}, {"_id": 1, "image": 1, "dict_of_vars": 1, "responses": 1, "date": 1}))
        if not history:
            raise HTTPException(status_code=404, detail="No history found for this user")
        for entry in history:
            entry["_id"] = str(entry["_id"])
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@image_history_router.delete("/{entry_id}")
async def delete_history_entry(entry_id: str):
    try:
        result = collection.delete_one({"_id": ObjectId(entry_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Entry not found")
        return {"message": "Entry deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@image_history_router.delete("/user/{user_id}")
async def delete_all_user_image_history(user_id: str):
    try:
        result = collection.delete_many({"user_id": user_id})
        return {"message": f"Deleted {result.deleted_count} image history entries"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))