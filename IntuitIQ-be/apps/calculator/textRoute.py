from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from apps.calculator.textUtils import analyze_text
from pymongo import MongoClient
from datetime import datetime
from pytz import timezone
import os
import dotenv
from bson import ObjectId

dotenv.load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["intuitiq"]
collection = db["text_io_history"]

text_router = APIRouter()
text_history_router = APIRouter()

class TextData(BaseModel):
    user_id: str
    question: str

@text_router.post("")
async def solve_text_problem_route(data: TextData):
    try:
        question = data.question.strip()
        if not question:
            raise HTTPException(status_code=400, detail="Question cannot be empty")
        responses = analyze_text(question)
        record = {
            "user_id": data.user_id,
            "input": question,
            "responses": responses,
            "date": datetime.now(timezone("Asia/Kolkata")).strftime("%d/%m/%Y %H:%M:%S"),
        }
        collection.insert_one(record)
        return {
            "message": "Text problem solved successfully",
            "data": responses,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@text_history_router.get("")
async def get_history(user_id: str = Query(...)):
    try:
        history = list(collection.find({"user_id": user_id },{"_id": 1, "input": 1, "responses": 1, "date": 1}))
        if not history:
            raise HTTPException(status_code=404, detail="No history found for this user")
        for entry in history:
            entry["_id"] = str(entry["_id"])
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@text_history_router.delete("/{entry_id}")
async def delete_history_entry(entry_id: str):
    try:
        result = collection.delete_one({"_id": ObjectId(entry_id)})        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Entry not found")            
        return {"message": "Entry deleted successfully"}    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@text_history_router.delete("/user/{user_id}")
async def delete_all_user_text_history(user_id: str):
    try:
        result = collection.delete_many({"user_id": user_id})
        return {"message": f"Deleted {result.deleted_count} image history entries"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))