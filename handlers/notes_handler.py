from telegram import Update
from telegram.ext import ContextTypes
from database.db import SessionLocal
from database.models import Note, User
from datetime import date, timedelta
import logging

logger = logging.getLogger(__name__)

async def my_notes_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Показать все заметки"""
    user = update.effective_user
    
    db = SessionLocal()
    try:
        db_user = db.query(User).filter(User.telegram_id == user.id).first()
        
        if not db_user:
            await update.message.reply_text("❌ Сначала напиши /start")
            return
        
        notes = db.query(Note).filter(Note.user_id == db_user.id).all()
        
        if not notes:
            await update.message.reply_text("📭 У тебя пока нет заметок")
            return
        
        message = "📋 Твои заметки:\n\n"
        for note in notes:
            emoji = "📚" if note.type == "homework" else "✍️"
            date_str = note.note_date.strftime("%d.%m.%Y")
            message += f"{emoji} *{note.title}* - {date_str}\n"
            message += f"   {note.content[:50]}...\n\n"
        
        await update.message.reply_text(message, parse_mode='Markdown')
        
    finally:
        db.close()

async def notes_today_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Показать заметки на сегодня"""
    user = update.effective_user
    
    db = SessionLocal()
    try:
        db_user = db.query(User).filter(User.telegram_id == user.id).first()
        
        if not db_user:
            await update.message.reply_text("❌ Сначала напиши /start")
            return
        
        today = date.today()
        notes = db.query(Note).filter(
            Note.user_id == db_user.id,
            Note.note_date == today
        ).all()
        
        if not notes:
            await update.message.reply_text("✅ На сегодня дел нет!")
            return
        
        message = "📋 Дела на сегодня:\n\n"
        for note in notes:
            emoji = "📚" if note.type == "homework" else "✍️"
            message += f"{emoji} *{note.title}*\n"
            message += f"   {note.content}\n\n"
        
        await update.message.reply_text(message, parse_mode='Markdown')
        
    finally:
        db.close()

async def stats_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Показать статистику"""
    user = update.effective_user
    
    db = SessionLocal()
    try:
        db_user = db.query(User).filter(User.telegram_id == user.id).first()
        
        if not db_user:
            await update.message.reply_text("❌ Сначала напиши /start")
            return
        
        total = db.query(Note).filter(Note.user_id == db_user.id).count()
        homework = db.query(Note).filter(
            Note.user_id == db_user.id, 
            Note.type == 'homework'
        ).count()
        tests = db.query(Note).filter(
            Note.user_id == db_user.id, 
            Note.type == 'test'
        ).count()
        
        upcoming = db.query(Note).filter(
            Note.user_id == db_user.id,
            Note.note_date >= date.today()
        ).count()
        
        message = (
            f"📊 *Статистика*\n\n"
            f"Всего заметок: {total}\n"
            f"📚 ДЗ: {homework}\n"
            f"✍️ Тестов: {tests}\n"
            f"🔜 Предстоящих: {upcoming}"
        )
        
        await update.message.reply_text(message, parse_mode='Markdown')
        
    finally:
        db.close()