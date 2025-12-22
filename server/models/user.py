from server.config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Integer, String, DateTime, func, Enum

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
    role = Column(Enum(*ROLES, name='user_roles'))
    created_at = Column(DateTime(), server_default=func.now())
    updated_at = Column(DateTime(), onupdate=func.now())

    serialize_only = ('id', 
                      'firstName', 
                      'secondName', 
                      'email', 
                      'phone', 
                      'role', 
                      'created_at',)
    
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