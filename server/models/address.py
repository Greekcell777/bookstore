from server.config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

class Address(db.Model, SerializerMixin):
    __tablename__ = 'addresses'
    
    # Primary Key
    id = Column(Integer(), primary_key=True)
    
    # Foreign Key to User
    user_id = Column(Integer(), ForeignKey('users.id'), nullable=False)
    
    # Address Information
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    
    # Address Lines
    address_line1 = Column(String(200), nullable=False)
    
    # Location Details
    town = Column(String(50), nullable=False)
    county = Column(String(50), nullable=False)
    postal_code = Column(String(20), nullable=False)
    country = Column(String(50), nullable=False, default='United States')
    
    # Address Type and Status
    address_type = Column(String(20), default='shipping')  # 'shipping', 'billing', 'both'
    is_default = Column(Boolean(), default=False)
        
    # Timestamps
    created_at = Column(DateTime(), server_default=func.now())
    updated_at = Column(DateTime(), onupdate=func.now())

    user = relationship('User', back_populates='addresses')

    # Serialization rules
    serialize_rules = ('-user.addresses', '-orders_shipping', '-orders_billing',)
    
    def __repr__(self):
        return f"Address {self.id}, {self.town}, {self.country}"
    
    # Helper method to format address
    def format_address(self):
        lines = [
            self.full_name,
            self.address_line1,
        ]
        
        if self.address_line2:
            lines.append(self.address_line2)
        
        lines.extend([
            f"{self.city}, {self.state} {self.postal_code}",
            self.country
        ])
        
        return "\n".join(lines)
    
    # Validate address
    def validate(self):
        errors = []
        
        if not self.full_name or len(self.full_name.strip()) < 2:
            errors.append("Full name must be at least 2 characters")
        
        if not self.phone or len(self.phone.strip()) < 10:
            errors.append("Valid phone number is required")
        
        if not self.address_line1 or len(self.address_line1.strip()) < 5:
            errors.append("Address line 1 is required")
        
        if not self.city or len(self.city.strip()) < 2:
            errors.append("City is required")
        
        if not self.state or len(self.state.strip()) < 2:
            errors.append("State is required")
        
        if not self.postal_code or len(self.postal_code.strip()) < 3:
            errors.append("Postal code is required")
        
        return errors