# controllers/admin_books.py
from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models import Book, Category, Publisher, BookImage, User
from server.config import db
from datetime import datetime
import re
from sqlalchemy import or_, and_
import decimal

class BookListResource(Resource):
    """Get all books with optional filters"""
    
    def get(self):
        # Parse query parameters
        category = request.args.get('category')
        author = request.args.get('author')
        publisher_slug = request.args.get('publisher')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        format = request.args.get('format')
        language = request.args.get('language')
        in_stock = request.args.get('in_stock', type=lambda v: v.lower() == 'true' if v else None)
        featured = request.args.get('featured', type=lambda v: v.lower() == 'true' if v else None)
        bestseller = request.args.get('bestseller', type=lambda v: v.lower() == 'true' if v else None)
        new_release = request.args.get('new_release', type=lambda v: v.lower() == 'true' if v else None)
        status = request.args.get('status')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        sort = request.args.get('sort', 'created_at')
        order = request.args.get('order', 'desc')
        
        # Base query
        query = Book.query
        
        # Apply filters
        if category:
            category_obj = Category.query.filter_by(slug=category).first()
            if category_obj:
                query = query.filter(Book.categories.any(id=category_obj.id))
        
        if author:
            query = query.filter(Book.author.ilike(f"%{author}%"))
        
        if publisher_slug:
            publisher = Publisher.query.filter_by(slug=publisher_slug).first()
            if publisher:
                query = query.filter(Book.publisher_id == publisher.id)
        
        if min_price is not None:
            query = query.filter(Book.list_price >= decimal.Decimal(str(min_price)))
        
        if max_price is not None:
            query = query.filter(Book.list_price <= decimal.Decimal(str(max_price)))
        
        if format:
            query = query.filter(Book.format == format)
        
        if language:
            query = query.filter(Book.language == language)
        
        if in_stock is not None:
            query = query.filter(and_(
                Book.is_available == True,
                or_(
                    Book.stock_quantity > 0,
                    and_(
                        Book.allow_backorders == True,
                        Book.max_backorders > 0
                    )
                )
            ))
        
        if featured is not None:
            query = query.filter(Book.is_featured == featured)
        
        if bestseller is not None:
            query = query.filter(Book.is_bestseller == bestseller)
        
        if new_release is not None:
            query = query.filter(Book.is_new_release == new_release)
        
        if status:
            query = query.filter(Book.status == status)
        
        # Apply sorting
        if sort == 'title':
            order_field = Book.title.asc() if order == 'asc' else Book.title.desc()
        elif sort == 'price':
            order_field = Book.list_price.asc() if order == 'asc' else Book.list_price.desc()
        elif sort == 'rating':
            order_field = Book.average_rating.asc() if order == 'asc' else Book.average_rating.desc()
        elif sort == 'total_sold':
            order_field = Book.total_sold.asc() if order == 'asc' else Book.total_sold.desc()
        else:  # created_at
            order_field = Book.created_at.asc() if order == 'asc' else Book.created_at.desc()
        
        query = query.order_by(order_field)
        
        # Pagination
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        books_data = []
        for book in pagination.items:
            books_data.append(self._serialize_book(book))
        
        return {
            'books': books_data,
            'pagination': {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }, 200
    
    def _serialize_book(self, book):
        """Serialize book for list view"""
        return {
            'id': book.id,
            'title': book.title,
            'isbn_10': book.isbn_10,
            'isbn_13': book.isbn_13,
            'author': book.author,
            'slug': book.slug,
            'format': book.format,
            'publication_date': str(book.publication_date),
            'short_description': book.short_description,
            'description': book.description,
            'publisher': book.publisher,
            'edition': book.edition,
            'language': book.language,
            'page_count': book.page_count,
            'dimensions': book.dimensions,
            'weight_grams': book.weight_grams,
            'list_price': float(book.list_price) if book.list_price else None,
            'sale_price': float(book.sale_price) if book.sale_price else None,
            'cover_image_url': book.cover_image_url,
            'cover_image_alt': book.cover_image_alt,
            'average_rating': int((sum(review.rating for review in book.reviews)) / len(book.reviews))if book.reviews else 0,
            'rating_count': book.rating_count,
            'review_count': len(book.reviews),
            'is_available': book.is_available,
            'stock_quantity': book.stock_quantity,
            'is_featured': book.is_featured,
            'is_bestseller': book.is_bestseller,
            'is_new_release': book.is_new_release,
            'total_sold': book.total_sold,
            'status': book.status,
            'created_at': book.created_at.isoformat() if book.created_at else None,
            'discount_percentage': book.calculate_discount_percentage(),
            'current_price': float(book.get_current_price()),
            'stock_status': book.get_stock_status(),
            'categories': [{'id': c.id, 'name': c.name, 'slug': c.slug} for c in book.categories] if book.categories else [],
            'reviews': [{'id': r.id,'user': r.user.firstName, 'content': r.content, 'helpful_count': r.helpful_count, 'rating': r.rating} for r in book.reviews] if book.reviews else []
        }


class BookResource(Resource):
    """Get single book by ID"""
    
    def get(self, id):
        book = Book.query.get_or_404(id)
        return self._serialize_book_detail(book), 200
    
    def _serialize_book_detail(self, book):
        """Serialize book for detail view"""
        base_data = {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'slug': book.slug,
            'isbn_10': book.isbn_10,
            'isbn_13': book.isbn_13,
            'short_description': book.short_description,
            'description': book.description,
            'excerpt': book.excerpt,
            'publisher': book.publisher,
            'publisher_info': {
                'id': book.publisher_rel.id,
                'name': book.publisher_rel.name,
                'slug': book.publisher_rel.slug
            } if book.publisher_rel else None,
            'publication_date': book.publication_date.isoformat() if book.publication_date else None,
            'edition': book.edition,
            'language': book.language,
            'page_count': book.page_count,
            'format': book.format,
            'dimensions': book.dimensions,
            'weight_grams': book.weight_grams,
            'list_price': float(book.list_price) if book.list_price else None,
            'sale_price': float(book.sale_price) if book.sale_price else None,
            'cost_price': float(book.cost_price) if book.cost_price else None,
            'sku': book.sku,
            'stock_quantity': book.stock_quantity,
            'low_stock_threshold': book.low_stock_threshold,
            'is_available': book.is_available,
            'allow_backorders': book.allow_backorders,
            'max_backorders': book.max_backorders,
            'average_rating': book.average_rating,
            'rating_count': book.rating_count,
            'review_count': book.review_count,
            'meta_title': book.meta_title,
            'meta_description': book.meta_description,
            'keywords': book.keywords,
            'cover_image_url': book.cover_image_url,
            'cover_image_alt': book.cover_image_alt,
            'sample_pdf_url': book.sample_pdf_url,
            'status': book.status,
            'is_featured': book.is_featured,
            'is_bestseller': book.is_bestseller,
            'is_new_release': book.is_new_release,
            'total_sold': book.total_sold,
            'total_revenue': float(book.total_revenue) if book.total_revenue else None,
            'created_at': book.created_at.isoformat() if book.created_at else None,
            'updated_at': book.updated_at.isoformat() if book.updated_at else None,
            'published_at': book.published_at.isoformat() if book.published_at else None,
            'discount_percentage': book.calculate_discount_percentage(),
            'current_price': float(book.get_current_price()),
            'stock_status': book.get_stock_status(),
            'is_in_stock': book.is_in_stock(),
        }
        
        # Add related data
        base_data['categories'] = [{'id': c.id, 'name': c.name, 'slug': c.slug} for c in book.categories]
        base_data['images'] = [
            {
                'id': img.id,
                'image_url': img.image_url,
                'alt_text': img.alt_text,
                'display_order': img.display_order,
                'is_main': img.is_main
            } for img in book.images
        ]
        
        return base_data


class FeaturedBooksResource(Resource):
    """Get featured books"""
    
    def get(self):
        books = Book.query.filter_by(
            status='published',
            is_featured=True,
            is_available=True
        ).order_by(Book.created_at.desc()).limit(10).all()
        
        return {
            'books': [
                {
                    'id': book.id,
                    'title': book.title,
                    'author': book.author,
                    'slug': book.slug,
                    'short_description': book.short_description,
                    'list_price': float(book.list_price),
                    'sale_price': float(book.sale_price) if book.sale_price else None,
                    'cover_image_url': book.cover_image_url,
                    'average_rating': book.average_rating,
                    'current_price': float(book.get_current_price()),
                    'discount_percentage': book.calculate_discount_percentage()
                } for book in books
            ]
        }, 200


class BestsellerBooksResource(Resource):
    """Get bestsellers"""
    
    def get(self):
        books = Book.query.filter_by(
            status='published',
            is_bestseller=True,
            is_available=True
        ).order_by(Book.total_sold.desc()).limit(10).all()
        
        return {
            'books': [
                {
                    'id': book.id,
                    'title': book.title,
                    'author': book.author,
                    'slug': book.slug,
                    'short_description': book.short_description,
                    'list_price': float(book.list_price),
                    'sale_price': float(book.sale_price) if book.sale_price else None,
                    'cover_image_url': book.cover_image_url,
                    'average_rating': book.average_rating,
                    'total_sold': book.total_sold,
                    'current_price': float(book.get_current_price())
                } for book in books
            ]
        }, 200


class CategoryListResource(Resource):
    """Get all categories"""
    
    def get(self):
        categories = Category.query.filter_by(is_active=True).order_by(Category.display_order).all()
        
        return {
            'categories': [
                {
                    'id': cat.id,
                    'name': cat.name,
                    'slug': cat.slug,
                    'description': cat.description,
                    'display_order': cat.display_order,
                    'image_url': cat.image_url,
                    'book_count': 0
                } for cat in categories
            ]
        }, 200


class SearchBooksResource(Resource):
    """Search books"""
    
    def get(self):
        search_query = request.args.get('q', '').strip()
        limit = request.args.get('limit', 10, type=int)
        
        if not search_query or len(search_query) < 2:
            return {'books': []}, 200
        
        search_term = f"%{search_query}%"
        
        # Search in title, author, description, and ISBN
        books = Book.query.filter(
            Book.status == 'published',
            Book.is_available == True,
            or_(
                Book.title.ilike(search_term),
                Book.author.ilike(search_term),
                Book.short_description.ilike(search_term),
                Book.description.ilike(search_term),
                Book.isbn_10.ilike(search_term),
                Book.isbn_13.ilike(search_term)
            )
        ).limit(limit).all()
        
        return {
            'query': search_query,
            'count': len(books),
            'books': [
                {
                    'id': book.id,
                    'title': book.title,
                    'author': book.author,
                    'slug': book.slug,
                    'short_description': book.short_description,
                    'list_price': float(book.list_price),
                    'sale_price': float(book.sale_price) if book.sale_price else None,
                    'cover_image_url': book.cover_image_url,
                    'average_rating': book.average_rating,
                    'current_price': float(book.get_current_price())
                } for book in books
            ]
        }, 200


class AdminBookListResource(Resource):
    """Create book (admin only)"""
    
    @jwt_required()
    def get(self):
        """Admin: Get all books with all statuses"""
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        # Reuse the BookListResource logic
        resource = BookListResource()
        return resource.get()
    
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        # Check if request has JSON data
        if not request.is_json:
            return {'error': 'Request must be JSON'}, 400
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        # Validate required fields
        required_fields = ['title', 'author', 'isbn_13', 'short_description', 
                          'description', 'publisher_id', 'publication_date', 
                          'language', 'page_count', 'list_price', 'sku']
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return {'error': f'Missing required fields: {", ".join(missing_fields)}'}, 400
        
        # Validate publisher exists
        publisher = Publisher.query.get(data.get('publisher_id'))
        if not publisher:
            return {'error': 'Publisher not found'}, 404
        
        # Generate slug
        book = Book()
        book.title = data.get('title')
        book.author = data.get('author')
        slug = book.generate_slug()
        if not slug:
            return {'error': 'Failed to generate slug'}, 400
        
        # Parse publication date
        try:
            publication_date_str = data.get('publication_date')
            if 'T' in publication_date_str:
                publication_date = datetime.fromisoformat(publication_date_str.replace('Z', '+00:00'))
            else:
                publication_date = datetime.strptime(publication_date_str, '%Y-%m-%d')
        except (ValueError, TypeError):
            return {'error': 'Invalid publication date format. Use ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)'}, 400
        
        # Create book
        book = Book(
            title=data.get('title'),
            author=data.get('author'),
            slug=slug,
            isbn_10=data.get('isbn_10'),
            isbn_13=data.get('isbn_13'),
            short_description=data.get('short_description'),
            description=data.get('description'),
            excerpt=data.get('excerpt'),
            publisher=publisher.name,
            publisher_id=data.get('publisher_id'),
            publication_date=publication_date,
            edition=data.get('edition'),
            language=data.get('language', 'English'),
            page_count=data.get('page_count'),
            format=data.get('format', 'Paperback'),
            dimensions=data.get('dimensions'),
            weight_grams=data.get('weight_grams'),
            list_price=decimal.Decimal(str(data.get('list_price'))),
            sale_price=decimal.Decimal(str(data.get('sale_price'))) if data.get('sale_price') else None,
            cost_price=decimal.Decimal(str(data.get('cost_price'))) if data.get('cost_price') else None,
            sku=data.get('sku'),
            stock_quantity=data.get('stock_quantity', 0),
            low_stock_threshold=data.get('low_stock_threshold', 10),
            is_available=data.get('is_available', True),
            allow_backorders=data.get('allow_backorders', False),
            max_backorders=data.get('max_backorders', 0),
            meta_title=data.get('meta_title'),
            meta_description=data.get('meta_description'),
            keywords=data.get('keywords'),
            cover_image_url=data.get('cover_image_url'),
            cover_image_alt=data.get('cover_image_alt'),
            sample_pdf_url=data.get('sample_pdf_url'),
            status=data.get('status', 'draft'),
            is_featured=data.get('is_featured', False),
            is_bestseller=data.get('is_bestseller', False),
            is_new_release=data.get('is_new_release', True)
        )
        
        # Add categories
        category_ids = data.get('category_ids', [])
        for category_id in category_ids:
            category = Category.query.get(category_id)
            if category:
                book.categories.append(category)
        
        try:
            db.session.add(book)
            db.session.commit()
            
            # Set published_at if status is published
            if book.status == 'published' and not book.published_at:
                book.published_at = datetime.utcnow()
                db.session.commit()
            
            return {
                'message': 'Book created successfully',
                'book': {
                    'id': book.id,
                    'title': book.title,
                    'slug': book.slug,
                    'status': book.status
                }
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to create book: {str(e)}'}, 500


class AdminBookResource(Resource):
    """Update and delete book (admin only)"""
    
    @jwt_required()
    def get(self, id):
        """Admin: Get book details (any status)"""
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        book = Book.query.get_or_404(id)
        resource = BookResource()
        return resource._serialize_book_detail(book), 200
    
    @jwt_required()
    def put(self, id):
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        book = Book.query.get_or_404(id)
        
        # Check if request has JSON data
        if not request.is_json:
            return {'error': 'Request must be JSON'}, 400
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        # Update slug if title or author changed
        if 'title' in data or 'author' in data:
            if 'title' in data:
                book.title = data.get('title')
            if 'author' in data:
                book.author = data.get('author')
            book.slug = book.generate_slug()
        
        # Update fields if provided
        update_fields = [
            'isbn_10', 'isbn_13', 'short_description', 'description', 'excerpt',
            'edition', 'language', 'page_count', 'format', 'dimensions', 'weight_grams',
            'sku', 'stock_quantity', 'low_stock_threshold', 'is_available',
            'allow_backorders', 'max_backorders', 'meta_title', 'meta_description',
            'keywords', 'cover_image_url', 'cover_image_alt', 'sample_pdf_url',
            'status', 'is_featured', 'is_bestseller', 'is_new_release'
        ]
        
        for field in update_fields:
            if field in data:
                setattr(book, field, data.get(field))
        
        # Handle price fields
        if 'list_price' in data:
            book.list_price = decimal.Decimal(str(data.get('list_price')))
        if 'sale_price' in data:
            book.sale_price = decimal.Decimal(str(data.get('sale_price'))) if data.get('sale_price') is not None else None
        if 'cost_price' in data:
            book.cost_price = decimal.Decimal(str(data.get('cost_price'))) if data.get('cost_price') is not None else None
        
        # Handle special fields
        if 'publication_date' in data:
            try:
                publication_date_str = data.get('publication_date')
                if 'T' in publication_date_str:
                    book.publication_date = datetime.fromisoformat(publication_date_str.replace('Z', '+00:00'))
                else:
                    book.publication_date = datetime.strptime(publication_date_str, '%Y-%m-%d')
            except (ValueError, TypeError):
                return {'error': 'Invalid publication date format'}, 400
        
        if 'publisher_id' in data:
            publisher = Publisher.query.get(data.get('publisher_id'))
            if not publisher:
                return {'error': 'Publisher not found'}, 404
            book.publisher = publisher.name
            book.publisher_id = data.get('publisher_id')
        
        if 'category_ids' in data:
            # Clear existing categories and add new ones
            book.categories = []
            for category_id in data.get('category_ids', []):
                category = Category.query.get(category_id)
                if category:
                    book.categories.append(category)
        
        # Set published_at if status changed to published
        if 'status' in data and data.get('status') == 'published' and book.status != 'published':
            book.published_at = datetime.utcnow()
        
        try:
            db.session.commit()
            
            return {
                'message': 'Book updated successfully',
                'book': {
                    'id': book.id,
                    'title': book.title,
                    'status': book.status,
                    'updated_at': book.updated_at.isoformat() if book.updated_at else None
                }
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to update book: {str(e)}'}, 500
    
    @jwt_required()
    def delete(self, id):
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        book = Book.query.get_or_404(id)
        
        # Instead of deleting, archive the book
        try:
            book.status = 'archived'
            book.is_available = False
            db.session.commit()
            
            return {'message': 'Book archived successfully'}, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to archive book: {str(e)}'}, 500


class AdminBookSalesResource(Resource):
    """Manage book sales and inventory (admin only)"""
    
    @jwt_required()
    def post(self, id):
        """Update stock or process sale"""
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        book = Book.query.get_or_404(id)
        
        # Check if request has JSON data
        if not request.is_json:
            return {'error': 'Request must be JSON'}, 400
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        action = data.get('action')
        quantity = data.get('quantity')
        
        if not action:
            return {'error': 'Action is required'}, 400
        if quantity is None:
            return {'error': 'Quantity is required'}, 400
        
        try:
            if action == 'restock':
                book.stock_quantity += quantity
                db.session.commit()
                return {'message': f'Restocked {quantity} units', 'new_stock': book.stock_quantity}, 200
            
            elif action == 'sell':
                price = data.get('price')
                if price is None:
                    return {'error': 'Price is required for sell action'}, 400
                
                if book.stock_quantity < quantity and not book.allow_backorders:
                    return {'error': 'Insufficient stock'}, 400
                
                book.increment_sales(quantity, decimal.Decimal(str(price)))
                db.session.commit()
                
                return {
                    'message': f'Sold {quantity} units',
                    'total_sold': book.total_sold,
                    'total_revenue': float(book.total_revenue),
                    'new_stock': book.stock_quantity
                }, 200
            
            elif action == 'adjust':
                if quantity < 0:
                    return {'error': 'Adjustment quantity cannot be negative'}, 400
                book.stock_quantity = quantity
                db.session.commit()
                return {'message': f'Stock adjusted to {quantity} units'}, 200
            else:
                return {'error': 'Invalid action. Use: restock, sell, or adjust'}, 400
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to process action: {str(e)}'}, 500


class AdminBookImagesResource(Resource):
    """Manage book images (admin only)"""
    
    @jwt_required()
    def get(self, id):
        """Get all images for a book"""
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        book = Book.query.get_or_404(id)
        
        images = [
            {
                'id': img.id,
                'image_url': img.image_url,
                'alt_text': img.alt_text,
                'display_order': img.display_order,
                'is_main': img.is_main
            } for img in book.images
        ]
        
        return {'images': images}, 200
    
    @jwt_required()
    def post(self, id):
        """Add image to book"""
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        book = Book.query.get_or_404(id)
        
        # Check if request has JSON data
        if not request.is_json:
            return {'error': 'Request must be JSON'}, 400
        
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}, 400
        
        image_url = data.get('image_url')
        if not image_url:
            return {'error': 'Image URL is required'}, 400
        
        try:
            # If setting as main, unset any existing main image
            is_main = data.get('is_main', False)
            if is_main:
                for img in book.images:
                    img.is_main = False
            
            image = BookImage(
                book_id=book.id,
                image_url=image_url,
                alt_text=data.get('alt_text'),
                display_order=data.get('display_order', 0),
                is_main=is_main
            )
            
            db.session.add(image)
            db.session.commit()
            
            return {
                'message': 'Image added successfully',
                'image': {
                    'id': image.id,
                    'image_url': image.image_url,
                    'alt_text': image.alt_text,
                    'display_order': image.display_order,
                    'is_main': image.is_main
                }
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to add image: {str(e)}'}, 500
    
    @jwt_required()
    def delete(self, id, image_id):
        """Delete book image"""
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        image = BookImage.query.filter_by(id=image_id, book_id=id).first_or_404()
        
        try:
            db.session.delete(image)
            db.session.commit()
            
            return {'message': 'Image deleted successfully'}, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': f'Failed to delete image: {str(e)}'}, 500


class AdminBookReviewsResource(Resource):
    """Manage book reviews (admin only)"""
    
    @jwt_required()
    def get(self, id):
        """Get all reviews for a book"""
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        
        if not user or user.role != 'admin':
            return {'error': 'Admin access required'}, 403
        
        book = Book.query.get_or_404(id)
        
        # Update rating from reviews
        book.update_rating()
        db.session.commit()
        
        reviews = []
        for review in book.reviews:
            reviews.append({
                'id': review.id,
                'user_id': review.user_id,
                'rating': review.rating,
                'content': review.content,
                'status': review.status,
                'created_at': review.created_at.isoformat() if review.created_at else None
            })
        
        return {
            'book_id': book.id,
            'average_rating': book.average_rating,
            'rating_count': book.rating_count,
            'review_count': book.review_count,
            'reviews': reviews
        }, 200