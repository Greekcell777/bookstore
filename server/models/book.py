from server.config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean, Text, Numeric, ForeignKey, Enum, func
from sqlalchemy.orm import relationship, validates
from datetime import datetime
import re

STATUS = ('draft', 'published', 'archived')
FORMAT = ('Paperback', 'Hardcover', 'eBook')

class Book(db.Model, SerializerMixin):
    __tablename__ = 'books'

    # Primary Key
    id = Column(Integer, primary_key=True)
    
    # Basic Information
    title = Column(String(255), nullable=False, index=True)
    author = Column(String(150), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    
    # ISBN Information
    isbn_10 = Column(String(10), unique=True, index=True)
    isbn_13 = Column(String(13), unique=True, nullable=False, index=True)
    
    # Description
    short_description = Column(String(500), nullable=False)  # For listings
    description = Column(Text, nullable=False)  # Full description
    excerpt = Column(Text)  # Book excerpt/sample
    
    # Publisher Information
    publisher = Column(String(150), nullable=False)
    publisher_id = Column(Integer, ForeignKey('publishers.id'), nullable=False)
    publication_date = Column(DateTime, nullable=False)
    edition = Column(String(50))  # e.g., "1st", "Revised", "Special Edition"
    
    # Book Details
    language = Column(String(50), nullable=False, default='English')
    page_count = Column(Integer, nullable=False)
    format = Column(String(50), default='Paperback')  # Paperback, Hardcover, eBook
    dimensions = Column(String(100))  # e.g., "8.5 x 5.5 x 1 inches"
    weight_grams = Column(Integer)  # Weight in grams
    
    # Pricing
    list_price = Column(Numeric(10, 2), nullable=False)
    sale_price = Column(Numeric(10, 2))
    cost_price = Column(Numeric(10, 2))  # For profit calculations
    
    # Inventory Management
    sku = Column(String(100), unique=True, nullable=False)  # Stock Keeping Unit
    stock_quantity = Column(Integer, nullable=False, default=0)
    low_stock_threshold = Column(Integer, default=10)
    is_available = Column(Boolean, default=True, nullable=False)
    allow_backorders = Column(Boolean, default=False)
    max_backorders = Column(Integer, default=0)
    
    # Ratings and Reviews
    average_rating = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)
    review_count = Column(Integer, default=0)
    
    # SEO and Marketing
    meta_title = Column(String(255))
    meta_description = Column(String(500))
    keywords = Column(String(500))
    
    # Digital Assets
    cover_image_url = Column(String(500))
    cover_image_alt = Column(String(255))
    sample_pdf_url = Column(String(500))
    
    # Status and Flags
    status = Column(Enum(*STATUS, name='book_status'), default='draft', nullable=False)
    is_featured = Column(Boolean, default=False)
    is_bestseller = Column(Boolean, default=False)
    is_new_release = Column(Boolean, default=True)
    
    # Sales Data
    total_sold = Column(Integer, default=0)
    total_revenue = Column(Numeric(12, 2), default=0)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now())
    published_at = Column(DateTime)
    
    # Relationships
    publisher_rel = relationship('Publisher', back_populates='books')
    categories = relationship('Category', secondary='book_categories', back_populates='books')
    reviews = relationship('Review', back_populates='book', cascade='all, delete-orphan')
    order_items = relationship('OrderItem', back_populates='book')
    wishlists = relationship('WishlistItem', back_populates='book')
    images = relationship('BookImage', back_populates='book')
    
    # Serialization rules
    serialize_rules = (
        '-publisher_rel.book',
        '-categories.book',
        '-reviews.book',
        '-order_items.book',
        '-wishlists.book',
    )
    
    def __repr__(self):
        return f"<Book {self.id}: {self.title} by {self.author}>"
    
    # Validation methods
    @validates('isbn_13')
    def validate_isbn_13(self, key, isbn):
        if not isbn:
            raise ValueError("ISBN-13 is required")
        
        # Remove dashes and spaces
        isbn = isbn.replace('-', '').replace(' ', '')
        
        if len(isbn) != 13:
            raise ValueError("ISBN-13 must be 13 digits")
        
        if not isbn.isdigit():
            raise ValueError("ISBN-13 must contain only digits")
        
        # Validate ISBN-13 checksum
        if not self.is_valid_isbn13(isbn):
            raise ValueError("Invalid ISBN-13 checksum")
        
        return isbn
    
    @validates('isbn_10')
    def validate_isbn_10(self, key, isbn):
        if isbn:
            # Remove dashes and spaces
            isbn = isbn.replace('-', '').replace(' ', '')
            
            if len(isbn) != 10:
                raise ValueError("ISBN-10 must be 10 characters")
            
            # Validate ISBN-10 checksum
            if not self.is_valid_isbn10(isbn):
                raise ValueError("Invalid ISBN-10 checksum")
        
        return isbn
    
    @validates('sku')
    def validate_sku(self, key, sku):
        if not sku:
            raise ValueError("SKU is required")
        
        if len(sku) > 100:
            raise ValueError("SKU must be 100 characters or less")
        
        # Check for uniqueness (handled by database, but early validation)
        existing = Book.query.filter_by(sku=sku).first()
        if existing and existing.id != self.id:
            raise ValueError("SKU must be unique")
        
        return sku
    
    @validates('stock_quantity')
    def validate_stock_quantity(self, key, quantity):
        if quantity < 0:
            raise ValueError("Stock quantity cannot be negative")
        return quantity
    
    @validates('list_price', 'sale_price', 'cost_price')
    def validate_prices(self, key, price):
        if price is not None and price < 0:
            raise ValueError("Price cannot be negative")
        return price
    
    # Helper methods
    def is_valid_isbn10(self, isbn):
        """Validate ISBN-10 checksum"""
        if len(isbn) != 10:
            return False
        
        # Check if last character is valid (could be 'X' for 10)
        digits = list(isbn)
        if digits[-1].upper() == 'X':
            digits[-1] = '10'
        
        if not all(c.isdigit() for c in digits[:-1]):
            return False
        
        try:
            total = sum((10 - i) * int(digits[i]) for i in range(9))
            total += int(digits[9])
            return total % 11 == 0
        except ValueError:
            return False
    
    def is_valid_isbn13(self, isbn):
        """Validate ISBN-13 checksum"""
        if len(isbn) != 13 or not isbn.isdigit():
            return False
        
        # ISBN-13 checksum calculation
        digits = [int(d) for d in isbn]
        weights = [1, 3] * 6 + [1]
        total = sum(d * w for d, w in zip(digits, weights))
        return total % 10 == 0
    
    def generate_slug(self):
        """Generate URL-friendly slug from title and author"""
        if not self.title or not self.author:
            return None
        
        base = f"{self.title} {self.author}"
        # Convert to lowercase, remove special characters, replace spaces with hyphens
        slug = re.sub(r'[^\w\s-]', '', base.lower())
        slug = re.sub(r'[-\s]+', '-', slug).strip('-')
        
        # Ensure uniqueness
        original_slug = slug
        counter = 1
        while Book.query.filter_by(slug=slug).first():
            slug = f"{original_slug}-{counter}"
            counter += 1
        
        return slug
    
    def calculate_discount_percentage(self):
        """Calculate discount percentage"""
        if not self.sale_price or self.sale_price >= self.list_price:
            return 0
        
        discount = ((self.list_price - self.sale_price) / self.list_price) * 100
        return float(round(discount, 1))
    
    def get_current_price(self):
        """Get current price (sale price if available, else list price)"""
        return self.sale_price if self.sale_price else self.list_price
    
    def is_in_stock(self):
        """Check if book is in stock"""
        return self.stock_quantity > 0 or (self.allow_backorders and self.max_backorders > 0)
    
    def update_rating(self):
        """Update average rating and rating count from reviews"""
        from models.review import Review
        reviews = Review.query.filter_by(book_id=self.id, status='approved').all()
        
        if reviews:
            total_rating = sum(review.rating for review in reviews)
            self.average_rating = round(total_rating / len(reviews), 1)
            self.rating_count = len(reviews)
            self.review_count = len([r for r in reviews if r.content])
        else:
            self.average_rating = 0.0
            self.rating_count = 0
            self.review_count = 0
    
    def increment_sales(self, quantity, price):
        """Increment sales data when book is purchased"""
        self.total_sold += quantity
        self.total_revenue += (price * quantity)
        
        # Update stock
        self.stock_quantity = max(0, self.stock_quantity - quantity)
        
        # Update bestseller flag if sold enough copies
        if self.total_sold >= 100:  # Threshold for bestseller
            self.is_bestseller = True
    
    def get_stock_status(self):
        """Get human-readable stock status"""
        if self.stock_quantity == 0:
            return 'Out of Stock'
        elif self.stock_quantity <= self.low_stock_threshold:
            return f'Only {self.stock_quantity} left'
        else:
            return 'In Stock'
    


# Supporting Models

class Publisher(db.Model, SerializerMixin):
    __tablename__ = 'publishers'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False, unique=True)
    slug = Column(String(150), unique=True, nullable=False)
    description = Column(Text)
    website = Column(String(255))
    logo_url = Column(String(500))
    contact_email = Column(String(150))
    contact_phone = Column(String(20))
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    books = relationship("Book", back_populates='publisher_rel')
    
    serialize_rules = ('-books.publisher_rel', )
    
    def __repr__(self):
        return f"<Publisher {self.id}: {self.name}>"


# Association table for many-to-many relationship
book_categories = db.Table('book_categories',
    Column('book_id', Integer, ForeignKey('books.id'), primary_key=True),
    Column('category_id', Integer, ForeignKey('categories.id'), primary_key=True),
    Column('created_at', DateTime, server_default=func.now())
)


class BookImage(db.Model, SerializerMixin):
    __tablename__ = 'book_images'
    
    id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey('books.id'), nullable=False)
    image_url = Column(String(500), nullable=False)
    alt_text = Column(String(255))
    display_order = Column(Integer, default=0)
    is_main = Column(Boolean, default=False)
    
    created_at = Column(DateTime, server_default=func.now())
    
    book = relationship('Book', back_populates='images')
    
    serialize_rules = ('-images.book',)
    
    def __repr__(self):
        return f"<BookImage {self.id} for Book {self.book_id}>"