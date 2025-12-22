from server.config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Integer,Float, String, DateTime, func, Enum

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'

    id = Column(Integer(), primary_key=True)
