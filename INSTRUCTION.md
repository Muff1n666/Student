# Инструкция по запуску проекта Студентик

## Требования

- Python >= 3.10
- Node.js >= 18.0
- npm >= 9.0
- Telegram бот (токен получаем у @BotFather)

## Структура проекта

```
D:\Task_bot\
├── main.py              # Telegram бот
├── run_api.py          # FastAPI сервер
├── config.py         # Конфигурация
├── database\        # База данных SQLite
├── handlers\       # Обработчики команд бота
├── utils\          # Утилиты (уведомления)
├── mini-app\       # React веб-приложение
└── study_planner.db # Файл базы данных
```

## Установка зависимостей

### 1. Установка Python зависимостей

```cmd
pip install python-telegram-bot>=20.0 fastapi>=0.100.0 sqlalchemy>=2.0.0 uvicorn>=0.23.0 pydantic>=2.0.0 python-dotenv>=1.0.0
```

### 2. Установка Node.js зависимостей

```cmd
cd D:\Task_bot\mini-app
npm install
```

## Настройка

### Создайте файл .env в корне проекта

```
BOT_TOKEN=your_telegram_bot_token_here
```

Получить токен можно у @BotFather в Telegram.

## Запуск

### Вариант 1: Полный запуск (разработка)

Откройте **4 отдельных терминала**:

**Терминал 1 - API сервер:**
```cmd
cd D:\Task_bot
python run_api.py
```

**Терминал 2 - ngrok (туннель для внешнего доступа):**
```cmd
ngrok http 8080
```
Скопируйте HTTPS URL из output (например: https://xxx.ngrok.io)

**Терминал 3 - Telegram бот:**
```cmd
cd D:\Task_bot
python main.py
```

**Терминал 4 - React dev сервер (опционально):**
```cmd
cd D:\Task_bot\mini-app
npm start
```

### Вариант 2: Сборка и деплой

#### Сборка фронтенда:
```cmd
cd D:\Task_bot\mini-app
npm run build
```

#### Деплой на Vercel:
1. Зайдите на vercel.com
2. Импортируйте репозиторий с GitHub
3. Vercel автоматически определит Create React App

#### Обновление API URL после ngrok:

После запуска ngrok скопируйте URL и обновите в:
- `D:\Task_bot\mini-app\src\services\api.js` (строка 1)
- `D:\Task_bot\run_api.py` (CORS настройки)

## Использование

### Запуск бота:
1. Откройте Telegram
2. Найдите бота по имени
3. Отправьте /start
4. Нажмите кнопку "Открыть приложение"

### Использование веб-приложения:
1. Создавайте заметки через кнопку +
2. Заметки сохраняются в базу данных
3. Бот присылает уведомления о новых заметках

## Устранение проблем

### Ошибка "Пожалуйста, откройте приложение через бота"
- Убедитесь что открываете приложение через кнопку в Telegram
- Проверьте что Telegram WebApp SDK подключен (см. public/index.html)

### Ошибка API при запуске
- Проверьте что ngrok запущен и работает
- Проверьте что python run_api.py запущен

### Бот не отвечает
- Проверьте токен бота в .env
- Проверьте что python main.py запущен
