import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Loader2 } from 'lucide-react';
import { useBookStore } from '../components/BookstoreContext'; // Updated import

const BookCard = ({ book, viewMode = 'grid' }) => {
  
  const { 
    addToCart, 
    addToWishlist, 
    cart, 
    wishlist, 
    user 
  } = useBookStore();
  
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const navigate = useNavigate();
  
  // Check if book is in cart (cart is now a simple array)
  const isInCart = cart.some(item => 
    item.bookId === book.id || item.book?.id === book.id
  );
  
  // Check if book is in wishlist (wishlist is now a simple array)
  const isInWishlist = wishlist.some(item => 
    item.bookId === book.id || item.book?.id === book.id
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!book || !book.id) {
      console.error('Book data is missing');
      return;
    }
    
    // Check if user is logged in
    if (!user) {
      // Save the intended action for after login
      const pendingAction = {
        type: 'addToCart',
        bookId: book.id,
        quantity: 1,
        bookTitle: book.title,
        timestamp: Date.now()
      };
      
      // Save to localStorage so we can restore after login
      const existingPendingActions = JSON.parse(localStorage.getItem('pendingActions') || '[]');
      existingPendingActions.push(pendingAction);
      localStorage.setItem('pendingActions', JSON.stringify(existingPendingActions));
      
      // Save the current URL for redirect back
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      
      // Show alert and redirect to login
      alert(`Please login to add "${book.title}" to your cart. You'll be redirected to the login page and can continue where you left off.`);
      
      // Navigate to login page
      navigate('/login', { 
        state: { 
          message: `Please login to add "${book.title}" to your cart`,
          redirectTo: window.location.pathname
        }
      });
      return;
    }
    
    if (isAddingToCart) return; // Prevent multiple clicks
    
    setIsAddingToCart(true);
    try {
      // Use context function instead of direct API call
      await addToCart(book.id, 1);
      
      // Success - the context will update the global state
      console.log('Added to cart successfully');
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      
      // If error is due to authentication, redirect to login
      if (err.response?.status === 401 || err.message?.includes('401')) {
        // Save pending action
        const pendingAction = {
          type: 'addToCart',
          bookId: book.id,
          quantity: 1,
          bookTitle: book.title,
          timestamp: Date.now()
        };
        
        localStorage.setItem('pendingActions', JSON.stringify([pendingAction]));
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        
        alert('Your session has expired. Please login again to continue.');
        navigate('/login', { 
          state: { 
            message: 'Session expired. Please login to continue.',
            redirectTo: window.location.pathname
          }
        });
      } else {
        // Show error message to user for other errors
        alert(err.message || 'Failed to add to cart. Please try again.');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!book || !book.id) {
      console.error('Book data is missing');
      return;
    }
    
    // Check if user is logged in
    if (!user) {
      // Save the intended action for after login
      const pendingAction = {
        type: 'addToWishlist',
        bookId: book.id,
        bookTitle: book.title,
        timestamp: Date.now()
      };
      
      const existingPendingActions = JSON.parse(localStorage.getItem('pendingActions') || '[]');
      existingPendingActions.push(pendingAction);
      localStorage.setItem('pendingActions', JSON.stringify(existingPendingActions));
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      
      alert(`Please login to add "${book.title}" to your wishlist. You'll be redirected to the login page.`);
      navigate('/login', { 
        state: { 
          message: `Please login to add "${book.title}" to your wishlist`,
          redirectTo: window.location.pathname
        }
      });
      return;
    }
    
    if (isAddingToWishlist) return;
    
    setIsAddingToWishlist(true);
    try {
      // Use context function for wishlist
      await addToWishlist(book.id);
      
      // Success - context updates global state
      console.log('Added to wishlist successfully');
      
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      
      // Handle authentication errors
      if (err.response?.status === 401 || err.message?.includes('401')) {
        const pendingAction = {
          type: 'addToWishlist',
          bookId: book.id,
          bookTitle: book.title,
          timestamp: Date.now()
        };
        
        localStorage.setItem('pendingActions', JSON.stringify([pendingAction]));
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        
        alert('Your session has expired. Please login again to continue.');
        navigate('/login', { 
          state: { 
            message: 'Session expired. Please login to continue.',
            redirectTo: window.location.pathname
          }
        });
      } else {
        alert(err.message || 'Failed to add to wishlist. Please try again.');
      }
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Helper function to get price display
  const getPriceDisplay = () => {
    const salePrice = book.sale_price || book.current_price;
    const listPrice = book.list_price || book.originalPrice;
    
    return {
      currentPrice: salePrice || listPrice,
      originalPrice: salePrice ? listPrice : null,
      isOnSale: !!salePrice && salePrice !== listPrice
    };
  };

  // Get stock status
  const getStockStatus = () => {
    // Use stock_quantity from database if available
    if (book.stock_quantity !== undefined) {
      return {
        inStock: book.stock_quantity > 0,
        status: book.stock_quantity > 0 ? "In Stock" : "Out of Stock",
        lowStock: book.stock_quantity > 0 && book.stock_quantity <= 5
      };
    }
    
    // Fallback to stock_status if available
    if (book.stock_status) {
      return {
        inStock: book.stock_status === "In Stock",
        status: book.stock_status,
        lowStock: false
      };
    }
    
    // Default
    return {
      inStock: true,
      status: "In Stock",
      lowStock: false
    };
  };

  // Get cover image
  const getCoverImage = () => {
    return book.cover_image_url || book.image || 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&h=400&fit=crop';
  };

  const { currentPrice, originalPrice, isOnSale } = getPriceDisplay();
  const { inStock, status, lowStock } = getStockStatus();
  const coverImage = getCoverImage();

  // Determine button text based on user status
  const getCartButtonText = () => {
    if (!user) return 'Add to Cart'; // Show normal text for logged out users
    if (isInCart) return 'In Cart';
    return 'Add to Cart';
  };

  // Determine button class based on user status
  const getCartButtonClass = () => {
    if (!user) {
      // For logged out users, button looks clickable but will redirect
      return inStock 
        ? 'bg-blue-600 text-white hover:bg-blue-700' 
        : 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }
    
    // For logged in users
    if (isInCart) return 'bg-green-600 text-white hover:bg-green-700';
    if (inStock) return 'bg-blue-600 text-white hover:bg-blue-700';
    return 'bg-gray-100 text-gray-400 cursor-not-allowed';
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/book/${book.id || book.slug}`}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="flex">
            {/* Book Image */}
            <div className="w-32 h-48 shrink-0">
              <img
                src={coverImage}
                alt={book.title || 'Book cover'}
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
                            i < Math.floor(book.average_rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      ({book.review_count || 0} reviews)
                    </span>
                    <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {book.categories?.[0]?.name || 'Uncategorized'}
                    </span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${currentPrice?.toFixed(2) || '0.00'}
                  </div>
                  {isOnSale && originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      ${originalPrice.toFixed(2)}
                    </div>
                  )}
                  {!inStock && (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full mt-2">
                      {status}
                    </span>
                  )}
                  {lowStock && (
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mt-2">
                      Low Stock
                    </span>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {book.short_description || book.description?.substring(0, 150) + '...'}
              </p>
              
              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!inStock || isAddingToCart}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${getCartButtonClass()}`}
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} className="inline mr-2" />
                        {getCartButtonText()}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    disabled={isAddingToWishlist}
                    className={`p-2 rounded-lg transition-colors ${
                      isInWishlist && user
                        ? 'text-red-500 bg-red-50'
                        : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    {isAddingToWishlist ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Heart size={18} className={isInWishlist && user ? 'fill-current' : ''} />
                    )}
                  </button>
                </div>
                <Link
                  to={`/book/${book.id || book.slug}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Details →
                </Link>
              </div>
              {!user && (
                <p className="text-xs text-gray-500 mt-2">
                  <span className="text-blue-600">Login required</span> to add items to cart or wishlist
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View (default)
  return (
    <Link to={`/book/${book.id || book.slug}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
        {/* Book Image */}
        <div className="relative overflow-hidden">
          <img
            src={coverImage}
            alt={book.title || 'Book cover'}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            {!inStock && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                {status}
              </span>
            )}
            {isOnSale && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Sale
              </span>
            )}
            {lowStock && inStock && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Low Stock
              </span>
            )}
            {book.is_featured && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Featured
              </span>
            )}
            {!user && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                Login to Add
              </span>
            )}
          </div>
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-x-2">
              <button
                onClick={handleAddToCart}
                disabled={!inStock || isAddingToCart}
                className={`p-3 rounded-full shadow-lg transition-all ${
                  !user
                    ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-110'
                    : isInCart
                    ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-110'
                    : inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-110'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
                title={!user ? "Login to add to cart" : ""}
              >
                {isAddingToCart ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : !user ? (
                  <span className="text-xs font-semibold">Login</span>
                ) : (
                  <ShoppingCart size={20} />
                )}
              </button>
              <button
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
                className={`p-3 rounded-full shadow-lg transition-all ${
                  !user
                    ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 hover:scale-110'
                    : isInWishlist
                    ? 'bg-red-50 text-red-500 hover:bg-red-100 hover:scale-110'
                    : 'bg-white text-gray-700 hover:text-red-500 hover:scale-110'
                }`}
                title={!user ? "Login to add to wishlist" : ""}
              >
                {isAddingToWishlist ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : !user ? (
                  <span className="text-xs font-semibold">❤️</span>
                ) : (
                  <Heart size={20} className={isInWishlist ? 'fill-current' : ''} />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Book Details */}
        <div className="p-4">
          {/* Category */}
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
            {book.categories?.[0]?.name || 'Uncategorized'}
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
                    i < Math.floor(book.average_rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-300 text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {book.review_count || 0}
            </span>
            {book.publication_date && (
              <span className="ml-2 text-sm text-gray-400">
                {new Date(book.publication_date).getFullYear()}
              </span>
            )}
          </div>
          
          {/* Price & Action */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ${currentPrice?.toFixed(2) || '0.00'}
              </span>
              {isOnSale && originalPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!inStock || isAddingToCart}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center ${getCartButtonClass()}`}
            >
              {isAddingToCart ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : (
                <ShoppingCart size={16} className="inline mr-2" />
              )}
              {isAddingToCart ? 'Adding...' : getCartButtonText()}
            </button>
          </div>
          {!user && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Login to save items to your account
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;