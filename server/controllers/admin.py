from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models import User, Book, Order, Review
from server.config import db
from datetime import datetime, timedelta
import decimal

class AdminDashboardStatsResource(Resource):
    """Admin dashboard statistics"""
    
    @jwt_required()
    def get(self):
        """Get dashboard statistics"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        try:
            # Today's date
            today = datetime.utcnow().date()
            start_of_today = datetime(today.year, today.month, today.day)
            start_of_month = datetime(today.year, today.month, 1)
            
            # Total counts
            total_users = User.query.count()
            total_books = Book.query.count()
            total_orders = Order.query.count()
            total_reviews = Review.query.filter_by(status='approved').count()
            
            # Today's stats
            today_orders = Order.query.filter(
                Order.created_at >= start_of_today
            ).count()
            
            today_revenue = db.session.query(
                db.func.sum(Order.total_amount)
            ).filter(
                Order.created_at >= start_of_today,
                Order.status.in_(['processing'])
            ).scalar() or decimal.Decimal('0.00')
            
            # Monthly stats
            monthly_revenue = db.session.query(
                db.func.sum(Order.total_amount)
            ).filter(
                Order.created_at >= start_of_month,
                Order.status.in_(['processing'])
            ).scalar() or decimal.Decimal('0.00')
            
            # Recent orders
            recent_orders = Order.query.order_by(
                Order.created_at.desc()
            ).limit(10).all()
            
            recent_orders_data = []
            for order in recent_orders:
                recent_orders_data.append({
                    'id': order.id,
                    'order_number': order.order_number,
                    'user_id': order.user_id,
                    'status': order.status,
                    'total_amount': float(order.total_amount),
                    'created_at': order.created_at.isoformat()
                })
            
            # Top selling books
            from sqlalchemy import func
            top_books = db.session.query(
                Book.id,
                Book.title,
                Book.author,
                Book.total_sold,
                Book.total_revenue
            ).order_by(
                Book.total_sold.desc()
            ).limit(5).all()
            
            top_books_data = []
            for book in top_books:
                top_books_data.append({
                    'id': book.id,
                    'title': book.title,
                    'author': book.author,
                    'total_sold': book.total_sold,
                    'total_revenue': float(book.total_revenue) if book.total_revenue else 0.0
                })
            
            # Revenue chart data (last 7 days)
            revenue_data = []
            for i in range(6, -1, -1):
                date = today - timedelta(days=i)
                start_of_day = datetime(date.year, date.month, date.day)
                end_of_day = start_of_day + timedelta(days=1)
                
                daily_revenue = db.session.query(
                    db.func.sum(Order.total_amount)
                ).filter(
                    Order.created_at >= start_of_day,
                    Order.created_at < end_of_day,
                    Order.status.in_(['delivered'])
                ).scalar() or decimal.Decimal('0.00')
                
                revenue_data.append({
                    'date': date.isoformat(),
                    'revenue': float(daily_revenue)
                })
            
            return {
                'stats': {
                    'total_users': total_users,
                    'total_books': total_books,
                    'total_orders': total_orders,
                    'total_reviews': total_reviews,
                    'today_orders': today_orders,
                    'today_revenue': float(today_revenue),
                    'monthly_revenue': float(monthly_revenue)
                },
                'recent_orders': recent_orders_data,
                'top_books': top_books_data,
                'revenue_chart': revenue_data
            }, 200
            
        except Exception as e:
            return {'error': f'Failed to fetch dashboard stats: {str(e)}'}, 500


class AdminUsersResource(Resource):
    """Admin user management"""
    
    @jwt_required()
    def get(self):
        """Get all users"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        # Parse query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search')
        role = request.args.get('role')
        status = request.args.get('status')
        sort = request.args.get('sort', 'created_at')
        order = request.args.get('order', 'desc')
        
        # Build query
        query = User.query
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (User.email.ilike(search_term)) |
                (User.firstName.ilike(search_term)) |
                (User.secondName.ilike(search_term))
            )
        
        if role:
            query = query.filter_by(role=role)
        
        if status:
            query = query.filter_by(status=status)
        
        
        elif sort == 'email':
            if order == 'asc':
                query = query.order_by(User.email.asc())
            else:
                query = query.order_by(User.email.desc())
        else:  # created_at
            if order == 'asc':
                query = query.order_by(User.created_at.asc())
            else:
                query = query.order_by(User.created_at.desc())
        
        # Pagination
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        users = []
        for user in pagination.items:
            # Get user's order count
            order_count = Order.query.filter_by(user_id=user.id).count()
            
            users.append({
                'id': user.id,
                'email': user.email,
                'first_name': user.firstName,
                'second_name': user.secondName,
                'phone': user.phone,
                'role': user.role,
                'orders': [
                    {
                        'id': order.id,
                        'total':float(order.total_amount),
                        'item_count': len(order.items) if order.items else 0,
                        'date': order.created_at.isoformat()
                    }
                    for order in user.orders
                ]if user.orders else None,
                'address': {
                    'city': user.addresses[0].town,
                    'state': user.addresses[0].county,
                    'country': user.addresses[0].country
                }if user.addresses else None,
                'totalSpent': float(sum(order.total_amount for order in user.orders)),
                'created_at': user.created_at.isoformat(),
                'order_count': order_count
            })
        
        return {
            'users': users,
            'pagination': {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }, 200


class AdminUserResource(Resource):
    """Single user management"""
    
    @jwt_required()
    def put(self, user_id):
        """Update user"""
        admin_id = get_jwt_identity()
        admin_user = User.query.get(admin_id)
        
        if not admin_user or admin_user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        user = User.query.get_or_404(user_id)
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        try:
            update_fields = [
                'first_name', 'last_name', 'role', 
                'email_verified', 'phone'
            ]
            
            for field in update_fields:
                if field in data:
                    setattr(user, field, data[field])
            
            user.updated_at = datetime.utcnow()
            db.session.commit()
            
            return {
                'message': 'User updated successfully',
                'user_id': user.id,
                'username': user.username
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to update user: {str(e)}'}, 500


class AdminOrdersResource(Resource):
    """Admin order management"""
    
    @jwt_required()
    def get(self):
        """Get all orders"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        # Parse query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        search = request.args.get('search')
        sort = request.args.get('sort', 'created_at')
        order = request.args.get('order', 'desc')
        
        # Build query
        query = Order.query
        
        if status:
            query = query.filter_by(status=status)
        
        if start_date:
            try:
                start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                query = query.filter(Order.created_at >= start)
            except ValueError:
                pass
        
        if end_date:
            try:
                end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
                query = query.filter(Order.created_at <= end)
            except ValueError:
                pass
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (Order.order_number.ilike(search_term))
            )
        
        # Apply sorting
        if sort == 'total_amount':
            if order == 'asc':
                query = query.order_by(Order.total_amount.asc())
            else:
                query = query.order_by(Order.total_amount.desc())
        else:  # created_at
            if order == 'asc':
                query = query.order_by(Order.created_at.asc())
            else:
                query = query.order_by(Order.created_at.desc())
        
        # Pagination
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        orders = []
        for order in pagination.items:
            user = User.query.get(order.user_id)
            orders.append({
                'id': order.id,
                'order_number': order.order_number,
                'user': {
                    'id': user.id,
                    'name': f'{user.firstName} {user.secondName}',
                    'email': user.email,
                    'phone': user.phone,
                    'role': user.role
                } if user else None,
                'status': order.status,
                'subtotal': float(order.subtotal),
                'tax': float(order.tax_amount),
                'shipping_amount': float(order.shipping_amount),
                'total_amount': float(order.total_amount),
                'items': [{
                    'id': item.id,
                    'book_image': item.book.cover_image_url,
                    'book_title': item.book_title,
                    'book_author': item.book_author,
                    'unit_price': float(item.unit_price),
                    'quantity': item.quantity,
                    'total_price': float(item.total_price)
                }for item in order.items] if order.items else 0,
                'item_count': len(order.items),
                'created_at': order.created_at.isoformat(),
                'shipping_address': {
                    'full_name': order.shipping_address.full_name,
                    'city': order.shipping_address.town,
                    'state': order.shipping_address.county,
                    'country': order.shipping_address.country
                }
            })
        
        return {
            'orders': orders,
            'pagination': {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }, 200


class AdminOrderStatusResource(Resource):
    """Update order status"""
    
    @jwt_required()
    def put(self, order_id):
        """Update order status"""
        admin_id = get_jwt_identity()
        admin_user = User.query.get(admin_id)
        
        if not admin_user or admin_user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        order = Order.query.get_or_404(order_id)
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        status = data.get('status')
        tracking_number = data.get('tracking_number')
        notes = data.get('notes')
        
        if not status:
            return {'error': 'Status is required'}, 400
        
        valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        if status not in valid_statuses:
            return {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}, 400
        
        try:
            order.status = status
            
            if tracking_number:
                order.tracking_number = tracking_number
            
            if notes:
                order.customer_note = notes
            
            order.updated_at = datetime.utcnow()
            db.session.commit()
            
            return {
                'message': 'Order status updated successfully',
                'order_id': order.id,
                'status': order.status,
                'tracking_number': order.tracking_number
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to update order status: {str(e)}'}, 500


class AdminReviewsResource(Resource):
    """Admin review management"""
    
    @jwt_required()
    def get(self):
        """Get all reviews"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        # Parse query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        book_id = request.args.get('book_id')
        user_id_filter = request.args.get('user_id')
        sort = request.args.get('sort', 'created_at')
        order = request.args.get('order', 'desc')
        
        # Build query
        query = Review.query
        
        if status:
            query = query.filter_by(status=status)
        
        if book_id:
            query = query.filter_by(book_id=book_id)
        
        if user_id_filter:
            query = query.filter_by(user_id=user_id_filter)
        print('here')
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
            # print(review)
            user = User.query.get(review.user_id)
            book = Book.query.get(review.book_id)
            
            reviews.append({
                'id': review.id,
                'user': {
                    'id': user.id,
                    'email': user.email
                } if user else None,
                'book': {
                    'id': book.id,
                    'title': book.title,
                    'author': book.author
                } if book else None,
                'rating': review.rating,
                'content': review.content,
                'status': review.status,
                'helpful_count': review.helpful_count,
                'verified_purchase': review.is_verified_purchase,
                'admin_response': review.moderation_notes,
                'created_at': review.created_at.isoformat(),
                'updated_at': review.updated_at.isoformat() if review.updated_at else None
            })
        
        return {
            'reviews': reviews,
            'pagination': {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }, 200


class AdminReviewResource(Resource):
    """Admin review management"""
    
    @jwt_required()
    def get(self):
        """Get all reviews with filtering"""
        current_user = User.query.get(get_jwt_identity())
        if not current_user or current_user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        # Parse query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        book_id = request.args.get('book_id')
        user_id = request.args.get('user_id')
        sort = request.args.get('sort', 'created_at')
        order = request.args.get('order', 'desc')
        search = request.args.get('search', '')
        
        # Build query
        query = Review.query
        
        if status:
            query = query.filter_by(status=status)
        if book_id:
            query = query.filter_by(book_id=book_id)
        if user_id:
            query = query.filter_by(user_id=user_id)
        
        # Search
        if search:
            search_term = f"%{search}%"
            query = query.join(User).filter(
                db.or_(
                    User.username.ilike(search_term),
                    User.email.ilike(search_term),
                    Review.content.ilike(search_term),
                    Review.title.ilike(search_term)
                )
            )
        
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
            book = Book.query.get(review.book_id)
            reviews.append({
                'id': review.id,
                'book': {
                    'id': book.id,
                    'title': book.title,
                    'author': book.author,
                    'image': book.cover_image_url
                } if book else None,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'name': f"{user.first_name} {user.last_name}".strip() or user.username
                } if user else None,
                'rating': review.rating,
                'title': review.title,
                'content': review.content,
                'status': review.status,
                'helpfulCount': review.helpful_count,
                'unhelpfulCount': review.not_helpful_count,
                'verifiedPurchase': review.is_verified_purchase,
                'createdAt': review.created_at.isoformat(),
                'updatedAt': review.updated_at.isoformat() if review.updated_at else None,
                'response': {
                    'adminName': review.moderation_notes,
                    'content': review.moderated_by,
                    'createdAt': review.moderated_at.isoformat() if review.moderated_at else None
                } if review.moderated_by else None
            })
        
        return {
            'reviews': reviews,
            'pagination': {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }, 200
    
    @jwt_required()
    def put(self, review_id):
        """Update review status"""
        current_user = User.query.get(get_jwt_identity())
        if not current_user or current_user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        review = Review.query.get_or_404(review_id)
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        print(data)
        try:
            if 'status' in data:
                status = data['status']
                if status in ['approved', 'rejected']:
                    if status == 'approved':
                        review.approve(current_user.id)
                        print ('here')
                    else:
                        review.reject(current_user.id, data.get('admin_response'))
                        print ('here')
                else:
                    review.status = status
            
            if 'admin_response' in data:
                review.moderation_notes = data['admin_response']
            
            db.session.commit()
            
            return {
                'message': 'Review updated successfully',
                'review_id': review.id,
                'status': review.status
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to update review: {str(e)}'}, 500
    
    @jwt_required()
    def delete(self, review_id):
        """Delete review"""
        current_user = User.query.get(get_jwt_identity())
        if not current_user or current_user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        review = Review.query.get_or_404(review_id)
        
        try:
            db.session.delete(review)
            db.session.commit()
            
            return {'message': 'Review deleted successfully'}, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to delete review: {str(e)}'}, 500


class AdminReviewResponseResource(Resource):
    """Admin review responses"""
    
    @jwt_required()
    def post(self, review_id):
        """Add admin response to review"""
        current_user = User.query.get(get_jwt_identity())
        if not current_user or current_user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        review = Review.query.get_or_404(review_id)
        
        data = request.get_json()
        if not data or not data.get('content'):
            return {'error': 'Response content required'}, 400
        
        try:
            review.moderation_notes = data['content']
            review.moderated_by = current_user.id
            review.moderated_at = datetime.utcnow()
            
            db.session.commit()
            
            return {
                'message': 'Response added successfully',
                'review_id': review.id,
                'response': {
                    'adminName': f"{current_user.first_name} {current_user.last_name}".strip() or current_user.username,
                    'content': data['content'],
                    'createdAt': review.moderated_at.isoformat()
                }
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to add response: {str(e)}'}, 500