import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, BookOpen } from 'lucide-react';
import { cartAPI } from '../services/api';

const BookCard = ({ book, viewMode = 'grid' }) => {
  console.log(book)
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart logic here
    if (!book) return;
        
        setIsAddingToCart(true);
        try {
          await cartAPI.addToCart(book.id, quantity);

          
          // Show success message (you could use a toast notification here)
          console.log('Added to cart successfully');
          
          // Optional: Trigger cart refresh in parent component
          // if (typeof onCartUpdate === 'function') {
          //   onCartUpdate();
          // }
          
        } catch (err) {
          console.error('Error adding to cart:', err);
          // Show error message to user
          alert(err.message || 'Failed to add to cart');
        } finally {
          setIsAddingToCart(false);
        }
    console.log('Add to cart:', book.id);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to wishlist logic here
    console.log('Add to wishlist:', book.id);
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/book/${book.id}`}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="flex">
            {/* Book Image */}
            <div className="w-32 h-48 shrink-0">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Book Details */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(book.average_rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      ({book.review_count} reviews)
                    </span>
                    <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {book.categories[0].name}
                    </span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${book.current_price.toFixed(2)}
                  </div>
                  {(book.stock_status !== "In Stock" ) && (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {book.short_description}
              </p>
              
              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={(book.stock_status !== "In Stock")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      (book.stock_status === "In Stock")
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={16} className="inline mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Heart size={18} />
                  </button>
                </div>
                <Link
                  to={`/book/${book.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View (default)
  return (
    <Link to={`/book/${book.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
        {/* Book Image */}
        <div className="relative overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            {(book.stock_status !== "In Stock") && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Out of Stock
              </span>
            )}
            {book.current_price < 15 && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Sale
              </span>
            )}
          </div>
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-x-2">
              <button
                onClick={handleAddToCart}
                disabled={(book.stock_status !== "In Stock")}
                className={`p-3 rounded-full shadow-lg transition-all ${
                  (book.stock_status === "In Stock")
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-110'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={20} />
              </button>
              <button
                onClick={handleAddToWishlist}
                className="p-3 rounded-full bg-white text-gray-700 shadow-lg hover:text-red-500 hover:scale-110 transition-all"
              >
                <Heart size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Book Details */}
        <div className="p-4">
          {/* Category */}
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
            {book.categories[0]?.name}
          </span>
          
          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {book.title}
          </h3>
          
          {/* Author */}
          <p className="text-gray-600 text-sm mb-2">{book.author}</p>
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(book.average_rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-300 text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {book.review_count}
            </span>
            <span className="ml-2 text-sm text-gray-400">
              {new Date(book.publication_date).toDateString()}
            </span>
          </div>
          
          {/* Price & Action */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ${book.current_price}
              </span>
              {book.originalPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  ${book.list_price}
                </span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={(book.stock_status !== 'In Stock')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                (book.stock_status === 'In Stock')
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={16} className="inline mr-2" />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
