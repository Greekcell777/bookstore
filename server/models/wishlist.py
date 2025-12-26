from server.config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Numeric, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum, func
from sqlalchemy.orm import relationship, validates
from datetime import datetime

class Wishlist(db.Model, SerializerMixin):
    __tablename__ = 'wishlists'
    
    # Primary Key
    id = Column(Integer, primary_key=True)
    
    # Basic Information
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    name = Column(String(100), nullable=False, default='My Wishlist')
    description = Column(Text)
    is_default = Column(Boolean, default=False, nullable=False)  # User's primary wishlist
    is_public = Column(Boolean, default=False, nullable=False)  # Shareable via link
    view_count = Column(Integer, default=0)  # How many times viewed (if public)
    
    # Privacy & Sharing
    share_token = Column(String(50), unique=True, index=True)  # For public sharing
    privacy = Column(Enum('private', 'shared', 'public', name='wishlist_privacy'), 
                    default='private', nullable=False)
    
    # Event Information (for gift registries)
    event_name = Column(String(100))  # e.g., "Birthday", "Christmas"
    event_date = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now())
    last_accessed = Column(DateTime)  # When user last viewed
    
    # Relationships
    user = relationship('User', back_populates='wishlists')
    items = relationship('WishlistItem', back_populates='wishlist', 
                        lazy='dynamic', cascade='all, delete-orphan')
    
    # Serialization rules
    serialize_rules = (
        '-user.wishlists',
        '-items.wishlist',
        '-share_token',
    )
    
    def __repr__(self):
        return f"<Wishlist {self.id}: {self.name} (User {self.user_id})>"
    
    # Validation methods
    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name.strip()) == 0:
            raise ValueError("Wishlist name cannot be empty")
        if len(name) > 100:
            raise ValueError("Wishlist name cannot exceed 100 characters")
        return name.strip()
    
    # Helper methods
    def add_book(self, book_id, notes=None, priority='medium'):
        """Add a book to this wishlist"""
        # Check if book already exists in wishlist
        existing_item = WishlistItem.query.filter_by(
            wishlist_id=self.id,
            book_id=book_id
        ).first()
        
        if existing_item:
            existing_item.updated_at = datetime.utcnow()
            return existing_item  # Already exists
        
        # Create new item
        item = WishlistItem(
            wishlist_id=self.id,
            book_id=book_id,
            notes=notes,
            priority=priority
        )
        
        db.session.add(item)
        self.updated_at = datetime.utcnow()
        return item
    
    def remove_book(self, book_id):
        """Remove a book from this wishlist"""
        item = WishlistItem.query.filter_by(
            wishlist_id=self.id,
            book_id=book_id
        ).first()
        
        if item:
            db.session.delete(item)
            self.updated_at = datetime.utcnow()
            return True
        return False
    
    def contains_book(self, book_id):
        """Check if book is in wishlist"""
        return WishlistItem.query.filter_by(
            wishlist_id=self.id,
            book_id=book_id
        ).first() is not None
    
    def get_book_ids(self):
        """Get list of book IDs in wishlist"""
        return [item.book_id for item in self.items]
    
    def get_items_count(self):
        """Get count of items in wishlist"""
        return self.items.count()
    
    def get_total_value(self):
        """Calculate total value of all books in wishlist"""
        total = 0
        for item in self.items:
            if item.book:
                total += float(item.book.get_current_price())
        return round(total, 2)
    
    def generate_share_token(self):
        """Generate unique share token for public access"""
        import secrets
        token = secrets.token_urlsafe(16)
        
        # Ensure uniqueness
        while Wishlist.query.filter_by(share_token=token).first():
            token = secrets.token_urlsafe(16)
        
        self.share_token = token
        self.is_public = True
        return token
    
    def revoke_share_token(self):
        """Revoke public sharing"""
        self.share_token = None
        self.is_public = False
    
    def to_dict(self, include_items=False):
        """Convert wishlist to dictionary"""
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'is_default': self.is_default,
            'is_public': self.is_public,
            'item_count': self.get_items_count(),
            'total_value': self.get_total_value(),
            'privacy': self.privacy,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        
        if include_items:
            data['items'] = [item.to_dict() for item in self.items]
        
        return data
    
    def get_share_url(self):
        """Get shareable URL (would use your actual domain)"""
        if self.share_token:
            return f"https://yourbookstore.com/wishlist/share/{self.share_token}"
        return None


class WishlistItem(db.Model, SerializerMixin):
    __tablename__ = 'wishlist_items'
    
    # Primary Key
    id = Column(Integer, primary_key=True)
    
    # Relationships
    wishlist_id = Column(Integer, ForeignKey('wishlists.id'), nullable=False, index=True)
    book_id = Column(Integer, ForeignKey('books.id'), nullable=False, index=True)
    
    # Item Details
    notes = Column(Text)  # Personal notes about why they want this book
    priority = Column(Enum('low', 'medium', 'high', 'urgent', name='item_priority'), 
                     default='medium', nullable=False)
    desired_format = Column(String(50))  # e.g., "Hardcover", "eBook", "Any"
    quantity_desired = Column(Integer, default=1)  # How many copies they want
    
    # Purchase Tracking
    is_purchased = Column(Boolean, default=False)
    purchased_by = Column(Integer, ForeignKey('users.id'))  # Who purchased it (for gift tracking)
    purchased_at = Column(DateTime)
    purchase_notes = Column(Text)  # Notes from purchaser
    
    # Price Tracking (snapshot when added)
    added_price = Column(Numeric(10, 2))  # Price when added to wishlist
    current_price = Column(Numeric(10, 2))  # Latest price (updated periodically)
    lowest_price = Column(Numeric(10, 2))  # Lowest price seen
    price_drop_alert = Column(Boolean, default=False)  # Alert when price drops
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    wishlist = relationship('Wishlist', back_populates='items')
    book = relationship('Book', back_populates='wishlists')
    purchaser = relationship('User', foreign_keys=[purchased_by])
    
    # Ensure unique book per wishlist
    __table_args__ = (db.UniqueConstraint('wishlist_id', 'book_id', 
                       name='uq_wishlist_book'),)
    
    # Serialization rules
    serialize_rules = (
        '-wishlist.items',
        '-book.wishlists',
        '-purchaser',
    )
    
    def __repr__(self):
        return f"<WishlistItem {self.id}: Book {self.book_id} in Wishlist {self.wishlist_id}>"
    
    # Validation methods
    @validates('quantity_desired')
    def validate_quantity(self, key, quantity):
        if quantity < 1:
            raise ValueError("Quantity must be at least 1")
        if quantity > 99:
            raise ValueError("Quantity cannot exceed 99")
        return quantity
    
    # Helper methods
    def mark_as_purchased(self, purchaser_id=None, notes=None):
        """Mark item as purchased (for gift tracking)"""
        self.is_purchased = True
        self.purchased_by = purchaser_id
        self.purchased_at = datetime.utcnow()
        self.purchase_notes = notes
    
    def unmark_as_purchased(self):
        """Unmark item as purchased"""
        self.is_purchased = False
        self.purchased_by = None
        self.purchased_at = None
        self.purchase_notes = None
    
    def update_price_info(self):
        """Update current price from book and track lowest price"""
        if self.book:
            current_price = float(self.book.get_current_price())
            self.current_price = current_price
            
            # Track lowest price
            if self.lowest_price is None or current_price < float(self.lowest_price):
                self.lowest_price = current_price
                
            # Check for price drop alert
            if (self.added_price and current_price < float(self.added_price) * 0.9):  # 10% drop
                self.price_drop_alert = True
            else:
                self.price_drop_alert = False
    
    def get_price_difference(self):
        """Calculate price difference from when added"""
        if self.added_price and self.current_price:
            return round(float(self.added_price) - float(self.current_price), 2)
        return 0
    
    def get_price_drop_percentage(self):
        """Calculate percentage price drop"""
        if self.added_price and self.current_price:
            diff = float(self.added_price) - float(self.current_price)
            if diff > 0:
                return round((diff / float(self.added_price)) * 100, 1)
        return 0
    
    def to_dict(self, include_book_details=False):
        """Convert wishlist item to dictionary"""
        data = {
            'id': self.id,
            'wishlist_id': self.wishlist_id,
            'book_id': self.book_id,
            'notes': self.notes,
            'priority': self.priority,
            'desired_format': self.desired_format,
            'quantity_desired': self.quantity_desired,
            'is_purchased': self.is_purchased,
            'added_price': float(self.added_price) if self.added_price else None,
            'current_price': float(self.current_price) if self.current_price else None,
            'lowest_price': float(self.lowest_price) if self.lowest_price else None,
            'price_drop_alert': self.price_drop_alert,
            'price_difference': self.get_price_difference(),
            'price_drop_percentage': self.get_price_drop_percentage(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        
        if include_book_details and self.book:
            data['book'] = {
                'id': self.book.id,
                'title': self.book.title,
                'author': self.book.author,
                'cover_image_url': self.book.cover_image_url,
                'current_price': float(self.book.get_current_price()),
                'is_available': self.book.is_available,
                'average_rating': self.book.average_rating,
            }
        
        return data


# Update User model to include wishlist relationship
# Add to your existing User model:
# wishlists = relationship('Wishlist', back_populates='user', lazy='dynamic', cascade='all, delete-orphan')