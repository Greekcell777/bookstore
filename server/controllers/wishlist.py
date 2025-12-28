from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models import Wishlist, WishlistItem, Book, Cart, CartItem
from server.config import db
from datetime import datetime

class WishlistResource(Resource):
    """Wishlist management"""
    
    @jwt_required()
    def get(self):
        """Get user's wishlist"""
        user_id = get_jwt_identity()
        
        # Get or create wishlist
        wishlist = Wishlist.query.filter_by(user_id=user_id).first()
        
        if not wishlist:
            wishlist = Wishlist(user_id=user_id)
            db.session.add(wishlist)
            db.session.commit()
        
        # Get wishlist items with book details
        wishlist_items = WishlistItem.query.filter_by(wishlist_id=wishlist.id).all()
        
        items = []
        
        for item in wishlist_items:
            book = Book.query.get(item.book_id)
            if book:
                items.append({
                    'id': item.id,
                    'book_id': item.book_id,
                    'title': book.title,
                    'author': book.author,
                    'cover_image_url': book.cover_image_url,
                    'list_price': float(book.list_price),
                    'sale_price': float(book.sale_price) if book.sale_price else None,
                    'current_price': float(book.get_current_price()),
                    'is_available': book.is_available,
                    'stock_quantity': book.stock_quantity,
                    'average_rating': book.average_rating,
                    'rating_count': book.rating_count,
                    'discount_percentage': book.calculate_discount_percentage(),
                    'added_at': item.created_at.isoformat() if item.created_at else None
                })
        
        return {
            'wishlist_id': wishlist.id,
            'user_id': user_id,
            'items': items,
            'item_count': len(items),
            'created_at': wishlist.created_at.isoformat() if wishlist.created_at else None,
            'updated_at': wishlist.updated_at.isoformat() if wishlist.updated_at else None
        }, 200


class WishlistItemResource(Resource):
    """Wishlist item management"""
    
    @jwt_required()
    def post(self):
        """Add item to wishlist"""
        user_id = get_jwt_identity()['id']
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        book_id = data.get('book_id')
        
        if not book_id:
            return {'error': 'Book ID is required'}, 400
        
        # Validate book exists
        book = Book.query.get(book_id)
        if not book:
            return {'error': 'Book not found'}, 404
        
        try:
            # Get or create wishlist
            wishlist = Wishlist.query.filter_by(user_id=user_id).first()
            if not wishlist:
                wishlist = Wishlist(user_id=user_id)
                db.session.add(wishlist)
                db.session.commit()
            
            # Check if item already exists in wishlist
            existing_item = WishlistItem.query.filter_by(
                wishlist_id=wishlist.id, 
                book_id=book_id
            ).first()
            
            if existing_item:
                return {'error': 'Book is already in wishlist'}, 400
            
            # Create wishlist item
            wishlist_item = WishlistItem(
                wishlist_id=wishlist.id,
                book_id=book_id
            )
            
            db.session.add(wishlist_item)
            db.session.commit()
            
            return {
                'message': 'Item added to wishlist',
                'wishlist_item_id': wishlist_item.id
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to add item to wishlist: {str(e)}'}, 500
    
    @jwt_required()
    def delete(self, item_id):
        """Remove item from wishlist"""
        user_id = get_jwt_identity()['id']
        
        # Find wishlist item
        wishlist_item = WishlistItem.query.get(item_id)
        if not wishlist_item:
            return {'error': 'Wishlist item not found'}, 404
        
        # Verify wishlist belongs to user
        wishlist = Wishlist.query.get(wishlist_item.wishlist_id)
        if wishlist.user_id != user_id:
            return {'error': 'Unauthorized'}, 403
        
        try:
            db.session.delete(wishlist_item)
            db.session.commit()
            
            return {'message': 'Item removed from wishlist'}, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to remove item: {str(e)}'}, 500


class WishlistMoveToCartResource(Resource):
    """Move wishlist item to cart"""
    
    @jwt_required()
    def post(self, item_id):
        """Move item from wishlist to cart"""
        user_id = get_jwt_identity()['id']
        
        # Find wishlist item
        wishlist_item = WishlistItem.query.get(item_id)
        if not wishlist_item:
            return {'error': 'Wishlist item not found'}, 404
        
        # Verify wishlist belongs to user
        wishlist = Wishlist.query.get(wishlist_item.wishlist_id)
        if wishlist.user_id != user_id:
            return {'error': 'Unauthorized'}, 403
        
        # Validate book
        book = Book.query.get(wishlist_item.book_id)
        if not book:
            return {'error': 'Book not found'}, 404
        
        if not book.is_available:
            return {'error': 'Book is not available'}, 400
        
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
                book_id=wishlist_item.book_id
            ).first()
            
            if cart_item:
                # Update quantity
                cart_item.quantity += 1
            else:
                # Create new cart item
                cart_item = CartItem(
                    cart_id=cart.id,
                    book_id=wishlist_item.book_id,
                    quantity=1
                )
                db.session.add(cart_item)
            
            # Remove from wishlist
            db.session.delete(wishlist_item)
            
            db.session.commit()
            
            return {
                'message': 'Item moved to cart',
                'cart_item_id': cart_item.id,
                'quantity': cart_item.quantity
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to move item to cart: {str(e)}'}, 500