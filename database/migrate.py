import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from config import DATABASE_URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})

MIGRATIONS = [
    "ALTER TABLE users ADD COLUMN email VARCHAR",
    "ALTER TABLE users ADD COLUMN password_hash VARCHAR",
]

with engine.connect() as conn:
    for sql in MIGRATIONS:
        try:
            conn.execute(text(sql))
            conn.commit()
            print(f"OK: {sql}")
        except Exception as e:
            print(f"SKIP ({e}): {sql}")

print("Migration done")
