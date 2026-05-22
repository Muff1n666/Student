from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import uuid4

from database.db import get_db
from database import models
from api import models as api_models
from api.auth import hash_password, verify_password, create_access_token, get_current_user
from utils.notifications import send_note_created_notification

router = APIRouter()


@router.post("/auth/register", response_model=api_models.TokenResponse)
async def register(data: api_models.RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        email=data.email,
        password_hash=hash_password(data.password),
        first_name=data.first_name or data.email.split("@")[0],
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return api_models.TokenResponse(
        access_token=token,
        user=api_models.UserResponse.model_validate(user),
    )


@router.post("/auth/guest", response_model=api_models.TokenResponse)
async def guest_login(db: Session = Depends(get_db)):
    guest_id = str(uuid4())[:8]
    user = models.User(
        first_name=f"Guest_{guest_id}",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(user.id)
    return api_models.TokenResponse(
        access_token=token,
        user=api_models.UserResponse.model_validate(user),
    )


@router.post("/auth/login", response_model=api_models.TokenResponse)
async def login(data: api_models.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user.id)
    return api_models.TokenResponse(
        access_token=token,
        user=api_models.UserResponse.model_validate(user),
    )


@router.get("/auth/me", response_model=api_models.UserResponse)
async def get_me(current_user: models.User = Depends(get_current_user)):
    return api_models.UserResponse.model_validate(current_user)


@router.put("/auth/link-telegram", response_model=api_models.UserResponse)
async def link_telegram(
    data: api_models.LinkTelegramRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(models.User).filter(models.User.telegram_id == data.telegram_id).first()
    if existing and existing.id != current_user.id:
        raise HTTPException(status_code=400, detail="Telegram ID already linked to another account")

    current_user.telegram_id = data.telegram_id
    db.commit()
    db.refresh(current_user)
    return api_models.UserResponse.model_validate(current_user)


@router.get("/notes/", response_model=List[api_models.NoteResponse])
async def get_notes(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notes = db.query(models.Note).filter(models.Note.user_id == current_user.id).all()
    return notes


@router.post("/notes/", response_model=api_models.NoteResponse)
async def create_note(
    note: api_models.NoteCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_note = models.Note(
        title=note.title,
        type=note.type,
        content=note.content,
        note_date=note.note_date,
        user_id=current_user.id,
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)

    if current_user.telegram_id:
        await send_note_created_notification(
            telegram_id=current_user.telegram_id,
            note_title=db_note.title,
            note_date=db_note.note_date,
        )

    return db_note


@router.delete("/notes/{note_id}")
async def delete_note(
    note_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == current_user.id,
    ).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}


@router.get("/debug/users")
async def debug_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "telegram_id": u.telegram_id,
            "first_name": u.first_name,
            "chat_id": u.chat_id,
        }
        for u in users
    ]
