from telegram import Update
from telegram.ext import ContextTypes
import logging

logger = logging.getLogger(__name__)

async def link_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Показать пользователю его Telegram ID для привязки в приложении"""
    user = update.effective_user

    await update.message.reply_text(
        f"🔗 Привязка Telegram к приложению\n\n"
        f"Ваш Telegram ID: <code>{user.id}</code>\n\n"
        f"Скопируйте этот ID и вставьте его в:\n"
        f"Приложение → Настройки → Привязка Telegram",
        parse_mode='HTML'
    )
