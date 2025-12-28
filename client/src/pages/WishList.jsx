import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  X, 
  Star, 
  Filter, 
  Grid, 
  List,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useBookStore } from '../components/BookstoreContext'; // Add this import

const WishlistPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  
  // Use SimpleBookStore context
  const { 
    wishlist, 
    removeFromWishlist, 
    addToCart,
    isLoading,
    error,
    user,
    wishlistCount
  } = useBookStore();

  const categories = ['All', 'Fiction', 'Science Fiction', 'Mystery & Thriller', 'Self-Help', 'Fantasy', 'Memoir', 'History'];

  const handleAddToCart = async (item) => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login', { 
        state: { redirectTo: '/wishlist' }
      });
      return;
    }
    
    try {
      const bookId = item.book?.id || item.bookId || item.id;
      await addToCart(bookId, 1);
      alert(`Added "${item.title || item.book?.title}" to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart');
    }
  };

  const handleRemoveFromWishlist = async (item) => {
    try {
      const itemId = item.id || item.bookId;
      await removeFromWishlist(itemId);
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove item from wishlist');
    }
  };

  const moveAllToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login', { 
        state: { redirectTo: '/wishlist' }
      });
      return;
    }
    
    try {
      const inStockItems = wishlist.filter(item => 
        item.inStock !== false && item.book?.inStock !== false
      );
      
      if (inStockItems.length === 0) {
        alert('No in-stock items in your wishlist');
        return;
      }
      
      // Add each in-stock item to cart
      for (const item of inStockItems) {
        const bookId = item.book?.id || item.bookId || item.id;
        await addToCart(bookId, 1);
      }
      
      alert(`Added ${inStockItems.length} in-stock items to cart!`);
    } catch (err) {
      console.error('Error adding all to cart:', err);
      alert('Failed to add items to cart');
    }
  };

  // Filter and sort wishlist items
  const getFilteredAndSortedItems = () => {
    // First, convert wishlist items to a consistent format
    const formattedItems = wishlist.map(item => {
      const book = item.book || item;
      return {
        id: item.id || book.id,
        bookId: item.bookId || book.id,
        title: book.title || item.title,
        author: book.author || item.author,
        price: book.sale_price || book.list_price || item.price || 0,
        originalPrice: book.list_price || item.originalPrice,
        rating: book.average_rating || item.rating || 0,
        reviews: book.review_count || item.reviews || 0,
        image: book.cover_image_url || book.image || item.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        inStock: item.inStock !== undefined ? item.inStock : (book.inStock !== false),
        category: book.categories?.[0]?.name || item.category || 'Uncategorized'
      };
    });

    // Filter by category
    const filtered = selectedCategory === 'All' 
      ? formattedItems 
      : formattedItems.filter(item => item.category === selectedCategory);

    // Sort items
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'title':
          return a.title.localeCompare(b.title);
        default: // 'date' or default
          return 0; // You might want to sort by date added if your data has that
      }
    });

    return sorted;
  };

  const sortedItems = getFilteredAndSortedItems();
  
  // Calculate totals
  const totalValue = wishlist.reduce((sum, item) => {
    const price = item.book?.sale_price || item.book?.list_price || item.price || 0;
    return sum + price;
  }, 0);
  
  const inStockCount = wishlist.filter(item => 
    item.inStock !== false && item.book?.inStock !== false
  ).length;

  // Loading state
  if (isLoading && wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">Save books you want to read later</p>
            </div>
            <div className="flex items-center gap-3">
              {wishlist.length > 0 && (
                <button
                  onClick={moveAllToCart}
                  disabled={isLoading || !user}
                  className={`px-4 py-2 rounded-lg transition flex items-center ${
                    user 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={20} className="mr-2" />
                  {isLoading ? 'Processing...' : 'Add All to Cart'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-linear-to-r from-pink-500 to-red-500 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Items</p>
                <p className="text-2xl font-bold">{wishlistCount || wishlist.length}</p>
              </div>
              <Heart size={32} className="opacity-80" />
            </div>
          </div>
          <div className="bg-linear-to-r from-blue-500 to-purple-500 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">In Stock</p>
                <p className="text-2xl font-bold">{inStockCount}</p>
              </div>
              <ShoppingCart size={32} className="opacity-80" />
            </div>
          </div>
          <div className="bg-linear-to-r from-green-500 to-emerald-500 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Value</p>
                <p className="text-2xl font-bold">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
              <Star size={32} className="opacity-80" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                <List size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-3 py-2 bg-white"
              >
                <option value="date">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {sortedItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Start adding books you want to save for later!</p>
            <Link 
              to="/catalog"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block"
            >
              Browse Books
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveFromWishlist(item)}
                    disabled={isLoading}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
                  </button>
                  {!item.inStock && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Out of Stock
                    </div>
                  )}
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Save ${(item.originalPrice - item.price).toFixed(2)}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.author}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${i < Math.floor(item.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{item.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-400">({item.reviews.toLocaleString()})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-gray-900">${item.price.toFixed(2)}</p>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <p className="text-sm text-gray-400 line-through">${item.originalPrice.toFixed(2)}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        to={`/book/${item.bookId || item.id}`}
                        className="p-2 text-gray-600 hover:text-blue-600"
                      >
                        <Eye size={20} />
                      </Link>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock || isLoading || !user}
                        className={`p-2 rounded ${
                          item.inStock && user
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ShoppingCart size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {sortedItems.map((item) => (
              <div key={item.id} className="flex items-center p-4 border-b hover:bg-gray-50 transition">
                <div className="shrink-0 w-24 h-32 bg-gray-100 rounded-lg overflow-hidden mr-6">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                      <p className="text-gray-600">{item.author}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {item.category}
                        </span>
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{item.rating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500 ml-1">({item.reviews.toLocaleString()})</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${item.price.toFixed(2)}</p>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <p className="text-sm text-gray-400 line-through">${item.originalPrice.toFixed(2)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      {!item.inStock && (
                        <span className="text-red-600 text-sm font-medium">Currently out of stock</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleRemoveFromWishlist(item)}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-red-600 transition flex items-center disabled:opacity-50"
                      >
                        {isLoading ? <Loader2 size={18} className="animate-spin mr-1" /> : <X size={18} className="mr-1" />}
                        {isLoading ? 'Removing...' : 'Remove'}
                      </button>
                      <Link 
                        to={`/book/${item.bookId || item.id}`}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center"
                      >
                        <Eye size={18} className="mr-2" />
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock || isLoading || !user}
                        className={`px-4 py-2 rounded-lg flex items-center ${
                          item.inStock && user
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart size={18} className="mr-2" />
                        {isLoading ? 'Adding...' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations - Optional: You can fetch from context if available */}
        {sortedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Based on Your Wishlist</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition">
                  <div className="h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-gray-400">Book Image</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">Recommended Book {i}</h3>
                  <p className="text-sm text-gray-600 mb-2">Author Name</p>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900">$24.99</p>
                    <button 
                      disabled={!user}
                      className={`p-2 ${user ? 'text-gray-400 hover:text-red-600' : 'text-gray-300 cursor-not-allowed'}`}
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;