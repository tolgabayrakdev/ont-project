from .database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    image_url = Column(String)
    role_id = Column(Integer, ForeignKey("roles.id"), default=1)
    created_at = Column(DateTime, default=datetime.now())

    role = relationship("Role", back_populates="users")
