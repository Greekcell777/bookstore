from server.config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean, Text, ForeignKey, Enum, func
from sqlalchemy.orm import relationship, validates
from datetime import datetime

REVIEW_STATUS = ('pending', 'approved', 'rejected', 'flagged')

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    # Primary Key
    id = Column(Integer, primary_key=True)
    
    # Relationships
    book_id = Column(Integer, ForeignKey('books.id'), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    
    # Review Content
    title = Column(String(200))  # Optional review title
    content = Column(Text)  # Full review text
    rating = Column(Integer, nullable=False)  # 1-5 stars
    pros = Column(Text)  # What the reader liked
    cons = Column(Text)  # What could be improved
    
    # Review Metadata
    status = Column(Enum(*REVIEW_STATUS, name='review_status'), default='pending', nullable=False)
    is_verified_purchase = Column(Boolean, default=False)
    helpful_count = Column(Integer, default=0)
    not_helpful_count = Column(Integer, default=0)
    report_count = Column(Integer, default=0)
    report_reason = Column(Text)  # Why the review was reported
    
    # Admin Management
    moderated_by = Column(Integer, ForeignKey('users.id'))  # Admin who moderated
    moderation_notes = Column(Text)  # Internal notes from admin
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now())
    moderated_at = Column(DateTime)  # When status was changed by admin
    published_at = Column(DateTime)  # When review became visible
    
    # Relationships (assuming you have a User model)
    book = relationship('Book', back_populates='reviews')
    user = relationship('User', foreign_keys=[user_id])
    moderator = relationship('User', foreign_keys=[moderated_by])
    
    # Serialization rules
    serialize_rules = (
        '-book.reviews',
        '-user.reviews',
        '-moderator',
        '-moderation_notes',
        '-report_reason',
    )
    
    def __repr__(self):
        return f"<Review {self.id}: Book {self.book_id} - {self.rating} stars>"
    
    # Validation methods
    @validates('rating')
    def validate_rating(self, key, rating):
        if not (1 <= rating <= 5):
            raise ValueError("Rating must be between 1 and 5")
        return rating
    
    @validates('content')
    def validate_content(self, key, content):
        if content and len(content.strip()) < 10:
            raise ValueError("Review content must be at least 10 characters")
        if content and len(content) > 5000:
            raise ValueError("Review content cannot exceed 5000 characters")
        return content
    
    @validates('title')
    def validate_title(self, key, title):
        if title and len(title) > 200:
            raise ValueError("Review title cannot exceed 200 characters")
        return title
    
    # Helper methods
    def approve(self, moderator_id=None):
        """Approve this review"""
        self.status = 'approved'
        self.moderated_by = moderator_id
        self.moderated_at = datetime.utcnow()
        self.published_at = datetime.utcnow()
        
        # Update book's average rating
        self.book.update_rating()
    
    def reject(self, moderator_id=None, reason=None):
        """Reject this review"""
        self.status = 'rejected'
        self.moderated_by = moderator_id
        self.moderated_at = datetime.utcnow()
        if reason:
            self.moderation_notes = reason
        
        # Update book's average rating
        self.book.update_rating()
    
    def flag(self, reason=None):
        """Flag this review for moderation"""
        self.status = 'flagged'
        self.report_count += 1
        if reason:
            self.report_reason = reason
    
    def mark_helpful(self, user_id):
        """Mark review as helpful (prevent duplicate votes per user)"""
        # In practice, you'd track which users voted in a separate table
        self.helpful_count += 1
    
    def mark_not_helpful(self, user_id):
        """Mark review as not helpful"""
        self.not_helpful_count += 1
    
    def calculate_helpful_score(self):
        """Calculate helpfulness score (percentage)"""
        total_votes = self.helpful_count + self.not_helpful_count
        if total_votes == 0:
            return 0
        return round((self.helpful_count / total_votes) * 100)
    
    def is_published(self):
        """Check if review is visible to public"""
        return self.status == 'approved' and self.published_at is not None
    
    def get_excerpt(self, length=150):
        """Get excerpt of review content"""
        if not self.content:
            return ""
        if len(self.content) <= length:
            return self.content
        return self.content[:length] + "..."
    
    def get_user_initials(self):
        """Get user initials for display"""
        if self.user.first_name and self.user.last_name:
            return f"{self.user.first_name[0]}{self.user.last_name[0]}".upper()
        elif self.user.first_name:
            return self.user.first_name[0].upper()
        elif self.user.email:
            return self.user.email[0].upper()
        return "U"
    
    def can_edit(self, user_id):
        """Check if user can edit this review"""
        return self.user_id == user_id and self.status in ['pending', 'approved']
    
    def can_delete(self, user_id, is_admin=False):
        """Check if user can delete this review"""
        return self.user_id == user_id or is_admin


# Supporting table for review votes (to prevent duplicate votes)
class ReviewVote(db.Model, SerializerMixin):
    __tablename__ = 'review_votes'
    
    id = Column(Integer, primary_key=True)
    review_id = Column(Integer, ForeignKey('reviews.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    is_helpful = Column(Boolean, nullable=False)  # True = helpful, False = not helpful
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Ensure one vote per user per review
    __table_args__ = (db.UniqueConstraint('review_id', 'user_id', name='uq_review_user_vote'),)
    
    review = relationship('Review')
    user = relationship('User')
    
    serialize_rules = ('-review.votes', '-user.votes')
    
    def __repr__(self):
        return f"<ReviewVote {self.id}: Review {self.review_id} - {'helpful' if self.is_helpful else 'not helpful'}>"