from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models import Order, OrderItem, Cart, CartItem, Book, User, Address, Payment
from server.config import db
from datetime import datetime
import decimal

class OrderListResource(Resource):
    """Order management"""
    
    @jwt_required()
    def get(self):
        """Get user's orders"""
        user_id = get_jwt_identity()
        
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
                'item_count': order.item_count if hasattr(order, 'item_count') else len(order.items) if order.items else 0,
                'created_at': order.created_at.isoformat(),
                'updated_at': order.updated_at.isoformat() if order.updated_at else None,
                'payment_method': order.payment_method if hasattr(order, 'payment_method') else None,
                'tracking_number': order.tracking_number if hasattr(order, 'tracking_number') else None,
                'estimated_delivery': order.estimated_delivery.isoformat() if hasattr(order, 'estimated_delivery') and order.estimated_delivery else None,
                'shipping_address': {
                    'full_name': order.shipping_full_name,
                    'street': order.shipping_street,
                    'city': order.shipping_city,
                    'state': order.shipping_state,
                    'postal_code': order.shipping_postal_code,
                    'country': order.shipping_country,
                    'phone': order.shipping_phone
                } if hasattr(order, 'shipping_full_name') and order.shipping_full_name else None
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
        """Create order from cart with new shipping address"""
        user_id = get_jwt_identity()
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        
        # Get shipping address from request
        shipping_address_data = data.get('shipping_address')
        if not shipping_address_data:
            return {'error': 'Shipping address is required'}, 400
        
        # Validate shipping address fields
        required_fields = ['fullName', 'address', 'city', 'phone', 'email']
        # Handle both camelCase and snake_case
        address_fields_mapping = {
            'fullName': 'full_name',
            'address': 'address_line1',
            'phone': 'phone',
            'email': 'email',
            'city': 'city',
            'county': 'county',
            'postalCode': 'postal_code',
            'country': 'country',
            'street':'street'
        }
        
        # Convert camelCase to snake_case
        shipping_address = {}
        for camel_key, snake_key in address_fields_mapping.items():
            if camel_key in shipping_address_data:
                shipping_address[snake_key] = shipping_address_data[camel_key]
            elif snake_key in shipping_address_data:
                shipping_address[snake_key] = shipping_address_data[snake_key]
        
        # Check required fields
        missing_fields = []
        for field in ['full_name', 'street', 'city', 'phone', 'email']:
            if not shipping_address.get(field):
                missing_fields.append(field)
        
        if missing_fields:
            return {'error': f'Missing required shipping address fields: {", ".join(missing_fields)}'}, 400
        
        # Payment method and M-Pesa phone
        payment_method = data.get('payment_method', 'mpesa')
        mpesa_phone = data.get('mpesa_phone') if payment_method == 'mpesa' else None
        
        # Notes (optional)
        notes = data.get('notes', '')
        
        # Get shipping and tax costs from request
        shipping_cost = decimal.Decimal(str(data.get('shipping_cost', '0.00')))
        tax_amount = decimal.Decimal(str(data.get('tax_amount', '0.00')))
        
        try:
            # Get user's active cart
            cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
            if not cart:
                return {'error': 'Cart is empty'}, 400
            
            cart_items = CartItem.query.filter_by(cart_id=cart.id).all()
            if not cart_items:
                return {'error': 'Cart is empty'}, 400
            
            # Validate cart items and calculate totals
            subtotal = decimal.Decimal('0.00')
            item_count = 0
            items_details = []
            
            for cart_item in cart_items:
                book = Book.query.get(cart_item.book_id)
                if not book:
                    return {'error': f'Book with ID {cart_item.book_id} not found'}, 404
                
                if not book.is_available:
                    return {'error': f'Book "{book.title}" is no longer available'}, 400
                
                # Check stock for physical books
                if book.format != 'ebook' and book.stock_quantity < cart_item.quantity and not book.allow_backorders:
                    return {'error': f'Insufficient stock for "{book.title}"'}, 400
                
                price = book.get_current_price()
                item_total = price * cart_item.quantity
                subtotal += item_total
                item_count += cart_item.quantity
                
                # Store item details for order creation
                items_details.append({
                    'book': book,
                    'cart_item': cart_item,
                    'price': price,
                    'item_total': item_total
                })
            
            # Calculate total
            total_amount = subtotal + shipping_cost + tax_amount
            
            # Generate order number
            timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
            order_number = f'ORD-{timestamp}-{user_id:04d}'
            
            # Build full name if not provided
            full_name = shipping_address.get('full_name')
            if not full_name:
                first_name = shipping_address.get('first_name', '')
                last_name = shipping_address.get('last_name', '')
                full_name = f"{first_name} {last_name}".strip()

            shipping = Address(
                user_id=user_id,
                full_name=full_name,
                town=shipping_address['city'],
                county=shipping_address.get('county', ''),
                postal_code=shipping_address.get('postal_code', ''),
                country=shipping_address.get('country', 'Kenya'),
                phone=shipping_address['phone'],
                address_line1=shipping_address['address_line1']
            )

            db.session.add(shipping)
            db.session.commit()
            # Create order with shipping address
            order = Order(
                user_id=user_id,
                order_number=order_number,
                total_amount=total_amount,
                # item_count=item_count,
                status='pending',  # Initial status
                payment_method=payment_method,
                customer_note=notes,
                shipping_address_id=shipping.id,
                billing_address_id=shipping.id,
                
                # Store financial breakdown
                subtotal=subtotal,
                shipping_amount=shipping_cost,
                tax_amount=tax_amount
            )
            
            db.session.add(order)
            db.session.flush()  # Get order ID
            
            # Create order items and update book stock/sales
            order_items = []
            for item_detail in items_details:
                book = item_detail['book']
                cart_item = item_detail['cart_item']
                price = item_detail['price']
                
                order_item = OrderItem(
                    order_id=order.id,
                    book_id=book.id,
                    quantity=cart_item.quantity,
                    unit_price=price,
                    book_title=book.title,
                    book_author=book.author,
                    total_price=price*cart_item.quantity,
                    cover_image=book.cover_image_url,
                )
                db.session.add(order_item)
                order_items.append(order_item)
                
                # Update book stock for physical books
                if book.format != 'ebook':
                    if book.stock_quantity >= cart_item.quantity:
                        book.stock_quantity -= cart_item.quantity
                    # If allow_backorders, don't reduce stock
                
                # Update book sales statistics
                book.total_sold = (book.total_sold or 0) + cart_item.quantity
                book.total_revenue = (book.total_revenue or decimal.Decimal('0.00')) + item_detail['item_total']
                
                # Remove from cart
                db.session.delete(cart_item)
            
            # Deactivate cart
            cart.is_active = False
            cart.updated_at = datetime.utcnow()
            
            # Simulate M-Pesa payment if selected
            if payment_method == 'mpesa':
                # Simulate successful M-Pesa payment
                payment_status = 'paid'
                transaction_id = f'MPESA{int(datetime.utcnow().timestamp())}'
                order.status = 'processing'  # Move to processing after payment
                
                # You could add a delay here to simulate real payment processing
                # For now, we'll mark it as completed immediately
                print(f"Simulating M-Pesa payment for phone: {mpesa_phone}")
                print(f"Transaction ID: {transaction_id}")
            else:
                # For other payment methods, set appropriate status
                if payment_method == 'cash':
                    payment_status = 'pending'
                    transaction_id = None
                    order.status = 'pending'  # COD orders stay pending until delivery
                else:
                    payment_status = 'paid'
                    transaction_id = f'{payment_method.upper()}{int(datetime.utcnow().timestamp())}'
                    order.status = 'processing'
            
            # Create payment record
            payment = Payment(
                order_id=order.id,
                payment_number=transaction_id,
                amount=total_amount,
                method=payment_method,
                status=payment_status,
                customer_phone='+25474511366',
                completed_at=datetime.utcnow() if payment_status == 'paid' else None
            )
            db.session.add(payment)
            
            db.session.commit()
            
            # Return order details
            return {
                'message': 'Order created successfully',
                'order': {
                    'id': order.id,
                    'order_number': order.order_number,
                    'status': order.status,
                    'total_amount': float(order.total_amount),
                    'item_count': len(order.items)if order.items else 0,
                    'created_at': order.created_at.isoformat(),
                    'payment_method': order.payment_method,
                    'payment_status': payment_status,
                    'transaction_id': transaction_id,
                    'shipping_address': {
                        'full_name': order.shipping_address.full_name,
                        'city': order.shipping_address.town,
                        'state': order.shipping_address.county,
                        'postal_code': order.shipping_address.postal_code,
                        'country': order.shipping_address.country,
                        'phone': order.user.phone,
                        'email': order.user.email
                    },
                    'items': [
                        {
                            'id': item.id,
                            'book_id': item.book_id,
                            'quantity': item.quantity,
                            'unit_price': float(item.unit_price),
                            'book_title': item.book_title,
                            'book_author': item.book_author,
                            'book_cover_url': item.cover_image
                        } for item in order_items
                    ],
                    'financial_details': {
                        'subtotal': float(order.subtotal),
                        'shipping_cost': float(order.shipping_amount),
                        'tax_amount': float(order.tax_amount),
                        'total': float(order.total_amount)
                    }
                }
            }, 201
            
        except Exception as e:
            db.session.rollback()
            import traceback
            print("Error creating order:", str(e))
            print(traceback.format_exc())
            return {'error': f'Failed to create order: {str(e)}'}, 500


# Add endpoint for getting single order details
class OrderResource(Resource):
    """Single order management"""
    
    @jwt_required()
    def get(self, order_id):
        """Get specific order details"""
        user_id = get_jwt_identity()
        
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        if not order:
            return {'error': 'Order not found'}, 404
        
        # Get payment info
        payment = Payment.query.filter_by(order_id=order.id).first()
        
        return {
            'order': {
                'id': order.id,
                'order_number': order.order_number,
                'status': order.status,
                'total_amount': float(order.total_amount),
                'item_count': order.item_count,
                'created_at': order.created_at.isoformat(),
                'updated_at': order.updated_at.isoformat() if order.updated_at else None,
                'payment_method': order.payment_method,
                'notes': order.notes,
                'tracking_number': order.tracking_number if hasattr(order, 'tracking_number') else None,
                'estimated_delivery': order.estimated_delivery.isoformat() if hasattr(order, 'estimated_delivery') and order.estimated_delivery else None,
                'delivered_at': order.delivered_at.isoformat() if hasattr(order, 'delivered_at') and order.delivered_at else None,
                'shipping_address': {
                    'full_name': order.shipping_full_name,
                    'street': order.shipping_street,
                    'city': order.shipping_city,
                    'state': order.shipping_state,
                    'postal_code': order.shipping_postal_code,
                    'country': order.shipping_country,
                    'phone': order.shipping_phone,
                    'email': order.shipping_email
                },
                'items': [
                    {
                        'id': item.id,
                        'book_id': item.book_id,
                        'quantity': item.quantity,
                        'unit_price': float(item.unit_price),
                        'total_price': float(item.unit_price * item.quantity),
                        'book_title': item.book_title,
                        'book_author': item.book_author,
                        'book_cover_url': item.book_cover_url,
                        'book_format': item.book_format
                    } for item in order.items
                ],
                'financial_details': {
                    'subtotal': float(order.subtotal) if hasattr(order, 'subtotal') and order.subtotal else None,
                    'shipping_cost': float(order.shipping_cost) if hasattr(order, 'shipping_cost') and order.shipping_cost else None,
                    'tax_amount': float(order.tax_amount) if hasattr(order, 'tax_amount') and order.tax_amount else None,
                    'total': float(order.total_amount)
                },
                'payment': {
                    'status': payment.status if payment else None,
                    'transaction_id': payment.transaction_id if payment else None,
                    'paid_at': payment.paid_at.isoformat() if payment and payment.paid_at else None
                }
            }
        }, 200
    
    @jwt_required()
    def put(self, order_id):
        """Update order (e.g., cancel order)"""
        user_id = get_jwt_identity()
        
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        if not order:
            return {'error': 'Order not found'}, 404
        
        data = request.get_json()
        
        # Only allow cancellation of pending or processing orders
        if data.get('action') == 'cancel' and order.status in ['pending', 'processing']:
            try:
                order.status = 'cancelled'
                order.updated_at = datetime.utcnow()
                
                # Restock items if order is cancelled
                if order.status in ['pending', 'processing']:
                    for item in order.items:
                        book = Book.query.get(item.book_id)
                        if book and book.format != 'ebook':
                            book.stock_quantity += item.quantity
                
                db.session.commit()
                
                return {
                    'message': 'Order cancelled successfully',
                    'order_id': order.id,
                    'status': order.status
                }, 200
            except Exception as e:
                db.session.rollback()
                return {'error': f'Failed to cancel order: {str(e)}'}, 500
        
        return {'error': 'Invalid action or order cannot be cancelled'}, 400


# Add endpoint to simulate M-Pesa callback (for testing)
class MpesaCallbackResource(Resource):
    """Simulate M-Pesa callback for testing"""
    
    def post(self):
        """Simulate M-Pesa callback"""
        data = request.get_json()
        
        # This would be called by Safaricom's M-Pesa API
        # For simulation, we accept a manual callback
        transaction_id = data.get('transaction_id')
        status = data.get('status', 'completed')  # 'completed' or 'failed'
        
        if not transaction_id:
            return {'error': 'Transaction ID required'}, 400
        
        # Find payment by transaction ID
        payment = Payment.query.filter_by(transaction_id=transaction_id).first()
        if not payment:
            return {'error': 'Payment not found'}, 404
        
        order = Order.query.get(payment.order_id)
        if not order:
            return {'error': 'Order not found'}, 404
        
        try:
            if status == 'completed':
                payment.status = 'completed'
                payment.paid_at = datetime.utcnow()
                order.status = 'processing'
                
                # Update payment response data
                payment.response_data = str(data)
                
                db.session.commit()
                
                return {
                    'message': 'Payment confirmed successfully',
                    'order_id': order.id,
                    'order_status': order.status,
                    'payment_status': payment.status
                }, 200
            else:
                payment.status = 'failed'
                payment.response_data = str(data)
                db.session.commit()
                
                return {
                    'message': 'Payment failed',
                    'order_id': order.id,
                    'order_status': order.status,
                    'payment_status': payment.status
                }, 200
                
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to process callback: {str(e)}'}, 500