# seed.py - Example script to populate your database with sample data
from server.app import app, db
from server.models import User, Address, Publisher, Category, Book, BookImage, Review, Order, OrderItem, Payment, Wishlist, WishlistItem
from datetime import datetime, timedelta

# Clear tables
def clear_data():
    db.drop_all()
    db.create_all()

print('here')

def seed_database():
    print("Starting database seeding...")
    
    # ===== 1. Create Users =====
    print("Creating users...")
    users = [
        User(firstName="Ahmed", secondName="Hassan", email="ahmed@example.com", phone="254712345678", role="customer"),
        User(firstName="Fatima", secondName="Ali", email="fatima@example.com", phone="254723456789", role="customer"),
        User(firstName="John", secondName="Doe", email="admin@bookstore.com", phone="254700000000", role="admin"),
    ]
    for user in users:
        user.password_hash = f"{user.firstName}_{user.secondName}"
        db.session.add(user)
    db.session.commit()
    print(f"Created {len(users)} users")
    
    # ===== 2. Create User Addresses =====
    print("Creating addresses...")
    addresses = [
        Address(user_id=1, full_name="Ahmed Hassan", phone="254712345678",
                address_line1="123 Moi Avenue", town="Nairobi", county="Nairobi",
                postal_code="00100", country="Kenya", address_type="shipping", is_default=True),
        Address(user_id=1, full_name="Ahmed Hassan", phone="254712345678",
                address_line1="456 Koinange Street", town="Nairobi", county="Nairobi",
                postal_code="00100", country="Kenya", address_type="billing", is_default=False),
        Address(user_id=2, full_name="Fatima Ali", phone="254723456789",
                address_line1="789 Tom Mboya St", town="Mombasa", county="Mombasa",
                postal_code="80100", country="Kenya", address_type="shipping", is_default=True),
    ]
    for addr in addresses:
        db.session.add(addr)
    db.session.commit()
    print(f"Created {len(addresses)} addresses")
    
    # ===== 3. Create Publishers =====
    print("Creating publishers...")
    publishers = [
        Publisher(name="Penguin Random House", slug="penguin-random-house",
                  description="World's largest trade book publisher"),
        Publisher(name="Macmillan Publishers", slug="macmillan-publishers",
                  description="Global trade publishing company"),
        Publisher(name="East African Educational Publishers", slug="east-african-publishers",
                  description="Leading publisher in East Africa"),
    ]
    for pub in publishers:
        db.session.add(pub)
    db.session.commit()
    print(f"Created {len(publishers)} publishers")
    
    # ===== 4. Create Categories =====
    print("Creating categories...")
    categories = [
        Category(name="Fiction", slug="fiction", description="Novels and short stories",
                display_order=1, is_active=True),
        Category(name="Science Fiction", slug="science-fiction",
                description="Speculative fiction", display_order=2, is_active=True),
        Category(name="Non-Fiction", slug="non-fiction", description="Factual literature",
                display_order=3, is_active=True),
        Category(name="Biography", slug="biography",
                description="Life stories", display_order=4, is_active=True),
        Category(name="Business", slug="business", description="Business and finance books",
                display_order=5, is_active=True),
    ]
    for cat in categories:
        db.session.add(cat)
    db.session.commit()
    print(f"Created {len(categories)} categories")
    
    # ===== 5. Create Books =====
    print("Creating books...")
    books = [
        Book(
            title="The River Between", author="Ngũgĩ wa Thiong'o",
            slug="the-river-between", isbn_13="9780143107491",
            short_description="A classic African novel about colonial Kenya",
            description="Set in the hills of Kenya, this novel explores the conflict between traditional ways and modern influences...",
            publisher="Penguin Random House", publisher_id=1,
            publication_date=datetime(1965, 1, 1), language="English",
            page_count=150, format="Paperback", list_price=12.99,
            sale_price=10.99, sku="BOOK001", stock_quantity=25,
            low_stock_threshold=5, is_available=True,
            cover_image_url="/images/river-between.jpg",
            status="published", is_featured=True
        ),
        Book(
            title="Business Adventures", author="John Brooks",
            slug="business-adventures", isbn_13="9781497644892",
            short_description="Twelve classic tales from the world of Wall Street",
            description="This collection of New Yorker articles provides timeless insights into business...",
            publisher="Macmillan Publishers", publisher_id=2,
            publication_date=datetime(2014, 7, 1), language="English",
            page_count=400, format="Hardcover", list_price=24.99,
            sku="BOOK002", stock_quantity=15, low_stock_threshold=3,
            is_available=True, cover_image_url="/images/business-adventures.jpg",
            status="published", is_bestseller=True
        ),
        Book(
            title="Petals of Blood", author="Ngũgĩ wa Thiong'o",
            slug="petals-of-blood", isbn_13="9780143105428",
            short_description="A powerful novel about post-colonial Kenya",
            description="This novel follows four characters in post-colonial Kenya...",
            publisher="Penguin Random House", publisher_id=1,
            publication_date=datetime(1977, 1, 1), language="English",
            page_count=300, format="Paperback", list_price=14.99,
            sku="BOOK003", stock_quantity=8, low_stock_threshold=2,
            is_available=True, cover_image_url="/images/petals-of-blood.jpg",
            status="published"
        ),
    ]
    for book in books:
        db.session.add(book)
    db.session.commit()
    print(f"Created {len(books)} books")
    
    # ===== 6. Create Book-Category Relationships =====
    print("Creating book-category relationships...")
    # Get the books and categories we just created
    book1 = Book.query.filter_by(slug="the-river-between").first()
    book2 = Book.query.filter_by(slug="business-adventures").first()
    book3 = Book.query.filter_by(slug="petals-of-blood").first()
    
    fiction_cat = Category.query.filter_by(slug="fiction").first()
    scifi_cat = Category.query.filter_by(slug="science-fiction").first()
    business_cat = Category.query.filter_by(slug="business").first()
    
    # Associate books with categories (many-to-many)
    book1.categories.append(fiction_cat)
    book2.categories.append(business_cat)
    book3.categories.append(scifi_cat)
    
    db.session.commit()
    print("Created book-category relationships")
    
    # ===== 7. Create Book Images =====
    print("Creating book images...")
    book_images = [
        BookImage(book_id=book1.id, image_url="/images/river-between-1.jpg",
                 alt_text="The River Between cover", display_order=1, is_main=True),
        BookImage(book_id=book1.id, image_url="/images/river-between-2.jpg",
                 alt_text="Sample pages from The River Between", display_order=2, is_main=False),
        BookImage(book_id=book2.id, image_url="/images/business-adventures-cover.jpg",
                 alt_text="Business Adventures hardcover", display_order=1, is_main=True),
    ]
    for img in book_images:
        db.session.add(img)
    db.session.commit()
    print(f"Created {len(book_images)} book images")
    
    # ===== 8. Create Reviews =====
    print("Creating reviews...")
    reviews = [
        Review(
            book_id=book1.id, user_id=1, rating=5,
            title="A masterpiece of African literature",
            content="This book captures the struggle between tradition and modernity beautifully.",
            pros="Beautiful writing, important themes", cons="Slow pacing in parts",
            status="approved", is_verified_purchase=True,
            helpful_count=12, not_helpful_count=2,
            published_at=datetime.utcnow() - timedelta(days=10)
        ),
        Review(
            book_id=book2.id, user_id=2, rating=4,
            title="Excellent business insights",
            content="The stories are engaging and the lessons are timeless.",
            pros="Real-world examples, well-researched", cons="Some stories feel dated",
            status="approved", is_verified_purchase=False,
            published_at=datetime.utcnow() - timedelta(days=5)
        ),
    ]
    for review in reviews:
        db.session.add(review)
    db.session.commit()
    print(f"Created {len(reviews)} reviews")
    
    # ===== 9. Create Wishlists =====
    print("Creating wishlists...")
    wishlists = [
        Wishlist(user_id=1, name="My Reading List", is_default=True, is_public=False),
        Wishlist(user_id=2, name="Business Books", is_default=True, is_public=True),
    ]
    for wishlist in wishlists:
        db.session.add(wishlist)
    db.session.commit()
    
    # Add items to wishlists
    wishlist_items = [
        WishlistItem(wishlist_id=1, book_id=book3.id, notes="Recommended by a friend"),
        WishlistItem(wishlist_id=2, book_id=book2.id, priority="high"),
    ]
    for item in wishlist_items:
        db.session.add(item)
    db.session.commit()
    print(f"Created {len(wishlists)} wishlists with {len(wishlist_items)} items")
    
    # ===== 10. Create Orders =====
    print("Creating orders...")
    orders = [
        Order(
            order_number="ORD-20251226-0001", user_id=1,
            status="delivered", payment_status="paid",
            subtotal=25.98, tax_amount=2.08, shipping_amount=5.00,
            discount_amount=0, total_amount=33.06, currency="KES",
            payment_method="mpesa",
            shipping_method="standard",
            shipping_address_id=1, billing_address_id=2,
            created_at=datetime.utcnow() - timedelta(days=7),
            completed_at=datetime.utcnow() - timedelta(days=5)
        ),
    ]
    for order in orders:
        db.session.add(order)
    db.session.commit()
    
    # ===== 11. Create Order Items =====
    print("Creating order items...")
    order_items = [
        OrderItem(
            order_id=1, book_id=book1.id,
            book_title="The River Between", book_author="Ngũgĩ wa Thiong'o",
            isbn="9780143107491", unit_price=10.99, quantity=1,
            total_price=10.99
        ),
        OrderItem(
            order_id=1, book_id=book2.id,
            book_title="Business Adventures", book_author="John Brooks",
            isbn="9781497644892", unit_price=24.99, quantity=1,
            total_price=24.99
        ),
    ]
    for item in order_items:
        db.session.add(item)
    db.session.commit()
    print(f"Created {len(orders)} order with {len(order_items)} items")
    
    # ===== 12. Create Payments =====
    print("Creating payments...")
    payments = [
        Payment(
            order_id=1, payment_number="PAY-20251226-0001",
            amount=33.06, currency="KES", method="mpesa_stk_push",
            status="paid", customer_phone="254712345678",
            merchant_request_id="ws_CO_191220231510440123",
            checkout_request_id="ws_CO_191220231510440123",
            mpesa_receipt_number="RCT1234567890",
            result_code=0, result_description="The service request is processed successfully.",
            initiated_at=datetime.utcnow() - timedelta(days=7, hours=1),
            completed_at=datetime.utcnow() - timedelta(days=7, minutes=5)
        ),
    ]
    for payment in payments:
        db.session.add(payment)
    db.session.commit()
    print(f"Created {len(payments)} payment records")
    
    print("✅ Database seeding completed successfully!")

if __name__ == "__main__":
    with app.app_context():
        clear_data()
        seed_database()