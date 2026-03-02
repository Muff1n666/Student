from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime, BigInteger, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(BigInteger, unique=True, index=True)
    username = Column(String, nullable=True)
    first_name = Column(String)
    chat_id = Column(BigInteger)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    #Заметки, связанные с пользователем
    notes = relationship("Note", back_populates="user")

class Note(Base):
    __tablename__ = "notes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    type = Column(String)  
    content = Column(String)
    note_date = Column(Date)
    notified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    #Пользователь, который создал заметку
    user = relationship("User", back_populates="notes")