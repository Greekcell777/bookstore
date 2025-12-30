from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models import Cart, CartItem, Book, User
from server.config import db
from datetime import datetime

class CartResource(Resource):
    """Cart management"""
    
    @jwt_required()
    def get(self):
        """Get user's cart with items"""
        user_id = get_jwt_identity()
        print(user_id)
        # Get or create cart
        cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
        
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.commit()
        
        # Get cart items with book details
        cart_items = CartItem.query.filter_by(cart_id=cart.id).all()
        
        items = []
        total_amount = 0
        
        for item in cart_items:
            book = Book.query.get(item.book_id)
            if book and book.is_available:
                item_total = float(book.get_current_price()) * item.quantity
                items.append({
                    'id': item.id,
                    'book_id': item.book_id,
                    'title': book.title,
                    'author': book.author,
                    'cover_image_url': book.cover_image_url,
                    'list_price': float(book.list_price),
                    'sale_price': float(book.sale_price) if book.sale_price else None,
                    'current_price': float(book.get_current_price()),
                    'quantity': item.quantity,
                    'item_total': item_total,
                    'stock_quantity': book.stock_quantity,
                    'is_available': book.is_available
                })
                total_amount += item_total
        
        return {
            'cart_id': cart.id,
            'user_id': user_id,
            'items': items,
            'item_count': len(items),
            'total_amount': total_amount,
            'created_at': cart.created_at.isoformat() if cart.created_at else None,
            'updated_at': cart.updated_at.isoformat() if cart.updated_at else None
        }, 200
    
    @jwt_required()
    def delete(self):
        """Clear entire cart"""
        user_id = get_jwt_identity()
        
        cart = Cart.query.filter_by(user_id=user_id).first()
        print(cart)
        if not cart:
            return {'message': 'Cart not found'}, 404
        
        try:
            # Delete all cart items
            CartItem.query.filter_by(cart_id=cart.id).delete()
            db.session.commit()
            
            return {'message': 'Cart cleared successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to clear cart: {str(e)}'}, 500


class CartItemResource(Resource):
    """Cart item management"""
    
    @jwt_required()
    def post(self):
        """Add item to cart"""
        user_id = get_jwt_identity()
        
        data = request.get_json()
        
        if not data:
            return {'error': 'No data provided'}, 400
        
        book_id = data.get('bookId')
        quantity = data.get('quantity', 1)
        
        if not book_id:
            return {'error': 'Book ID is required'}, 400
        
        # Validate book exists and is available
        book = Book.query.get(book_id)
        if not book:
            return {'error': 'Book not found'}, 404
        
        if not book.is_available:
            return {'error': 'Book is not available'}, 400
        
        # Check stock
        if book.stock_quantity < quantity and not book.allow_backorders:
            return {'error': 'Insufficient stock'}, 400
        
        try:
            # Get or create cart
            cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
            if not cart:
                cart = Cart(user_id=user_id)
                db.session.add(cart)
                db.session.commit()
            
            # Check if item already exists in cart
            cart_item = CartItem.query.filter_by(
                cart_id=cart.id, 
                book_id=book_id
            ).first()
            
            if cart_item:
                # Update quantity
                cart_item.quantity += quantity
            else:
                # Create new cart item
                cart_item = CartItem(
                    cart_id=cart.id,
                    book_id=book_id,
                    quantity=quantity
                )
                db.session.add(cart_item)
            
            db.session.commit()
            
            return {
                'message': 'Item added to cart',
                'cart_item_id': cart_item.id,
                'quantity': cart_item.quantity
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to add item to cart: {str(e)}'}, 500
    
    @jwt_required()
    def put(self, item_id):
        """Update cart item quantity"""
        user_id = get_jwt_identity()
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        quantity = data.get('quantity')
        if quantity is None or quantity < 1:
            return {'error': 'Valid quantity is required'}, 400
        
        # Find cart item
        cart_item = CartItem.query.get(item_id)
        if not cart_item:
            return {'error': 'Cart item not found'}, 404
        
        # Verify cart belongs to user
        cart = Cart.query.get(cart_item.cart_id)
        if cart.user_id != user_id:
            return {'error': 'Unauthorized'}, 403
        
        # Validate book availability
        book = Book.query.get(cart_item.book_id)
        if not book.is_available:
            return {'error': 'Book is no longer available'}, 400
        
        # Check stock
        if book.stock_quantity < quantity and not book.allow_backorders:
            return {'error': 'Insufficient stock'}, 400
        
        try:
            cart_item.quantity = quantity
            cart_item.updated_at = datetime.utcnow()
            db.session.commit()
            
            return {
                'message': 'Cart item updated',
                'quantity': cart_item.quantity
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to update cart item: {str(e)}'}, 500

class CartByID(Resource):
    @jwt_required()
    def delete(self, item_id):
        """Remove item from cart"""
        user_id = get_jwt_identity()
        
        # Find cart item
        cart_item = CartItem.query.get(item_id)
        if not cart_item:
            return {'error': 'Cart item not found'}, 404
        print('removing from cart')
        # Verify cart belongs to user
        cart = Cart.query.get(cart_item.cart_id)
        if cart.user_id != user_id:
            return {'error': 'Unauthorized'}, 403
        
        try:
            db.session.delete(cart_item)
            db.session.commit()
            
            return {'message': 'Item removed from cart'}, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to remove item: {str(e)}'}, 500