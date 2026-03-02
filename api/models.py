from pydantic import BaseModel
from datetime import date
from typing import Optional

class NoteBase(BaseModel):
    title: str
    type: str
    content: str
    note_date: date

class NoteCreate(NoteBase):
    telegram_id: int  

class NoteResponse(NoteBase):
    id: int
    notified: bool
    
    class Config:
        orm_mode = True