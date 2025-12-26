from flask import Flask
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from server.config import db
from server.controllers import addResource
from server.models import (User, Category, Address, Book, BookImage, 
                           Publisher, Order, OrderItem, Payment, Review, 
                           ReviewVote, book_categories,  Wishlist, WishlistItem
                           )

load_dotenv()

app = Flask(__name__)
CORS(app=app, supports_credentials=True)

app.config.from_prefixed_env(prefix='FLASK')
migrate = Migrate(app=app, db=db)
bcrypt=Bcrypt(app=app)
jwt = JWTManager(app=app)
api = Api(app=app)
addResource(api=api)

db.init_app(app=app)