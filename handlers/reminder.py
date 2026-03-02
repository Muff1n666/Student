from telegram import Update
from telegram.ext import ContextTypes
from database.db import SessionLocal
from database.models import Note, User
from datetime import date, timedelta
import logging

logger = logging.getLogger(__name__)

async def check_tomorrow_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /tomorrow - показывает заметки на завтра"""
    user = update.effective_user
    
    db = SessionLocal()
    try:
        #Поиск пользователя в БД
        db_user = db.query(User).filter(User.telegram_id == user.id).first()
        
        if not db_user:
            await update.message.reply_text("❌ Ты еще не зарегистрирован. Напиши /start")
            return
        
        #Ищем заметки, запланированные на завтра
        tomorrow = date.today() + timedelta(days=1)
        notes = db.query(Note).filter(
            Note.user_id == db_user.id,
            Note.note_date == tomorrow
        ).all()
        
        if not notes:
            await update.message.reply_text("📭 На завтра у тебя нет запланированных дел!")
            return
        
        #Формируем ответное сообщение со списком дел
        message = "📋 Твои дела на завтра:\n\n"
        for note in notes:
            emoji = "📚" if note.type == "homework" else "✍️"
            message += f"{emoji} *{note.title}*\n"
            message += f"   {note.content}\n\n"
        
        await update.message.reply_text(message, parse_mode='Markdown')
        
    finally:
        db.close()