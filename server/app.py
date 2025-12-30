from flask import Flask, send_from_directory
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from server.config import db
from server.controllers import addResource
from server.models import (
                        User, Category, Address, Book, BookImage, 
                        Publisher, Order, OrderItem, Payment, Review, 
                        ReviewVote, book_categories,  Wishlist, WishlistItem
                            )
import os

load_dotenv()

app = Flask(__name__, 
            static_folder='../client/dist',  # Path to React build folder
            static_url_path='')

# ... (keep your existing CORS, bcrypt, JWT, etc. setup)
CORS(app=app, 
     resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
     supports_credentials=True)

app.config.from_prefixed_env(prefix='FLASK')
migrate = Migrate(app=app, db=db)
bcrypt=Bcrypt(app=app)
jwt = JWTManager(app=app)
api = Api(app=app)

addResource(api=api)

# 2. Catch-all route for React - MUST BE LAST
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Don't interfere with API routes
    if path.startswith('api/'):
        from flask import abort
        abort(404)
    
    # Check if it's a static file
    file_path = os.path.join(app.static_folder, path)
    if path and os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(app.static_folder, path)
    
    # Otherwise serve React's index.html
    return send_from_directory(app.static_folder, 'index.html')


db.init_app(app=app)

if __name__ == '__main__':
    app.run(debug=True)