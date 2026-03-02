from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from datetime import date
import asyncio

from database.db import get_db
from database import models
from api import models as api_models
from utils.notifications import send_note_created_notification

router = APIRouter()

@router.options("/notes/{note_id}")
async def options_note():
    """Обработка preflight запросов для CORS"""
    return JSONResponse(content={}, headers={
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    })

@router.post("/notes/", response_model=api_models.NoteResponse)
async def create_note(note: api_models.NoteCreate, db: Session = Depends(get_db)):
    """Создать новую заметку"""
    print(f"🔵 ПОЛУЧЕН ЗАПРОС НА СОЗДАНИЕ ЗАМЕТКИ:")
    print(f"  Telegram ID: {note.telegram_id}")
    print(f"  Заголовок: {note.title}")
    print(f"  Дата: {note.note_date}")
    
    user = db.query(models.User).filter(
        models.User.telegram_id == note.telegram_id
    ).first()
    
    if not user:
        print(f"❌ Пользователь с Telegram ID {note.telegram_id} НЕ НАЙДЕН в БД!")
        raise HTTPException(
            status_code=404, 
            detail=f"Пользователь с Telegram ID {note.telegram_id} не найден"
        )
    
    print(f"✅ Пользователь найден: {user.first_name}")
    
    db_note = models.Note(
        title=note.title,
        type=note.type,
        content=note.content,
        note_date=note.note_date,
        user_id=user.id
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    
    print(f"✅ Заметка создана с ID: {db_note.id}")
    
    return db_note

@router.get("/notes/", response_model=List[api_models.NoteResponse])
async def get_notes(telegram_id: int, db: Session = Depends(get_db)):
    """Получить все заметки пользователя"""
    print(f"🔵 ЗАПРОС НА ПОЛУЧЕНИЕ ЗАМЕТОК для Telegram ID: {telegram_id}")
    
    user = db.query(models.User).filter(models.User.telegram_id == telegram_id).first()
    
    if not user:
        print(f"❌ Пользователь с Telegram ID {telegram_id} НЕ НАЙДЕН!")
        return []
    
    notes = db.query(models.Note).filter(models.Note.user_id == user.id).all()
    print(f"Найдено заметок: {len(notes)}")
    
    return notes

@router.delete("/notes/{note_id}")
async def delete_note(note_id: int, telegram_id: int, db: Session = Depends(get_db)):
    """Удалить заметку"""
    print(f"🔵 ЗАПРОС НА УДАЛЕНИЕ ЗАМЕТКИ {note_id} для пользователя {telegram_id}")
    
    user = db.query(models.User).filter(models.User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    note = db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == user.id
    ).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Заметка не найдена")
    
    db.delete(note)
    db.commit()
    
    print(f"✅ Заметка {note_id} удалена")
    return {"message": "Заметка удалена"}

@router.get("/debug/users")
async def debug_users(db: Session = Depends(get_db)):
    """Отладочный эндпоинт - показывает всех пользователей"""
    users = db.query(models.User).all()
    return [
        {
            "id": u.id,
            "telegram_id": u.telegram_id,
            "first_name": u.first_name,
            "chat_id": u.chat_id
        }
        for u in users
    ]