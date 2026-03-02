from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from database.db import SessionLocal
from database.models import User
import logging

logger = logging.getLogger(__name__)

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /start"""
    user = update.effective_user
    
    #Регистрируем пользователя в БД, если его еще нет
    db = SessionLocal()
    try:
        db_user = db.query(User).filter(User.telegram_id == user.id).first()
        
        if not db_user:
            db_user = User(
                telegram_id=user.id,
                username=user.username,
                first_name=user.first_name,
                chat_id=update.effective_chat.id
            )
            db.add(db_user)
            db.commit()
            logger.info(f"Новый пользователь зарегистрирован: {user.first_name} (ID: {user.id})")
            
            await update.message.reply_text(
                f"👋 Привет, {user.first_name}!\n\n"
                f"Ты успешно зарегистрирован в системе!\n\n"
                f"📋 Открой веб-приложение по ссылке:\n"
                f"http://localhost:3000/?user_id={user.id}\n\n"
                f"Скопируй эту ссылку в браузер и добавь в закладки!"
            )
        else:
            await update.message.reply_text(
                f"👋 С возвращением, {user.first_name}!\n\n"
                f"📋 Твоя ссылка на приложение:\n"
                f"http://localhost:3000/?user_id={user.id}"
            )
        
    except Exception as e:
        logger.error(f"Ошибка при регистрации пользователя: {e}")
        await update.message.reply_text(
            f"👋 Привет, {user.first_name}!\n"
            f"Произошла ошибка, но ты все равно можешь пользоваться ботом."
        )
    finally:
        db.close()