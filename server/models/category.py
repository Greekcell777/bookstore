from server.config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Integer,Float, String, DateTime, func, Enum

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    id = Column(Integer(), primary_key=True)
    name = Column(String(), nullable=False)
    slug = Column(String())
    image = Column(String())
    created_at = Column(DateTime(), server_default=func.now())
    updated_at = Column(DateTime(), onupdate=func.now())