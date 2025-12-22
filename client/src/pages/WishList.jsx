import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, X, Star, Filter, SortAsc, Grid, List } from 'lucide-react';

const WishlistPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      price: 29.99,
      originalPrice: 34.99,
      rating: 4.5,
      reviews: 1245,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      inStock: true,
      category: 'Mystery & Thriller'
    },
    {
      id: 2,
      title: 'Atomic Habits',
      author: 'James Clear',
      price: 24.99,
      originalPrice: 27.99,
      rating: 4.7,
      reviews: 2890,
      image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400',
      inStock: true,
      category: 'Self-Help'
    },
    {
      id: 3,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      price: 27.99,
      originalPrice: 29.99,
      rating: 4.8,
      reviews: 1876,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      inStock: false,
      category: 'Science Fiction'
    },
    {
      id: 4,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      price: 19.99,
      originalPrice: null,
      rating: 4.4,
      reviews: 1567,
      image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
      inStock: true,
      category: 'Fiction'
    },
    {
      id: 5,
      title: 'Dune',
      author: 'Frank Herbert',
      price: 29.99,
      originalPrice: 34.99,
      rating: 4.6,
      reviews: 3256,
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
      inStock: true,
      category: 'Science Fiction'
    },
    {
      id: 6,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      price: 22.99,
      originalPrice: 26.99,
      rating: 4.8,
      reviews: 4321,
      image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
      inStock: true,
      category: 'Fantasy'
    },
    {
      id: 7,
      title: 'Educated',
      author: 'Tara Westover',
      price: 26.99,
      originalPrice: null,
      rating: 4.7,
      reviews: 1987,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      inStock: true,
      category: 'Memoir'
    },
    {
      id: 8,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      price: 31.99,
      originalPrice: 35.99,
      rating: 4.5,
      reviews: 3456,
      image: 'https://images.unsplash.com/photo-1531346688376-ab6275c4725e?w=400',
      inStock: false,
      category: 'History'
    }
  ]);

  const categories = ['All', 'Fiction', 'Science Fiction', 'Mystery & Thriller', 'Self-Help', 'Fantasy', 'Memoir', 'History'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const removeFromWishlist = (id) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const addToCart = (item) => {
    alert(`Added "${item.title}" to cart!`);
    // Here you would typically add to cart via context/state
  };

  const moveAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock);
    alert(`Added ${inStockItems.length} in-stock items to cart!`);
  };

  const filteredItems = selectedCategory === 'All' 
    ? wishlistItems 
    : wishlistItems.filter(item => item.category === selectedCategory);

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

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
              <button
                onClick={moveAllToCart}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <ShoppingCart size={20} className="mr-2" />
                Add All to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-linear-to-r from-pink-500 to-red-500 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Items</p>
                <p className="text-2xl font-bold">{wishlistItems.length}</p>
              </div>
              <Heart size={32} className="opacity-80" />
            </div>
          </div>
          <div className="bg-linear-to-r from-blue-500 to-purple-500 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">In Stock</p>
                <p className="text-2xl font-bold">{wishlistItems.filter(item => item.inStock).length}</p>
              </div>
              <ShoppingCart size={32} className="opacity-80" />
            </div>
          </div>
          <div className="bg-linear-to-r from-green-500 to-emerald-500 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Value</p>
                <p className="text-2xl font-bold">
                  ${wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </p>
              </div>
              <Star size={32} className="opacity-80" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
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
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Browse Books
            </button>
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
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <X size={18} />
                  </button>
                  {!item.inStock && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Out of Stock
                    </div>
                  )}
                  {item.originalPrice && (
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
                    <span className="text-sm text-gray-600">{item.rating}</span>
                    <span className="text-sm text-gray-400">({item.reviews.toLocaleString()})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-gray-900">${item.price.toFixed(2)}</p>
                      {item.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">${item.originalPrice.toFixed(2)}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600">
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.inStock}
                        className={`p-2 rounded ${item.inStock ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        <ShoppingCart size={20} />
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
                          <span className="text-sm font-medium">{item.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({item.reviews.toLocaleString()})</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${item.price.toFixed(2)}</p>
                      {item.originalPrice && (
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
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-gray-400 hover:text-red-600 transition flex items-center"
                      >
                        <X size={18} className="mr-1" />
                        Remove
                      </button>
                      <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center">
                        <Eye size={18} className="mr-2" />
                        View Details
                      </button>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.inStock}
                        className={`px-4 py-2 rounded-lg flex items-center ${item.inStock ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        <ShoppingCart size={18} className="mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {sortedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Based on Your Wishlist</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition">
                  <div className="h-40 bg-gray-100 rounded-lg mb-3"></div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">Recommended Book {i}</h3>
                  <p className="text-sm text-gray-600 mb-2">Author Name</p>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900">$24.99</p>
                    <button className="p-2 text-gray-400 hover:text-red-600">
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