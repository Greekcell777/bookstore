import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Heart,
  ChevronLeft,
  Package,
  Truck,
  Shield,
  Share2,
  BookOpen,
  Calendar,
  Globe,
  Bookmark,
  Users,
  Award,
  Check,
  X,
  ThumbsUp,
  MessageCircle,
  Clock,
  User,
  Loader
} from 'lucide-react';
import { useBookStore } from '../components/BookstoreContext';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState('paperback');
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Use BookStore context
  const {
    books,
    wishlist,
    cart,
    user,
    isLoading: contextIsLoading,
    error: contextError,
    addToCart: contextAddToCart,
    addToWishlist: contextAddToWishlist,
    removeFromWishlist: contextRemoveFromWishlist,
    fetchBooks: contextFetchBooks,
    fetchFeaturedBooks: contextFetchFeaturedBooks,
    cartItemCount,
    getFilteredBooks,
    updateFilters,
    resetFilters
  } = useBookStore();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  });

  // Fetch book data
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        
        // Try to find book in context first
        let bookData = books.find(b => b.id === parseInt(id));
        
        // If not found in context, fetch it
        if (!bookData) {
          // Fetch books with this specific ID
          const response = await contextFetchBooks();
          bookData = response.find(b => b.id === parseInt(id));
          
          if (!bookData) {
            throw new Error('Book not found');
          }
        }
        
        setBook(bookData);
        
        // Set default format based on available formats
        if (bookData.format) {
          setSelectedFormat(bookData.format.toLowerCase());
        }
        
        // Fetch reviews for this book
        fetchReviews(bookData);
        
        // Fetch similar books
        fetchSimilarBooks(bookData);
        
      } catch (err) {
        setError(err.message || 'Failed to fetch book');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id, books]);

  // Check if book is in wishlist
  const isInWishlist = wishlist.some(item => 
    item.book_id === parseInt(id) || item.id === parseInt(id)
  );

  // Fetch reviews (simulated - in real app you'd have reviewsAPI in context)
  const fetchReviews = async (bookData) => {
    try {
      // Mock reviews based on book data
      const mockReviews = [
        {
          id: 1,
          user: { name: 'John Doe' },
          rating: bookData.average_rating || 4,
          content: 'Great book! Highly recommended.',
          created_at: '2024-01-15',
          verified: true,
          helpful_count: 24
        },
        {
          id: 2,
          user: { name: 'Jane Smith' },
          rating: bookData.average_rating || 5,
          content: 'Excellent read, couldn\'t put it down!',
          created_at: '2024-02-01',
          verified: false,
          helpful_count: 12
        }
      ];
      
      setReviews(mockReviews);
      
      // Calculate rating distribution
      if (bookData.rating_count > 0) {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        // Simulate distribution based on average rating
        const avg = bookData.average_rating || 4;
        distribution[Math.round(avg)] = 100; // Simplified for demo
        
        setRatingDistribution(distribution);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    }
  };

  // Fetch similar books using context
  const fetchSimilarBooks = async (bookData) => {
    try {
      // Get first category for filtering
      const categoryName = bookData.categories?.[0]?.name;
      
      if (categoryName) {
        // Update filters to get similar books
        updateFilters({
          category: categoryName,
          searchQuery: '',
          sortBy: 'title'
        });
        
        // Get filtered books from context
        const filteredBooks = getFilteredBooks();
        // Exclude current book and limit to 3
        const similar = filteredBooks
          .filter(b => b.id !== parseInt(id))
          .slice(0, 3);
        setSimilarBooks(similar);
      } else {
        // If no category, get featured books
        const featured = await contextFetchFeaturedBooks();
        const similar = featured
          .filter(b => b.id !== parseInt(id))
          .slice(0, 3);
        setSimilarBooks(similar);
      }
    } catch (err) {
      console.error('Error fetching similar books:', err);
      setSimilarBooks([]);
    }
  };

  // Process book data
  const processBookData = (bookData) => {
    if (!bookData) return null;
    
    // Generate multiple images
    const mainImage = bookData.cover_image_url || 
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=1200&fit=crop';
    
    const additionalImages = bookData.images?.map(img => img.image_url) || [];
    const images = [mainImage, ...additionalImages].filter(Boolean);
    
    // Generate formats
    const formats = [
      { 
        type: bookData.format?.toLowerCase() || 'paperback', 
        price: bookData.current_price || bookData.list_price || 0,
        discount: bookData.discount_percentage || 0
      }
    ];

    // Parse publication date
    let publishedDate = "Unknown";
    if (bookData.publication_date) {
      try {
        publishedDate = new Date(bookData.publication_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
        console.error('Error parsing date:', e);
      }
    }

    return {
      id: bookData.id,
      title: bookData.title,
      author: bookData.author,
      authorBio: bookData.author_bio || `${bookData.author} is a published author with several acclaimed works in their portfolio.`,
      price: bookData.current_price || bookData.list_price || 0,
      originalPrice: bookData.list_price || 0,
      rating: bookData.average_rating || 0,
      reviews: bookData.rating_count || 0,
      pages: bookData.page_count || 0,
      publishedDate,
      publisher: bookData.publisher || "Unknown",
      isbn: bookData.isbn_13 || bookData.isbn_10 || "Unknown",
      language: bookData.language || "English",
      category: bookData.categories?.[0]?.name || "Uncategorized",
      description: bookData.short_description || bookData.description || "No description available.",
      longDescription: bookData.description || `<p>This book offers an engaging narrative that captivates readers from start to finish. With compelling characters and a well-crafted plot, it's a must-read for fans of the genre.</p>`,
      formats,
      images,
      inStock: bookData.is_available && (bookData.stock_quantity > 0 || bookData.allow_backorders),
      stockCount: bookData.stock_quantity || 0,
      deliveryTime: "2-3 business days",
      features: [
        bookData.is_bestseller && "Bestseller",
        bookData.is_featured && "Featured",
        bookData.is_new_release && "New Release"
      ].filter(Boolean),
      specifications: {
        dimensions: bookData.dimensions || "Not specified",
        weight: bookData.weight_grams ? `${bookData.weight_grams}g` : "Not specified",
        ageRange: "General Audience"
      },
      meta: {
        publisher_id: bookData.publisher_id,
        sku: bookData.sku,
        status: bookData.status
      }
    };
  };

  // Handle add to cart using context
  const handleAddToCart = async () => {
    if (!book) return;
    
    setIsAddingToCart(true);
    try {
      await contextAddToCart(book.id, quantity);
      
      // Show success message
      alert('Added to cart successfully!');
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(err.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle wishlist toggle using context
  const handleWishlistToggle = async () => {
    if (!book) return;
    
    try {
      if (isInWishlist) {
        // Find wishlist item and remove
        const wishlistItem = wishlist.find(item => 
          item.book_id === book.id || item.id === book.id
        );
        if (wishlistItem) {
          await contextRemoveFromWishlist(wishlistItem.id);
          alert('Removed from wishlist!');
        }
      } else {
        await contextAddToWishlist(book.id);
        alert('Added to wishlist!');
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
      alert(err.message || 'Failed to update wishlist');
    }
  };

  // Format price
  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Submit a review (simulated)
  const handleSubmitReview = async () => {
    if (!user) {
      alert('Please login to submit a review');
      return;
    }
    
    alert('Review submitted successfully!');
    // In a real app, you would call the API here
  };

  // Use context loading/error if available
  const isLoading = loading || contextIsLoading;
  const hasError = error || contextError;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
          <p className="text-gray-600 mb-6">{hasError || 'The book you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Process book data
  const processedBook = processBookData(book);
  const currentFormat = processedBook.formats.find(f => f.type === selectedFormat) || processedBook.formats[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back
            </button>
            <span>/</span>
            <Link to="/catalog" className="hover:text-blue-600 transition-colors">
              Books
            </Link>
            <span>/</span>
            <Link to={`/category/${processedBook.category.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="hover:text-blue-600 transition-colors">
              {processedBook.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-xs">{processedBook.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Book Main Info */}
          <div className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left: Images */}
              <div className="lg:w-2/5">
                <div className="sticky top-8">
                  {/* Main Image */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={processedBook.images[selectedImage]}
                      alt={processedBook.title}
                      className="w-full h-auto object-cover max-h-[125] mx-auto"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=1200&fit=crop';
                      }}
                    />
                  </div>
                  
                  {/* Thumbnail Images */}
                  {processedBook.images.length > 1 && (
                    <div className="flex space-x-2">
                      {processedBook.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-1 h-20 rounded-md overflow-hidden border-2 transition-all ${
                            selectedImage === index 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Stock Info */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Package className="text-blue-600 mr-2" size={20} />
                        <span className="text-sm">
                          {processedBook.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      {processedBook.inStock && processedBook.stockCount > 0 && (
                        <span className="text-sm text-gray-600">
                          {processedBook.stockCount} available
                        </span>
                      )}
                      {processedBook.inStock && processedBook.stockCount <= 0 && (
                        <span className="text-sm text-yellow-600">
                          Backorder Available
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <Truck className="mr-2" size={16} />
                      <span>Delivery: {processedBook.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right: Details */}
              <div className="lg:w-3/5">
                {/* Category */}
                {processedBook.category && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mb-4">
                    {processedBook.category}
                  </span>
                )}
                
                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  {processedBook.title}
                </h1>
                
                {/* Author */}
                <div className="flex items-center mb-6">
                  <BookOpen className="text-gray-400 mr-2" size={20} />
                  <span className="text-lg text-gray-700">
                    by <Link to={`/author/${processedBook.author.toLowerCase().replace(/\s+/g, '-')}`} 
                          className="text-blue-600 hover:underline">
                      {processedBook.author}
                    </Link>
                  </span>
                </div>
                
                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(processedBook.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : i < processedBook.rating
                            ? 'fill-yellow-300 text-yellow-300'
                            : 'fill-gray-300 text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-lg font-semibold">
                      {processedBook.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    ({processedBook.reviews.toLocaleString()} reviews)
                  </span>
                  {book.is_bestseller && (
                    <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center">
                      <Award size={14} className="mr-1" />
                      Bestseller
                    </div>
                  )}
                  {book.is_featured && (
                    <div className="ml-4 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full flex items-center">
                      <Award size={14} className="mr-1" />
                      Featured
                    </div>
                  )}
                </div>
                
                {/* Features */}
                {processedBook.features.length > 0 && (
                  <div className="mb-6">
                    {processedBook.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-600 mb-2">
                        <Check className="text-green-500 mr-2" size={16} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Format Selection */}
                {processedBook.formats.length > 1 && (
                  <div className="mb-8">
                    <h3 className="font-semibold mb-3">Select Format:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {processedBook.formats.map((format) => (
                        <button
                          key={format.type}
                          onClick={() => setSelectedFormat(format.type)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedFormat === format.type
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm font-medium capitalize">
                            {format.type}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-lg font-bold">
                              {formatPrice(format.price)}
                            </span>
                            {format.discount > 0 && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                -{format.discount}%
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Price & Actions */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-3xl font-bold">
                        {formatPrice(currentFormat.price)}
                      </div>
                      {currentFormat.discount > 0 && (
                        <div className="flex items-center">
                          <span className="text-lg text-gray-400 line-through mr-2">
                            {formatPrice(processedBook.originalPrice)}
                          </span>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Save {formatPrice(processedBook.originalPrice - currentFormat.price)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Quantity */}
                    <div className="flex items-center">
                      <span className="mr-3 font-medium">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-2 min-w-[12.5] text-center font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={!processedBook.inStock || isAddingToCart}
                      className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${
                        processedBook.inStock
                          ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isAddingToCart ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin text-white mr-2" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={20} className="mr-2" />
                          Add to Cart
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleWishlistToggle}
                      className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium border transition-all ${
                        isInWishlist
                          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <Heart
                        size={20}
                        className={`mr-2 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`}
                      />
                      {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                    </button>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Shield className="text-gray-400 mr-2" size={16} />
                        <span>Secure payment</span>
                      </div>
                      <div className="flex items-center">
                        <Truck className="text-gray-400 mr-2" size={16} />
                        <span>Free shipping over $35</span>
                      </div>
                      <div className="flex items-center">
                        <Package className="text-gray-400 mr-2" size={16} />
                        <span>30-day returns</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="text-gray-400 mr-2" size={16} />
                        <span>Authentic product</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <BookOpen className="mx-auto text-blue-600 mb-2" size={20} />
                    <div className="font-semibold">{processedBook.pages}</div>
                    <div className="text-sm text-gray-600">Pages</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar className="mx-auto text-blue-600 mb-2" size={20} />
                    <div className="font-semibold">{processedBook.publishedDate.split(' ')[2]}</div>
                    <div className="text-sm text-gray-600">Published</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Globe className="mx-auto text-blue-600 mb-2" size={20} />
                    <div className="font-semibold">{processedBook.language}</div>
                    <div className="text-sm text-gray-600">Language</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bookmark className="mx-auto text-blue-600 mb-2" size={20} />
                    <div className="font-semibold">{processedBook.isbn}</div>
                    <div className="text-sm text-gray-600">ISBN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto">
              {['description', 'specifications', 'reviews', 'author'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="p-6 lg:p-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">About this book</h3>
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">{processedBook.description}</p>
                  <div 
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: processedBook.longDescription }}
                  />
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Product Details</h4>
                    <dl className="space-y-3">
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">Publisher</dt>
                        <dd className="font-medium">{processedBook.publisher}</dd>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">Publication Date</dt>
                        <dd className="font-medium">{processedBook.publishedDate}</dd>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">Pages</dt>
                        <dd className="font-medium">{processedBook.pages}</dd>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">Language</dt>
                        <dd className="font-medium">{processedBook.language}</dd>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">ISBN-13</dt>
                        <dd className="font-medium">{processedBook.isbn}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Physical Specifications</h4>
                    <dl className="space-y-3">
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">Dimensions</dt>
                        <dd className="font-medium">{processedBook.specifications.dimensions}</dd>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">Weight</dt>
                        <dd className="font-medium">{processedBook.specifications.weight}</dd>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">Age Range</dt>
                        <dd className="font-medium">{processedBook.specifications.ageRange}</dd>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">SKU</dt>
                        <dd className="font-medium">{book.sku}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  {/* Rating Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="text-center lg:text-left">
                      <div className="text-5xl font-bold mb-2">{processedBook.rating.toFixed(1)}</div>
                      <div className="flex justify-center lg:justify-start mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < Math.floor(processedBook.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : i < processedBook.rating
                                ? 'fill-yellow-300 text-yellow-300'
                                : 'fill-gray-300 text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-gray-600">
                        Based on {processedBook.reviews.toLocaleString()} reviews
                      </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                      {Object.entries(ratingDistribution).reverse().map(([stars, percentage]) => (
                        <div key={stars} className="flex items-center mb-3">
                          <div className="flex items-center w-20">
                            <span className="text-sm w-4">{stars}</span>
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-1" />
                          </div>
                          <div className="flex-1 mx-4">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 w-12 text-right">
                            {percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Review Form - Only for logged in users */}
                  {user && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-4">Share your thoughts</h4>
                      <button 
                        className="w-full md:w-auto px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        onClick={handleSubmitReview}
                      >
                        Write a review
                      </button>
                    </div>
                  )}
                  
                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                              <User className="text-gray-500" size={20} />
                            </div>
                            <div>
                              <div className="font-medium">{review.user?.name || 'Anonymous'}</div>
                              <div className="flex items-center text-sm text-gray-600">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < (review.rating || 0)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'fill-gray-300 text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="mx-2">•</span>
                                <span>{review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recently'}</span>
                                {review.verified && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span className="text-green-600 flex items-center">
                                      <Check size={12} className="mr-1" />
                                      Verified Purchase
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Share2 size={18} />
                          </button>
                        </div>
                        <p className="text-gray-700 mb-4">{review.content || 'No review content'}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <button 
                            className="flex items-center mr-4 hover:text-blue-600 transition-colors"
                            onClick={() => alert('Marked as helpful!')}
                          >
                            <ThumbsUp size={16} className="mr-1" />
                            Helpful ({review.helpful_count || 0})
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Load More Button */}
                    {reviews.length > 0 && (
                      <div className="text-center pt-4">
                        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Load More Reviews
                        </button>
                      </div>
                    )}
                    
                    {reviews.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No reviews yet. Be the first to review this book!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'author' && (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="bg-gray-100 rounded-lg p-6">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Users size={40} className="text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-lg">{processedBook.author}</h4>
                        <p className="text-gray-600 text-sm mt-2">Author</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h4 className="font-semibold text-lg mb-4">About the Author</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">{processedBook.authorBio}</p>
                    <div className="flex space-x-4">
                      <Link 
                        to={`/catalog?author=${encodeURIComponent(processedBook.author)}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View All Books
                      </Link>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Follow Author
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Similar Books */}
        {similarBooks.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">You may also like</h2>
              <Link to="/catalog" className="text-blue-600 hover:text-blue-700 font-medium">
                View all →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarBooks.map((similarBook) => (
                <Link
                  key={similarBook.id}
                  to={`/book/${similarBook.id}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex">
                    <div className="w-24 h-32 shrink-0">
                      <img
                        src={similarBook.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop'}
                        alt={similarBook.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop';
                        }}
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600">
                        {similarBook.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{similarBook.author}</p>
                      <div className="flex items-center mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(similarBook.average_rating || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-300 text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {(similarBook.average_rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="font-bold text-lg">
                        {formatPrice(similarBook.current_price || similarBook.list_price)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;