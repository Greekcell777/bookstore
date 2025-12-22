from server.config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Integer,Float, String, DateTime, func, Enum

STATUS = ('draft', 'published', 'archived')
class Book(db.Model, SerializerMixin):
    __tablename__ = 'books'

    id = Column(Integer(), primary_key=True)
    title = Column(String(), nullable=False)
    author = Column(String(), nullable=False)
    ISBN = Column(String(), nullable=False)
    short_desc = Column(String(), nullable=False)
    desc = Column(String(), nullable=False)
    category = Column(Integer())
    publisher = Column(String(), nullable=False)
    pub_date = Column(DateTime())
    language = Column(String(), nullable=False)
    no_of_pages = Column(Integer())
    tags = Column(String(), nullable=False)
    price = Column(Float(), nullable=False)
    discount_price = Column(Float(), nullable=False)
    stock = Column(Integer(), nullable=False)
    status = Column(Enum(*STATUS, name='post_status'))
    weight = Column(Integer())
    dimensions = Column(String(), nullable=False)
    rating = Column(Float())
    review_count = Column(Integer())
    created_at = Column(DateTime(), server_default=func.now())
    updated_at = Column(DateTime(), onupdate=func.now())