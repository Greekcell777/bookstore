from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models import Order, OrderItem, Cart, CartItem, Book, User, Address
from server.config import db
from datetime import datetime
import decimal

class OrderListResource(Resource):
    """Order management"""
    
    @jwt_required()
    def get(self):
        """Get user's orders"""
        user_id = get_jwt_identity()['id']
        
        # Parse query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        # Build query
        query = Order.query.filter_by(user_id=user_id)
        
        if status:
            query = query.filter_by(status=status)
        
        # Order by latest first
        query = query.order_by(Order.created_at.desc())
        
        # Pagination
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        orders = []
        for order in pagination.items:
            orders.append({
                'id': order.id,
                'order_number': order.order_number,
                'status': order.status,
                'total_amount': float(order.total_amount),
                'item_count': order.item_count,
                'created_at': order.created_at.isoformat(),
                'shipping_address': {
                    'full_name': order.shipping_full_name,
                    'street': order.shipping_street,
                    'city': order.shipping_city,
                    'state': order.shipping_state,
                    'postal_code': order.shipping_postal_code,
                    'country': order.shipping_country
                } if order.shipping_street else None
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
    
    @jwt_required()
    def post(self):
        """Create order from cart"""
        user_id = get_jwt_identity()['id']
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        # Validate required fields
        shipping_address_id = data.get('shipping_address_id')
        billing_address_id = data.get('billing_address_id', shipping_address_id)
        
        if not shipping_address_id:
            return {'error': 'Shipping address is required'}, 400
        
        # Get addresses
        shipping_address = Address.query.filter_by(
            id=shipping_address_id, 
            user_id=user_id
        ).first()
        
        if not shipping_address:
            return {'error': 'Shipping address not found'}, 404
        
        billing_address = None
        if billing_address_id:
            billing_address = Address.query.filter_by(
                id=billing_address_id, 
                user_id=user_id
            ).first()
            if not billing_address:
                return {'error': 'Billing address not found'}, 404
        
        try:
            # Get user's active cart
            cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
            if not cart:
                return {'error': 'Cart is empty'}, 400
            
            cart_items = CartItem.query.filter_by(cart_id=cart.id).all()
            if not cart_items:
                return {'error': 'Cart is empty'}, 400
            
            # Validate cart items
            total_amount = decimal.Decimal('0.00')
            item_count = 0
            
            for cart_item in cart_items:
                book = Book.query.get(cart_item.book_id)
                if not book or not book.is_available:
                    return {'error': f'Book "{book.title if book else "Unknown"}" is no longer available'}, 400
                
                if book.stock_quantity < cart_item.quantity and not book.allow_backorders:
                    return {'error': f'Insufficient stock for "{book.title}"'}, 400
                
                price = book.get_current_price()
                total_amount += price * cart_item.quantity
                item_count += cart_item.quantity
            
            # Generate order number
            order_number = f'ORD-{datetime.utcnow().strftime("%Y%m%d")}-{user_id:06d}'
            
            # Create order
            order = Order(
                user_id=user_id,
                order_number=order_number,
                total_amount=total_amount,
                item_count=item_count,
                status='pending',
                shipping_full_name=shipping_address.full_name,
                shipping_street=shipping_address.street,
                shipping_city=shipping_address.city,
                shipping_state=shipping_address.state,
                shipping_postal_code=shipping_address.postal_code,
                shipping_country=shipping_address.country,
                shipping_phone=shipping_address.phone
            )
            
            if billing_address:
                order.billing_full_name = billing_address.full_name
                order.billing_street = billing_address.street
                order.billing_city = billing_address.city
                order.billing_state = billing_address.state
                order.billing_postal_code = billing_address.postal_code
                order.billing_country = billing_address.country
            
            db.session.add(order)
            db.session.flush()  # Get order ID
            
            # Create order items and update book stock
            for cart_item in cart_items:
                book = Book.query.get(cart_item.book_id)
                
                order_item = OrderItem(
                    order_id=order.id,
                    book_id=book.id,
                    quantity=cart_item.quantity,
                    unit_price=book.get_current_price(),
                    book_title=book.title,
                    book_author=book.author,
                    book_cover_url=book.cover_image_url
                )
                db.session.add(order_item)
                
                # Update book stock
                book.increment_sales(cart_item.quantity, book.get_current_price())
                
                # Remove from cart
                db.session.delete(cart_item)
            
            # Deactivate cart
            cart.is_active = False
            cart.updated_at = datetime.utcnow()
            
            db.session.commit()
            
            return {
                'message': 'Order created successfully',
                'order_id': order.id,
                'order_number': order.order_number,
                'total_amount': float(order.total_amount),
                'status': order.status
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to create order: {str(e)}'}, 500


class OrderResource(Resource):
    """Single order management"""
    
    @jwt_required()
    def get(self, order_id):
        """Get order details"""
        user_id = get_jwt_identity()['id']
        
        order = Order.query.get_or_404(order_id)
        
        # Check authorization
        if order.user_id != user_id:
            # Check if user is admin
            user = User.query.get(user_id)
            if not user or user.role != 'admin':
                return {'error': 'Unauthorized'}, 403
        
        # Get order items
        order_items = OrderItem.query.filter_by(order_id=order.id).all()
        
        items = []
        for item in order_items:
            items.append({
                'id': item.id,
                'book_id': item.book_id,
                'book_title': item.book_title,
                'book_author': item.book_author,
                'book_cover_url': item.book_cover_url,
                'quantity': item.quantity,
                'unit_price': float(item.unit_price),
                'item_total': float(item.unit_price * item.quantity)
            })
        
        order_data = {
            'id': order.id,
            'order_number': order.order_number,
            'status': order.status,
            'total_amount': float(order.total_amount),
            'item_count': order.item_count,
            'items': items,
            'shipping_address': {
                'full_name': order.shipping_full_name,
                'street': order.shipping_street,
                'city': order.shipping_city,
                'state': order.shipping_state,
                'postal_code': order.shipping_postal_code,
                'country': order.shipping_country,
                'phone': order.shipping_phone
            },
            'billing_address': {
                'full_name': order.billing_full_name,
                'street': order.billing_street,
                'city': order.billing_city,
                'state': order.billing_state,
                'postal_code': order.billing_postal_code,
                'country': order.billing_country
            } if order.billing_street else None,
            'created_at': order.created_at.isoformat(),
            'updated_at': order.updated_at.isoformat() if order.updated_at else None,
            'payment_method': order.payment_method,
            'transaction_id': order.transaction_id,
            'tracking_number': order.tracking_number,
            'notes': order.notes
        }
        
        return order_data, 200
    
    @jwt_required()
    def post(self, order_id):
        """Cancel order"""
        user_id = get_jwt_identity()['id']
        
        order = Order.query.get_or_404(order_id)
        
        # Check authorization
        if order.user_id != user_id:
            return {'error': 'Unauthorized'}, 403
        
        # Check if order can be cancelled
        if order.status not in ['pending', 'processing']:
            return {'error': f'Order cannot be cancelled in "{order.status}" status'}, 400
        
        try:
            order.status = 'cancelled'
            order.updated_at = datetime.utcnow()
            
            # Restore book stock if needed
            if order.status == 'processing':
                order_items = OrderItem.query.filter_by(order_id=order.id).all()
                for item in order_items:
                    book = Book.query.get(item.book_id)
                    if book:
                        book.stock_quantity += item.quantity
                        book.total_sold -= item.quantity
                        book.total_revenue -= (item.unit_price * item.quantity)
            
            db.session.commit()
            
            return {
                'message': 'Order cancelled successfully',
                'order_id': order.id,
                'status': order.status
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to cancel order: {str(e)}'}, 500