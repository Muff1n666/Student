from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from database.db import engine
from database import models

#Инициализация схемы БД
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Study Planner API")

#Настройка CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Регистрируем маршруты API
app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Study Planner API is running"}

@app.get("/test")
async def test():
    """Тестовый эндпоинт для проверки CORS"""
    return {"status": "ok", "message": "CORS is working!"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Запуск FastAPI сервера на порту 8080...")
    uvicorn.run("run_api:app", host="127.0.0.1", port=8080, reload=True)