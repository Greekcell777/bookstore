from server.config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Integer, String, DateTime, func, Enum
from sqlalchemy.orm import relationship

from sqlalchemy.ext.hybrid import hybrid_property

ROLES = ('admin', 'customer')
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = Column(Integer(), primary_key=True)
    firstName = Column(String(), nullable=False)
    secondName = Column(String(), nullable=False)
    email = Column(String(), unique=True, nullable=False)
    _password_hash = Column(String())
    phone = Column(String(), unique=True)
    role = Column(Enum(*ROLES, name='user_roles'), default='customer')
    created_at = Column(DateTime(), server_default=func.now())
    updated_at = Column(DateTime(), onupdate=func.now())

    # Relationships
    orders = relationship('Order', back_populates='user')
    addresses = relationship('Address', back_populates='user', cascade='all, delete-orphan')
    wishlists = relationship('Wishlist', back_populates='user', cascade='all, delete-orphan')
    
    serialize_only = ('firstName', 'secondName', 'phone', 'role',
                      'email', 'orders', 'addresses', 'wishlists',
                      'created_at', 'updated_at', 'orders', 'addresses',
                      'wishlists',)
    serialize_rules = ('-orders.user', '-addresses.user', '-wishlists.user',)
    
    def __repr__(self):
        return f"User {self.id}, {self.email}"   
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hash is write-only.")

    @password_hash.setter
    def password_hash(self, value):
        from server.app import bcrypt
        hashed = bcrypt.generate_password_hash(value.encode('utf-8'))
        self._password_hash = hashed.decode('utf-8')

    def authenticate(self, password):
        from server.app import bcrypt
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))