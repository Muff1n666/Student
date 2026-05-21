from pydantic import BaseModel, model_validator
from datetime import date
from typing import Optional


class NoteBase(BaseModel):
    title: str
    type: str
    content: str
    note_date: date


class NoteCreate(NoteBase):
    pass


class NoteResponse(NoteBase):
    id: int
    notified: bool

    class Config:
        from_attributes = True


class RegisterRequest(BaseModel):
    email: str
    password: str
    first_name: str = ""


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    id: int
    email: Optional[str] = None
    first_name: Optional[str] = None
    telegram_id: Optional[int] = None
    telegram_linked: bool = False

    @model_validator(mode="before")
    @classmethod
    def set_telegram_linked(cls, data):
        if isinstance(data, dict):
            data["telegram_linked"] = bool(data.get("telegram_id"))
        else:
            data.telegram_linked = bool(data.telegram_id)
        return data

    class Config:
        from_attributes = True


class LinkTelegramRequest(BaseModel):
    telegram_id: int
