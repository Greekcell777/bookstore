import random
from datetime import datetime, timedelta
from decimal import Decimal

from faker import Faker
from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import Session

# Import your models. Adjust the import path as needed.
from server.models import Book, Publisher, Category, BookImage, book_categories

# Your categories data
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

def insert_categories(session):
    """
    Insert categories into the database if they don't exist.
    """
    print("Checking/inserting categories...")
    
    for category_data in categories_data:
        # Check if category already exists
        existing = session.scalar(
            select(Category).where(Category.name == category_data['name'])
        )
        
        if not existing:
            category = Category(
                name=category_data['name'],
                slug=category_data['name'].lower().replace(' ', '_'),
                description=category_data['description'],
                image_url=category_data['image']
            )
            session.add(category)
            print(f"Added category: {category_data['name']}")
        else:
            print(f"Category already exists: {category_data['name']}")
    
    session.commit()
    print("Categories processed successfully.")

def generate_book_data(session, num_books=50):
    """
    Generates a list of dictionaries with fake book data compatible with your Book model.
    Also creates a mapping of book ISBN to assigned categories.
    """
    fake = Faker()
    Faker.seed(0)  # Optional: Seed for reproducible results
    books_data = []
    book_categories_map = {}  # Store categories for each book

    # Fetch existing publishers and categories
    publisher_ids = [p.id for p in session.scalars(select(Publisher)).all()]
    all_categories = session.scalars(select(Category)).all()
    category_ids = [c.id for c in all_categories]

    if not publisher_ids:
        print("Error: No publishers found in the database. Please create publishers first.")
        return [], {}
    
    if not category_ids:
        print("Warning: No categories found. Books will not be linked to categories.")
        print("Running insert_categories first...")
        insert_categories(session)
        all_categories = session.scalars(select(Category)).all()
        category_ids = [c.id for c in all_categories]

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

        # Assign 1-3 random categories to each book
        num_categories = random.randint(1, 3)
        assigned_category_ids = random.sample(category_ids, min(num_categories, len(category_ids)))
        book_categories_map[isbn13] = assigned_category_ids

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
            # Digital Assets
            'cover_image_url': f"https://images.unsplash.com/photo-{fake.numerify(text='########')}?auto=format&fit=crop&w=600&q=80",
            'cover_image_alt': f"Book cover for {title} by {author}",
            'sample_pdf_url': None,
            # Status and Flags
            'status': 'published',
            'is_featured': random.random() > 0.85,
            'is_bestseller': random.random() > 0.9,
            'is_new_release': publication_date > datetime.now() - timedelta(days=180),
            # Sales Data
            'total_sold': random.randint(0, 5000),
            'total_revenue': Decimal(str(round(random.uniform(0, 25000.00), 2))) if random.random() > 0.3 else Decimal('0.00'),
        }
        
        # Calculate derived revenue if not set and there are sales
        if book_dict['total_revenue'] == 0 and book_dict['total_sold'] > 0:
            book_dict['total_revenue'] = book_dict['list_price'] * Decimal(str(book_dict['total_sold']))

        books_data.append(book_dict)

    return books_data, book_categories_map

def bulk_insert_books(engine, books_data, book_categories_map):
    """
    Efficiently inserts books and links them to categories.
    """
    with Session(engine) as session:
        with session.begin():
            # 1. Insert books
            print(f"Inserting {len(books_data)} books...")
            session.execute(
                Book.__table__.insert(),
                books_data
            )
            
            # 2. Link books to categories
            print("Linking books to categories...")
            
            # Get all inserted books by ISBN
            for book_data in books_data:
                isbn13 = book_data['isbn_13']
                
                # Find the book ID
                book = session.scalar(
                    select(Book).where(Book.isbn_13 == isbn13)
                )
                
                if book and isbn13 in book_categories_map:
                    # Get category objects for the assigned category IDs
                    categories = session.scalars(
                        select(Category).where(Category.id.in_(book_categories_map[isbn13]))
                    ).all()
                    
                    # Link book to categories
                    book.categories = categories
            
            session.commit()
            
        print(f"Successfully inserted {len(books_data)} books and linked them to categories.")

def create_sample_publishers(session):
    """
    Create sample publishers if none exist.
    """
    publishers = session.scalars(select(Publisher)).all()
    
    if not publishers:
        print("Creating sample publishers...")
        sample_publishers = [
            Publisher(name="Penguin Random House", website="https://www.penguinrandomhouse.com"),
            Publisher(name="HarperCollins", website="https://www.harpercollins.com"),
            Publisher(name="Simon & Schuster", website="https://www.simonandschuster.com"),
            Publisher(name="Hachette Book Group", website="https://www.hachettebookgroup.com"),
            Publisher(name="Macmillan Publishers", website="https://us.macmillan.com"),
        ]
        
        for publisher in sample_publishers:
            session.add(publisher)
        
        session.commit()
        print("Created 5 sample publishers.")

# --- Main execution block ---
if __name__ == "__main__":
    # 1. Set up your database connection
    DATABASE_URL = "postgresql://dbadmin:admin2024@localhost:5432/bookstore"
    engine = create_engine(DATABASE_URL)

    # 2. Create a session
    with Session(engine) as session:
        # 3. Create sample publishers if needed
        create_sample_publishers(session)
        
        # 4. Insert categories
        insert_categories(session)
        
        # 5. Generate the fake book data with categories
        print("Generating fake book data...")
        books_data, book_categories_map = generate_book_data(session, num_books=50)

        if books_data:
            # 6. Insert books and link to categories
            bulk_insert_books(engine, books_data, book_categories_map)
            print("Data generation and insertion complete.")