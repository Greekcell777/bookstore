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
        user_id = get_jwt_identity()['id']
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
            total_reviews = Review.query.filter_by(status='published').count()
            
            # Today's stats
            today_orders = Order.query.filter(
                Order.created_at >= start_of_today
            ).count()
            
            today_revenue = db.session.query(
                db.func.sum(Order.total_amount)
            ).filter(
                Order.created_at >= start_of_today,
                Order.status.in_(['completed', 'delivered'])
            ).scalar() or decimal.Decimal('0.00')
            
            # Monthly stats
            monthly_revenue = db.session.query(
                db.func.sum(Order.total_amount)
            ).filter(
                Order.created_at >= start_of_month,
                Order.status.in_(['completed', 'delivered'])
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
                    Order.status.in_(['completed', 'delivered'])
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
        user_id = get_jwt_identity()['id']
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
                (User.username.ilike(search_term)) |
                (User.email.ilike(search_term)) |
                (User.first_name.ilike(search_term)) |
                (User.last_name.ilike(search_term))
            )
        
        if role:
            query = query.filter_by(role=role)
        
        if status:
            query = query.filter_by(status=status)
        
        # Apply sorting
        if sort == 'username':
            if order == 'asc':
                query = query.order_by(User.username.asc())
            else:
                query = query.order_by(User.username.desc())
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
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'status': user.status,
                'email_verified': user.email_verified,
                'created_at': user.created_at.isoformat(),
                'last_login': user.last_login.isoformat() if user.last_login else None,
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
        admin_id = get_jwt_identity()['id']
        admin_user = User.query.get(admin_id)
        
        if not admin_user or admin_user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        user = User.query.get_or_404(user_id)
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        try:
            update_fields = [
                'first_name', 'last_name', 'role', 'status', 
                'email_verified', 'phone', 'avatar_url', 'bio'
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
        user_id = get_jwt_identity()['id']
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
                (Order.order_number.ilike(search_term)) |
                (Order.shipping_full_name.ilike(search_term)) |
                (Order.shipping_email.ilike(search_term))
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
                    'username': user.username,
                    'email': user.email
                } if user else None,
                'status': order.status,
                'total_amount': float(order.total_amount),
                'item_count': order.item_count,
                'created_at': order.created_at.isoformat(),
                'shipping_address': {
                    'full_name': order.shipping_full_name,
                    'city': order.shipping_city,
                    'state': order.shipping_state
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
        admin_id = get_jwt_identity()['id']
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
                order.notes = notes
            
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
        user_id = get_jwt_identity()['id']
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
                'user': {
                    'id': user.id,
                    'username': user.username,
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
                'unhelpful_count': review.unhelpful_count,
                'verified_purchase': review.verified_purchase,
                'admin_response': review.admin_response,
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
    """Admin single review management"""
    
    @jwt_required()
    def put(self, review_id):
        """Update review status"""
        admin_id = get_jwt_identity()['id']
        admin_user = User.query.get(admin_id)
        
        if not admin_user or admin_user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        review = Review.query.get_or_404(review_id)
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        status = data.get('status')
        admin_response = data.get('admin_response')
        
        try:
            if status:
                valid_statuses = ['pending', 'published', 'rejected', 'flagged']
                if status not in valid_statuses:
                    return {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}, 400
                review.status = status
            
            if admin_response:
                review.admin_response = admin_response
            
            review.updated_at = datetime.utcnow()
            db.session.commit()
            
            return {
                'message': 'Review updated successfully',
                'review_id': review.id,
                'status': review.status
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to update review: {str(e)}'}, 500