from server.config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Integer, Text, Boolean, String, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    book_id = Column(Integer, ForeignKey('books.id'))
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    image_url = Column(String(500))
    
    created_at = Column(DateTime, server_default=func.now())
    
    books = relationship('Book', secondary='book_categories', back_populates='categories')
    
    serialize_rules =  ('-books.categories',)
    
    def __repr__(self):
        return f"<Category {self.id}: {self.name}>"
    
 
