from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from database.db import engine
from database import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Study Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "https://student-lovat-alpha.vercel.app",
        "https://intimal-hymnologic-sachiko.ngrok-free.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Study Planner API is running"}


@app.get("/test")
async def test():
    return {"status": "ok", "message": "CORS is working!"}


if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server on port 8080...")
    uvicorn.run("run_api:app", host="127.0.0.1", port=8080, reload=True)
