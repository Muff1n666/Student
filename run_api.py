from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from database.db import engine
from database import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Study Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
