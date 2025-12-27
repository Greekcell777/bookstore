import random
from datetime import datetime, timedelta
from decimal import Decimal

from faker import Faker
from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import Session

# Import your models. Adjust the import path as needed.
from server.models import Book, Publisher, Category, BookImage

def generate_book_data(session, num_books=50):
    """
    Generates a list of dictionaries with fake book data compatible with your Book model.
    """
    fake = Faker()
    Faker.seed(0)  # Optional: Seed for reproducible results
    books_data = []

    # Fetch existing publishers and categories to assign real IDs
    publisher_ids = [p.id for p in session.scalars(select(Publisher)).all()]
    category_ids = [c.id for c in session.scalars(select(Category)).all()]

    if not publisher_ids:
        print("Error: No publishers found in the database. Please create publishers first.")
        return []
    if not category_ids:
        print("Warning: No categories found. Books will not be linked to categories.")

    for i in range(num_books):
        title = fake.sentence(nb_words=4).rstrip('.')
        author = fake.name()
        base_slug = f"{title.lower().replace(' ', '-').replace(',', '').replace('.', '')}-{fake.isbn13(separator='')}"
        isbn13 = fake.isbn13(separator='')
        isbn10 = fake.isbn10(separator='')

        # Generate a past publication date within the last 20 years
        publication_date = fake.date_time_between(start_date='-20y', end_date='now')

        # Pricing logic: 80% of books have a sale price
        list_price = Decimal(str(round(random.uniform(9.99, 34.99), 2)))
        sale_price = list_price * Decimal(str(round(random.uniform(0.65, 0.95), 2))) if random.random() > 0.2 else None

        book_dict = {
            # Basic Information
            'title': title,
            'author': author,
            'slug': base_slug[:255],  # Ensure it doesn't exceed column length
            # ISBN
            'isbn_10': isbn10,
            'isbn_13': isbn13,
            # Description
            'short_description': fake.text(max_nb_chars=490),
            'description': fake.text(max_nb_chars=2000),
            'excerpt': fake.text(max_nb_chars=1000),
            # Publisher - Randomly assign an existing publisher
            'publisher': fake.company(),  # This is the publisher name string field
            'publisher_id': random.choice(publisher_ids),
            'publication_date': publication_date,
            'edition': random.choice([None, '1st', '2nd', 'Revised Edition', 'Special Edition']),
            # Book Details
            'language': random.choice(['English', 'Spanish', 'French', 'German']),
            'page_count': random.randint(150, 800),
            'format': random.choice(['Paperback', 'Hardcover', 'eBook']),
            'dimensions': f"{random.randint(5, 9)}.{random.randint(0, 9)} x {random.randint(4, 7)}.{random.randint(0, 9)} x {random.randint(0, 2)}.{random.randint(0, 9)} inches",
            'weight_grams': random.randint(200, 1200),
            # Pricing
            'list_price': list_price,
            'sale_price': sale_price,
            'cost_price': list_price * Decimal('0.4'),  # Assume cost is 40% of list price
            # Inventory
            'sku': f"BOOK-{isbn13}",
            'stock_quantity': random.randint(0, 150),
            'low_stock_threshold': 10,
            'is_available': random.random() > 0.05,  # 95% available
            'allow_backorders': random.random() > 0.7,
            'max_backorders': random.randint(0, 20) if random.random() > 0.7 else 0,
            # Ratings
            'average_rating': round(random.uniform(3.0, 5.0), 1),
            'rating_count': random.randint(0, 1250),
            'review_count': random.randint(0, 300),
            # SEO
            'meta_title': title[:250],
            'meta_description': fake.text(max_nb_chars=155),
            'keywords': ', '.join(fake.words(nb=random.randint(4, 8))),
            # Digital Assets - Using Unsplash for realistic placeholder book covers
            'cover_image_url': f"https://images.unsplash.com/photo-{fake.numerify(text='########')}?auto=format&fit=crop&w=600&q=80",
            'cover_image_alt': f"Book cover for {title} by {author}",
            'sample_pdf_url': None,  # Can be filled later with real PDF URLs
            # Status and Flags
            'status': 'published',
            'is_featured': random.random() > 0.85,
            'is_bestseller': random.random() > 0.9,
            'is_new_release': publication_date > datetime.now() - timedelta(days=180),
            # Sales Data
            'total_sold': random.randint(0, 5000),
            'total_revenue': Decimal(str(round(random.uniform(0, 25000.00), 2))) if random.random() > 0.3 else Decimal('0.00'),
            # Timestamps are handled by the database server defaults
        }
        # Calculate derived revenue if not set and there are sales
        if book_dict['total_revenue'] == 0 and book_dict['total_sold'] > 0:
            book_dict['total_revenue'] = book_dict['list_price'] * Decimal(str(book_dict['total_sold']))

        books_data.append(book_dict)

    return books_data

def bulk_insert_books(engine, books_data):
    """
    Efficiently inserts a large list of book dictionaries into the database.
    Uses SQLAlchemy Core for optimal performance[citation:3].
    """
    with Session(engine) as session:
        with session.begin():
            # Use the Core API for bulk insert[citation:3][citation:8]
            # This is faster than creating ORM instances one by one
            session.execute(
                Book.__table__.insert(),
                books_data
            )
        print(f"Successfully inserted {len(books_data)} books into the database.")

# --- Main execution block ---
if __name__ == "__main__":
    # 1. Set up your database connection
    # Replace with your actual database URL (e.g., 'postgresql://user:pass@localhost/dbname')
    DATABASE_URL = "postgresql://dbadmin:admin2024@localhost:5432/bookstore"
    engine = create_engine(DATABASE_URL)

    # 2. Create a session to fetch existing data (publishers, categories)
    with Session(engine) as session:
        # 3. Generate the fake book data
        print("Generating fake book data...")
        new_books_data = generate_book_data(session, num_books=50)

        if new_books_data:
            # 4. Insert the data into the database
            print(f"Inserting {len(new_books_data)} books...")
            bulk_insert_books(engine, new_books_data)
            print("Data generation and insertion complete.")