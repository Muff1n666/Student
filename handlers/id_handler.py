from telegram import Update
from telegram.ext import ContextTypes
import logging

logger = logging.getLogger(__name__)

async def my_id_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Показать Telegram ID"""
    user = update.effective_user
    
    message = (
        f"👤 Твой Telegram ID:\n"
        f"`{user.id}`\n\n"
        f"Используй этот ID в ссылке:\n"
        f"`http://localhost:3000/?user_id={user.id}`"
    )
    
    await update.message.reply_text(message, parse_mode='Markdown')