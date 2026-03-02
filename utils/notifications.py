from database.db import SessionLocal
from database.models import Note, User
from datetime import date, timedelta, datetime
from telegram import Bot
from config import BOT_TOKEN
import asyncio
import logging

logger = logging.getLogger(__name__)

async def send_note_created_notification(telegram_id: int, note_title: str, note_date: date):
    """Отправляет уведомление о создании заметки"""
    bot = Bot(token=BOT_TOKEN)
    
    message = (
        f"✅ Новая заметка создана!\n\n"
        f"📌 {note_title}\n"
        f"📅 {note_date.strftime('%d.%m.%Y')}\n\n"
        f"Я напомню тебе о ней накануне вечером!"
    )
    
    try:
        await bot.send_message(chat_id=telegram_id, text=message)
        logger.info(f"Уведомление о создании отправлено пользователю {telegram_id}")
    except Exception as e:
        logger.error(f"Ошибка отправки уведомления о создании: {e}")

async def send_reminder_notification(telegram_id: int, note_title: str, note_content: str, note_date: date):
    """Отправляет напоминание о заметке за день"""
    bot = Bot(token=BOT_TOKEN)
    
    message = (
        f"⏰ Напоминание на завтра!\n\n"
        f"📌 {note_title}\n"
        f"📝 {note_content}\n"
        f"📅 {note_date.strftime('%d.%m.%Y')}\n\n"
        f"Не забудь подготовиться! ✨"
    )
    
    try:
        await bot.send_message(chat_id=telegram_id, text=message)
        logger.info(f"Напоминание отправлено пользователю {telegram_id} для заметки {note_title}")
    except Exception as e:
        logger.error(f"Ошибка отправки напоминания: {e}")

async def check_and_send_reminders():
    """Проверяет заметки на завтра и отправляет напоминания (в 23:00)"""
    db = SessionLocal()
    
    try:
        tomorrow = date.today() + timedelta(days=1)
        
        #Заметки на завтра, по которым еще не отправляли напоминание
        notes = db.query(Note).filter(
            Note.note_date == tomorrow,
            Note.notified == False
        ).all()
        
        for note in notes:
            #Находим владельца заметки
            user = db.query(User).filter(User.id == note.user_id).first()
            
            if user and user.chat_id:
                await send_reminder_notification(
                    telegram_id=user.chat_id,
                    note_title=note.title,
                    note_content=note.content,
                    note_date=note.note_date
                )
                
                #Помечаем заметку как уведомленную
                note.notified = True
                db.commit()
    
    finally:
        db.close()

#Проверка и запуск напоминаний пользователю в 23:00
async def reminder_scheduler():
    while True:
        now = datetime.now()
        
        #В 23:00 запускаем рассылку напоминаний на завтра
        if now.hour == 23 and now.minute == 0:
            logger.info("Запуск плановой рассылки напоминаний на завтра")
            await check_and_send_reminders()
            #Пауза, чтобы не сработать дважды в одну минуту
            await asyncio.sleep(61)
        else:
            #В остальное время достаточно проверки раз в час
            await asyncio.sleep(3600)