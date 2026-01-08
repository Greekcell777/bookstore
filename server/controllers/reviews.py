from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models import Review, Book, User, Order, OrderItem
from server.config import db
from datetime import datetime

class BookReviewsResource(Resource):
    """Get reviews for a book"""
    
    def get(self, book_id):
        """Get all reviews for a book"""
        # Parse query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort = request.args.get('sort', 'created_at')
        order = request.args.get('order', 'desc')
        status = request.args.get('status', 'published')
        
        # Verify book exists
        book = Book.query.get(book_id)
        if not book:
            return {'error': 'Book not found'}, 404
        
        # Build query
        query = Review.query.filter_by(book_id=book_id)
        
        if status:
            query = query.filter_by(status=status)
        
        # Apply sorting
        if sort == 'rating':
            if order == 'asc':
                query = query.order_by(Review.rating.asc())
            else:
                query = query.order_by(Review.rating.desc())
        elif sort == 'helpful':
            if order == 'asc':
                query = query.order_by(Review.helpful_count.asc())
            else:
                query = query.order_by(Review.helpful_count.desc())
        else:  # created_at
            if order == 'asc':
                query = query.order_by(Review.created_at.asc())
            else:
                query = query.order_by(Review.created_at.desc())
        
        # Pagination
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        reviews = []
        for review in pagination.items:
            user = User.query.get(review.user_id)
            reviews.append({
                'id': review.id,
                'user': {
                    'id': user.id,
                    'first_name': user.first_name,
                    'second_name': user.second_name,
                    'avatar_url': user.avatar_url
                } if user else None,
                'rating': review.rating,
                'content': review.content,
                'status': review.status,
                'helpful_count': review.helpful_count,
                'unhelpful_count': review.unhelpful_count,
                'created_at': review.created_at.isoformat(),
                'updated_at': review.updated_at.isoformat() if review.updated_at else None,
                'verified_purchase': review.verified_purchase,
                'admin_response': review.admin_response
            })
        
        # Calculate rating distribution
        rating_stats = db.session.query(
            Review.rating,
            db.func.count(Review.id)
        ).filter(
            Review.book_id == book_id,
            Review.status == 'published'
        ).group_by(Review.rating).all()
        
        rating_distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for rating, count in rating_stats:
            rating_distribution[rating] = count
        
        return {
            'book_id': book_id,
            'book_title': book.title,
            'average_rating': book.average_rating,
            'rating_count': book.rating_count,
            'review_count': book.review_count,
            'rating_distribution': rating_distribution,
            'reviews': reviews,
            'pagination': {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }, 200
    
    @jwt_required()
    def post(self, book_id):
        """Create a review for a book"""
        user_id = get_jwt_identity()['id']
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        rating = data.get('rating')
        content = data.get('content', '').strip()
        
        # Validate rating
        if not rating or not isinstance(rating, (int, float)) or rating < 1 or rating > 5:
            return {'error': 'Valid rating between 1 and 5 is required'}, 400
        
        # Verify book exists
        book = Book.query.get(book_id)
        if not book:
            return {'error': 'Book not found'}, 404
        
        # Check if user has already reviewed this book
        existing_review = Review.query.filter_by(
            book_id=book_id, 
            user_id=user_id
        ).first()
        
        if existing_review:
            return {'error': 'You have already reviewed this book'}, 400
        
        # Check if user has purchased the book (for verified purchase)
        verified_purchase = False
        if data.get('require_verification', True):
            # Check if user has purchased this book
            purchase_check = db.session.query(Order).join(OrderItem).filter(
                Order.user_id == user_id,
                Order.status.in_(['completed', 'delivered']),
                OrderItem.book_id == book_id
            ).first()
            
            verified_purchase = purchase_check is not None
        
        try:
            # Create review
            review = Review(
                book_id=book_id,
                user_id=user_id,
                rating=rating,
                content=content,
                status='pending',  # Could be 'published' based on moderation settings
                verified_purchase=verified_purchase
            )
            
            db.session.add(review)
            db.session.commit()
            
            # Update book rating stats
            book.update_rating()
            db.session.commit()
            
            return {
                'message': 'Review submitted successfully',
                'review_id': review.id,
                'status': review.status
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to submit review: {str(e)}'}, 500


class ReviewResource(Resource):
    """Single review management"""
    
    @jwt_required()
    def put(self, review_id):
        """Update review"""
        user_id = get_jwt_identity()['id']
        
        review = Review.query.get_or_404(review_id)
        
        # Check authorization
        if review.user_id != user_id:
            return {'error': 'Unauthorized'}, 403
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        try:
            if 'rating' in data:
                rating = data['rating']
                if isinstance(rating, (int, float)) and 1 <= rating <= 5:
                    review.rating = rating
            
            if 'content' in data:
                content = data['content'].strip()
                if content:
                    review.content = content
            
            review.updated_at = datetime.utcnow()
            db.session.commit()
            
            # Update book rating stats
            book = Book.query.get(review.book_id)
            if book:
                book.update_rating()
                db.session.commit()
            
            return {
                'message': 'Review updated successfully',
                'review_id': review.id
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to update review: {str(e)}'}, 500
    
    @jwt_required()
    def delete(self, review_id):
        """Delete review"""
        user_id = get_jwt_identity()['id']
        
        review = Review.query.get_or_404(review_id)
        
        # Check authorization
        if review.user_id != user_id:
            # Check if user is admin
            user = User.query.get(user_id)
            if not user or user.role != 'admin':
                return {'error': 'Unauthorized'}, 403
        
        try:
            book_id = review.book_id
            db.session.delete(review)
            db.session.commit()
            
            # Update book rating stats
            book = Book.query.get(book_id)
            if book:
                book.update_rating()
                db.session.commit()
            
            return {'message': 'Review deleted successfully'}, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to delete review: {str(e)}'}, 500


class ReviewHelpfulResource(Resource):
    """Mark review as helpful/unhelpful"""
    
    @jwt_required()
    def post(self, review_id, action):
        """Mark review as helpful or unhelpful"""
        user_id = get_jwt_identity()['id']
        
        review = Review.query.get_or_404(review_id)
        
        if review.user_id == user_id:
            return {'error': 'You cannot rate your own review'}, 400
        
        # Check if user has already rated this review
        # You might want to store this in a separate table for tracking
        
        try:
            if action == 'helpful':
                review.helpful_count += 1
            elif action == 'unhelpful':
                review.unhelpful_count += 1
            else:
                return {'error': 'Invalid action. Use "helpful" or "unhelpful"'}, 400
            
            review.updated_at = datetime.utcnow()
            db.session.commit()
            
            return {
                'message': f'Review marked as {action}',
                'review_id': review.id,
                'helpful_count': review.helpful_count,
                'unhelpful_count': review.unhelpful_count
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to mark review: {str(e)}'}, 500