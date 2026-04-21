import logging
import asyncio
import threading
from telegram.ext import Application, CommandHandler
from config import BOT_TOKEN
from handlers.start_handler import start_command
from handlers.notes_handler import my_notes_command
from utils.notifications import reminder_scheduler

#Логирование
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

#Функция запуска планировщика уведомлений
def start_scheduler():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(reminder_scheduler())

#Главная функция
def main():
    logger.info("🚀 Запуск Telegram бота...")
    
    #Запуск планировщика уведомлений в отдельном потоке
    scheduler_thread = threading.Thread(target=start_scheduler, daemon=True)
    scheduler_thread.start()
    logger.info("⏰ Планировщик напоминаний запущен")
    
    #Создаем приложение Telegram‑бота
    application = Application.builder().token(BOT_TOKEN).build()
    
    #Регистрирация команд бота
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("mynotes", my_notes_command))
    
    #Запуск основного цикл обработки сообщений
    logger.info("🤖 Бот запущен...")
    application.run_polling(allowed_updates=["message"])

if __name__ == "__main__":
    main()