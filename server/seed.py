# seed.py - Improved script to populate your database with sample data
from server.app import app, db
from server.models import User, Address, Publisher, Category, Book, BookImage, Review, Order, OrderItem, Payment, Wishlist, WishlistItem
from datetime import datetime, timedelta
import random
from decimal import Decimal
from faker import Faker

# Initialize Faker
fake = Faker()

# Your categories data (from the first script)
categories_data = [
    {
        'id': 1,
        'name': 'Fiction',
        'description': 'Novels, short stories, and literary fiction',
        'image': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
    },
    {
        'id': 2,
        'name': 'Science Fiction',
        'description': 'Futuristic technology, space exploration, aliens',
        'image': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop',
    },
    {
        'id': 3,
        'name': 'Mystery & Thriller',
        'description': 'Suspense, crime, detective stories',
        'image': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    },
    {
        'id': 4,
        'name': 'Biography',
        'description': 'Real-life stories and memoirs',
        'image': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
    },
    {
        'id': 5,
        'name': 'Self-Help',
        'description': 'Personal development and psychology',
        'image': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&h=400&fit=crop',
    },
    {
        'id': 6,
        'name': 'Romance',
        'description': 'Love stories and relationship dramas',
        'image': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&h=400&fit=crop',
    },
    {
        'id': 7,
        'name': 'Fantasy',
        'description': 'Magic, mythical creatures, epic quests',
        'image': 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=600&h=400&fit=crop',
    },
    {
        'id': 8,
        'name': 'Technology',
        'description': 'Programming, AI, and tech innovation',
        'image': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
    },
    {
        'id': 9,
        'name': 'History',
        'description': 'Historical events and analysis',
        'image': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&h=400&fit=crop',
    },
    {
        'id': 10,
        'name': 'Poetry',
        'description': 'Verse, sonnets, and poetic works',
        'image': 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?w=600&h=400&fit=crop',
    },
    {
        'id': 11,
        'name': "Children's Books",
        'description': 'Books for young readers',
        'image': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
    },
    {
        'id': 12,
        'name': 'Business',
        'description': 'Economics, entrepreneurship, management',
        'image': 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
    }
]

# Clear tables
def clear_data():
    print("Dropping all tables...")
    db.drop_all()
    print("Creating all tables...")
    db.create_all()
    print("Database cleared and recreated")

def create_users():
    """Create sample users"""
    print("Creating users...")
    users = [
        User(
            firstName="Ahmed", 
            secondName="Hassan", 
            email="ahmed@example.com", 
            phone="254712345678", 
            role="customer",
            created_at=datetime.utcnow()
        ),
        User(
            firstName="Fatima", 
            secondName="Ali", 
            email="fatima@example.com", 
            phone="254723456789", 
            role="customer",
            created_at=datetime.utcnow()
        ),
        User(
            firstName="John", 
            secondName="Doe", 
            email="admin@bookstore.com", 
            phone="254700000000", 
            role="admin",
            created_at=datetime.utcnow()
        ),
        # Add more users
        User(
            firstName="Maria", 
            secondName="Wangari", 
            email="maria@example.com", 
            phone="254734567890", 
            role="customer",
            created_at=datetime.utcnow()
        ),
        User(
            firstName="David", 
            secondName="Ochieng", 
            email="david@example.com", 
            phone="254745678901", 
            role="customer",
            created_at=datetime.utcnow()
        ),
    ]
    for user in users:
        user.password_hash = f"{user.firstName}_{user.secondName}"
        db.session.add(user)
    db.session.commit()
    print(f"Created {len(users)} users")
    return users

def create_addresses(users):
    """Create addresses for users"""
    print("Creating addresses...")
    addresses = [
        Address(
            user_id=1, 
            full_name="Ahmed Hassan", 
            phone="254712345678",
            address_line1="123 Moi Avenue", 
            town="Nairobi", 
            county="Nairobi",
            postal_code="00100", 
            country="Kenya", 
            address_type="shipping", 
            is_default=True,
            created_at=datetime.utcnow()
        ),
        Address(
            user_id=1, 
            full_name="Ahmed Hassan", 
            phone="254712345678",
            address_line1="456 Koinange Street", 
            town="Nairobi", 
            county="Nairobi",
            postal_code="00100", 
            country="Kenya", 
            address_type="billing", 
            is_default=False,
            created_at=datetime.utcnow()
        ),
        Address(
            user_id=2, 
            full_name="Fatima Ali", 
            phone="254723456789",
            address_line1="789 Tom Mboya St", 
            town="Mombasa", 
            county="Mombasa",
            postal_code="80100", 
            country="Kenya", 
            address_type="shipping", 
            is_default=True,
            created_at=datetime.utcnow()
        ),
        Address(
            user_id=3, 
            full_name="John Doe", 
            phone="254700000000",
            address_line1="10 University Way", 
            town="Nairobi", 
            county="Nairobi",
            postal_code="00100", 
            country="Kenya", 
            address_type="both", 
            is_default=True,
            created_at=datetime.utcnow()
        ),
    ]
    for addr in addresses:
        db.session.add(addr)
    db.session.commit()
    print(f"Created {len(addresses)} addresses")

def create_publishers():
    """Create publishers"""
    print("Creating publishers...")
    publishers = [
        Publisher(
            name="Penguin Random House", 
            slug="penguin-random-house",
            description="World's largest trade book publisher",
            
        ),
        Publisher(
            name="Macmillan Publishers", 
            slug="macmillan-publishers",
            description="Global trade publishing company",
           
        ),
        Publisher(
            name="East African Educational Publishers", 
            slug="east-african-publishers",
            description="Leading publisher in East Africa",
        ),
        Publisher(
            name="HarperCollins",
            slug="harpercollins",
            description="One of the world's leading publishing companies",
            
        ),
        Publisher(
            name="Simon & Schuster",
            slug="simon-schuster",
            description="Major publisher of commercial fiction and non-fiction",
            
        ),
    ]
    for pub in publishers:
        db.session.add(pub)
    db.session.commit()
    print(f"Created {len(publishers)} publishers")
    return publishers

def create_categories():
    """Create all categories from categories_data"""
    print("Creating categories...")
    categories = []
    for cat_data in categories_data:
        # Check if category exists by name
        existing = Category.query.filter_by(name=cat_data['name']).first()
        if not existing:
            category = Category(
                name=cat_data['name'],
                slug=cat_data['name'].lower().replace(' ', '-').replace('&', 'and'),
                description=cat_data['description'],
                image_url=cat_data['image'],
                display_order=cat_data['id'],
                is_active=True,
                created_at=datetime.utcnow()
            )
            categories.append(category)
            db.session.add(category)
            print(f"Added category: {cat_data['name']}")
        else:
            categories.append(existing)
            print(f"Category already exists: {cat_data['name']}")
    
    db.session.commit()
    print(f"Created/verified {len(categories)} categories")
    return categories

def generate_book_data(num_books=100):
    """
    Generate fake book data
    Returns: tuple of (books_data, book_categories_map)
    """
    print(f"Generating {num_books} fake books...")
    
    books_data = []
    book_categories_map = {}
    
    # Get existing publishers and categories
    publishers = Publisher.query.all()
    categories = Category.query.all()
    
    if not publishers:
        print("Warning: No publishers found. Creating sample publishers...")
        publishers = create_publishers()
    
    if not categories:
        print("Warning: No categories found. Creating categories...")
        categories = create_categories()
    
    publisher_ids = [p.id for p in publishers]
    category_ids = [c.id for c in categories]
    
    for i in range(num_books):
        title = fake.sentence(nb_words=random.randint(2, 5)).rstrip('.')
        author = fake.name()
        slug_base = f"{title.lower().replace(' ', '-').replace(',', '').replace('.', '').replace('?', '')}-{fake.isbn13(separator='')}"
        slug = slug_base[:100]  # Truncate to reasonable length
        
        # Generate ISBNs
        isbn13 = fake.isbn13(separator='')
        isbn10 = fake.isbn10(separator='')
        
        # Publication date (within last 20 years)
        publication_date = fake.date_time_between(start_date='-20y', end_date='now')
        
        # Pricing logic - using float instead of Decimal
        list_price = round(random.uniform(9.99, 49.99), 2)
        sale_price = None
        if random.random() > 0.2:  # 80% of books have a sale
            discount = random.choice([0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5])
            sale_price = round(list_price * (1 - discount), 2)
        
        # Assign 1-3 random categories
        num_categories = random.randint(1, 3)
        assigned_category_ids = random.sample(category_ids, min(num_categories, len(category_ids)))
        book_categories_map[isbn13] = assigned_category_ids
        
        # Generate book data
        book_dict = {
            'title': title,
            'author': author,
            'slug': slug,
            'isbn_10': isbn10,
            'isbn_13': isbn13,
            'short_description': fake.text(max_nb_chars=200),
            'description': fake.text(max_nb_chars=1000),
            'excerpt': fake.text(max_nb_chars=500),
            'publisher': random.choice(publishers).name,
            'publisher_id': random.choice(publisher_ids),
            'publication_date': publication_date,
            'edition': random.choice([None, '1st', '2nd', 'Revised Edition', 'Special Edition', 'Updated Edition']),
            'language': random.choice(['English', 'Swahili', 'French', 'Spanish']),
            'page_count': random.randint(150, 800),
            'format': random.choice(['Paperback', 'Hardcover', 'eBook', 'Audiobook']),
            'dimensions': f"{random.randint(5, 9)}.{random.randint(0, 9)} x {random.randint(4, 7)}.{random.randint(0, 9)} x {random.randint(0, 2)}.{random.randint(0, 9)} inches",
            'weight_grams': random.randint(200, 1200),
            'list_price': list_price,
            'sale_price': sale_price,
            'cost_price': round(list_price * 0.4, 2),
            'sku': f"BOOK-{isbn13}",
            'stock_quantity': random.randint(0, 200),
            'low_stock_threshold': 10,
            'is_available': random.random() > 0.05,
            'allow_backorders': random.random() > 0.7,
            'max_backorders': random.randint(0, 20) if random.random() > 0.7 else 0,
            'average_rating': round(random.uniform(3.0, 5.0), 1),
            'rating_count': random.randint(0, 1250),
            'review_count': random.randint(0, 300),
            'meta_title': title[:60],
            'meta_description': fake.text(max_nb_chars=155),
            'keywords': ', '.join(fake.words(nb=random.randint(3, 6))),
            'cover_image_url': f"https://images.unsplash.com/photo-{fake.numerify(text='########')}?auto=format&fit=crop&w=600&q=80",
            'cover_image_alt': f"Book cover for {title} by {author}",
            'status': 'published',
            'is_featured': random.random() > 0.85,
            'is_bestseller': random.random() > 0.9,
            'is_new_release': publication_date > datetime.utcnow() - timedelta(days=180),
            'total_sold': random.randint(0, 5000),
            'total_revenue': round(random.uniform(0, 25000.00), 2),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        books_data.append(book_dict)
    
    print(f"Generated {len(books_data)} books")
    return books_data, book_categories_map
def create_books_with_categories(books_data, book_categories_map):
    """Create books and link them to categories"""
    print("Creating books and linking to categories...")
    
    books = []
    for book_data in books_data:
        book = Book(**book_data)
        db.session.add(book)
        books.append(book)
    
    # Commit to get IDs
    db.session.commit()
    print(f"Created {len(books)} books")
    
    # Link books to categories
    print("Linking books to categories...")
    linked_count = 0
    
    for book in books:
        isbn13 = book.isbn_13
        if isbn13 in book_categories_map:
            category_ids = book_categories_map[isbn13]
            categories = Category.query.filter(Category.id.in_(category_ids)).all()
            book.categories.extend(categories)
            linked_count += 1
    
    db.session.commit()
    print(f"Linked {linked_count} books to categories")

def create_book_images(books):
    """Create multiple images for each book"""
    print("Creating book images...")
    book_images = []
    
    for book in books[:20]:  # Create images for first 20 books
        # Main cover image
        book_images.append(BookImage(
            book_id=book.id,
            image_url=book.cover_image_url,
            alt_text=book.cover_image_alt or f"Cover of {book.title}",
            display_order=1,
            is_main=True,
            created_at=datetime.utcnow()
        ))
        
        # Additional images (1-3 per book)
        for i in range(random.randint(1, 3)):
            book_images.append(BookImage(
                book_id=book.id,
                image_url=f"https://images.unsplash.com/photo-{fake.numerify(text='########')}?auto=format&fit=crop&w=600&q=80",
                alt_text=f"Sample pages from {book.title}" if i == 0 else f"Back cover of {book.title}",
                display_order=i + 2,
                is_main=False,
                created_at=datetime.utcnow()
            ))
    
    for img in book_images:
        db.session.add(img)
    
    db.session.commit()
    print(f"Created {len(book_images)} book images")

def create_reviews(users, books):
    """Create reviews for books"""
    print("Creating reviews...")
    reviews = []
    
    # Create 2-5 reviews for each of the first 30 books
    for book in books[:30]:
        num_reviews = random.randint(2, 5)
        for _ in range(num_reviews):
            user = random.choice(users)
            rating = random.choices([1, 2, 3, 4, 5], weights=[1, 2, 3, 4, 5])[0]
            
            review = Review(
                book_id=book.id,
                user_id=user.id,
                rating=rating,
                title=fake.sentence(nb_words=random.randint(3, 7)),
                content=fake.text(max_nb_chars=random.randint(100, 500)),
                pros=', '.join(fake.words(nb=random.randint(2, 4))),
                cons=', '.join(fake.words(nb=random.randint(0, 3))) if random.random() > 0.3 else None,
                status='approved',
                is_verified_purchase=random.random() > 0.3,
                helpful_count=random.randint(0, 50),
                not_helpful_count=random.randint(0, 10),
                published_at=datetime.utcnow() - timedelta(days=random.randint(1, 365)),
                created_at=datetime.utcnow()
            )
            reviews.append(review)
            db.session.add(review)
    
    db.session.commit()
    print(f"Created {len(reviews)} reviews")
    return reviews

def create_wishlists(users, books):
    """Create wishlists and wishlist items"""
    print("Creating wishlists...")
    wishlists = []
    
    for user in users:
        # Create default wishlist
        wishlist = Wishlist(
            user_id=user.id,
            name="My Reading List" if user.role == 'customer' else "Admin Favorites",
            is_default=True,
            is_public=random.random() > 0.5,
            created_at=datetime.utcnow()
        )
        db.session.add(wishlist)
        wishlists.append(wishlist)
        
        # Create additional wishlists for some users
        if random.random() > 0.5:
            additional = Wishlist(
                user_id=user.id,
                name=random.choice(["To Read", "Favorites", "Gift Ideas", "Research"]),
                is_default=False,
                is_public=random.random() > 0.7,
                created_at=datetime.utcnow()
            )
            db.session.add(additional)
            wishlists.append(additional)
    
    db.session.commit()
    print(f"Created {len(wishlists)} wishlists")
    
    # Add items to wishlists
    print("Adding items to wishlists...")
    wishlist_items = []
    
    for wishlist in wishlists:
        num_items = random.randint(1, 8)
        selected_books = random.sample(books, min(num_items, len(books)))
        
        for book in selected_books:
            item = WishlistItem(
                wishlist_id=wishlist.id,
                book_id=book.id,
                notes=random.choice([None, "Recommended by friend", "For research", "Gift idea"]),
                priority=random.choice(["low", "medium", "high"]),
                created_at=datetime.utcnow()
            )
            wishlist_items.append(item)
            db.session.add(item)
    
    db.session.commit()
    print(f"Added {len(wishlist_items)} items to wishlists")

def seed_database():
    print("=" * 60)
    print("Starting database seeding...")
    print("=" * 60)
    
    try:
        # ===== 1. Create Users =====
        users = create_users()
        
        # ===== 2. Create User Addresses =====
        create_addresses(users)
        
        # ===== 3. Create Publishers =====
        publishers = create_publishers()
        
        # ===== 4. Create Categories =====
        categories = create_categories()
        
        # ===== 5. Create Books with Fake Data =====
        print("\n" + "=" * 60)
        print("Generating extensive book data...")
        print("=" * 60)
        
        # Generate 100 books with fake data
        books_data, book_categories_map = generate_book_data(num_books=100)
        
        # Create books and link to categories
        create_books_with_categories(books_data, book_categories_map)
        
        # Get all books from database
        books = Book.query.all()
        
        # ===== 6. Create Book Images =====
        create_book_images(books)
        
        # ===== 7. Create Reviews =====
        create_reviews(users, books)
        
        # ===== 8. Create Wishlists =====
        create_wishlists(users, books)
        
        
        print("\n" + "=" * 60)
        print("✅ Database seeding completed successfully!")
        print("=" * 60)
        print("\nSummary:")
        print(f"  Users: {User.query.count()}")
        print(f"  Addresses: {Address.query.count()}")
        print(f"  Publishers: {Publisher.query.count()}")
        print(f"  Categories: {Category.query.count()}")
        print(f"  Books: {Book.query.count()}")
        print(f"  Book Images: {BookImage.query.count()}")
        print(f"  Reviews: {Review.query.count()}")
        print(f"  Wishlists: {Wishlist.query.count()}")
        print(f"  Orders: {Order.query.count()}")
        print(f"  Payments: {Payment.query.count()}")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {str(e)}")
        db.session.rollback()
        raise

if __name__ == "__main__":
    with app.app_context():
        # Ask for confirmation before clearing database
        print("⚠️  WARNING: This will clear ALL existing data!")
        response = input("Continue? (yes/no): ")
        
        if response.lower() in ['yes', 'y']:
            clear_data()
            seed_database()
        else:
            print("Seeding cancelled.")