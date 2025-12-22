import { useState } from 'react';
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
  User
} from 'lucide-react';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState('paperback');
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock book data
  const book = {
    id: parseInt(id),
    title: "The Midnight Library: A Novel",
    author: "Matt Haig",
    authorBio: "Matt Haig is the author of several bestselling novels including 'The Humans' and 'How to Stop Time'. His work has been translated into over 40 languages.",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.5,
    reviews: 2457,
    pages: 304,
    publishedDate: "September 29, 2020",
    publisher: "Penguin Books",
    isbn: "978-0525559474",
    language: "English",
    category: "Fiction / Magical Realism",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
    longDescription: `
      <p>Nora Seed has a list of regrets. She feels she has let everyone down, including herself. But things are about to change.</p>
      <p>The books in the Midnight Library enable Nora to live as if she had done things differently. With the help of an old friend, she can now undo every one of her regrets as she tries to work out her perfect life.</p>
      <p>But things aren't always what she imagined they'd be, and soon her choices place the library and herself in extreme danger. Before time runs out, she must answer the ultimate question: what is the best way to live?</p>
    `,
    formats: [
      { type: 'paperback', price: 24.99, discount: 17 },
      { type: 'hardcover', price: 34.99, discount: 10 },
      { type: 'ebook', price: 14.99, discount: 25 },
      { type: 'audiobook', price: 19.99, discount: 20 }
    ],
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=1200&fit=crop"
    ],
    inStock: true,
    stockCount: 47,
    deliveryTime: "2-3 business days",
    features: [
      "New York Times Bestseller",
      "Goodreads Choice Award Winner",
      "A Good Morning America Book Club Pick"
    ],
    specifications: {
      dimensions: "5.5 x 1 x 8.25 inches",
      weight: "12.8 ounces",
      ageRange: "Adult"
    },
    similarBooks: [
      {
        id: 2,
        title: "The Invisible Life of Addie LaRue",
        author: "V.E. Schwab",
        price: 26.99,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop"
      },
      {
        id: 3,
        title: "Klara and the Sun",
        author: "Kazuo Ishiguro",
        price: 27.99,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1531346688376-ab6275c4725e?w=300&h=450&fit=crop"
      },
      {
        id: 4,
        title: "Project Hail Mary",
        author: "Andy Weir",
        price: 29.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop"
      }
    ]
  };

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      rating: 5,
      date: "2 weeks ago",
      verified: true,
      helpful: 342,
      content: "This book changed my perspective on life. The concept is brilliant and the writing is beautiful. Couldn't put it down!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      user: "Michael Chen",
      rating: 4,
      date: "1 month ago",
      verified: true,
      helpful: 187,
      content: "Thought-provoking and emotional. The premise is unique and well-executed. Some parts felt a bit repetitive, but overall a great read.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      user: "Emma Rodriguez",
      rating: 5,
      date: "3 months ago",
      verified: false,
      helpful: 92,
      content: "Beautifully written. Made me reflect on my own life choices. The ending was perfect and left me in tears.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const ratingDistribution = {
    5: 68,
    4: 22,
    3: 7,
    2: 2,
    1: 1
  };

  // Calculate average rating
  const averageRating = book.rating;
  const totalReviews = book.reviews;

  // Handle add to cart
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      // Success notification would go here
    }, 1000);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Get current format
  const currentFormat = book.formats.find(f => f.type === selectedFormat) || book.formats[0];

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
            <Link to={`/category/${book.category.toLowerCase().split('/')[0]}`} className="hover:text-blue-600 transition-colors">
              {book.category.split('/')[0]}
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-xs">{book.title}</span>
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
                      src={book.images[selectedImage]}
                      alt={book.title}
                      className="w-full h-auto object-cover max-h-[125] mx-auto"
                    />
                  </div>
                  
                  {/* Thumbnail Images */}
                  <div className="flex space-x-2">
                    {book.images.map((img, index) => (
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
                        />
                      </button>
                    ))}
                  </div>
                  
                  {/* Stock Info */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Package className="text-blue-600 mr-2" size={20} />
                        <span className="text-sm">
                          {book.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      {book.inStock && (
                        <span className="text-sm text-gray-600">
                          {book.stockCount} available
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <Truck className="mr-2" size={16} />
                      <span>Delivery: {book.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right: Details */}
              <div className="lg:w-3/5">
                {/* Category */}
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mb-4">
                  {book.category}
                </span>
                
                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  {book.title}
                </h1>
                
                {/* Author */}
                <div className="flex items-center mb-6">
                  <BookOpen className="text-gray-400 mr-2" size={20} />
                  <span className="text-lg text-gray-700">
                    by <Link to={`/author/${book.author.toLowerCase().replace(/\s+/g, '-')}`} className="text-blue-600 hover:underline">
                      {book.author}
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
                          i < Math.floor(averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : i < averageRating
                            ? 'fill-yellow-300 text-yellow-300'
                            : 'fill-gray-300 text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-lg font-semibold">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    ({totalReviews.toLocaleString()} reviews)
                  </span>
                  <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center">
                    <Award size={14} className="mr-1" />
                    Bestseller
                  </div>
                </div>
                
                {/* Features */}
                <div className="mb-6">
                  {book.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-600 mb-2">
                      <Check className="text-green-500 mr-2" size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Format Selection */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-3">Select Format:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {book.formats.map((format) => (
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
                            {formatPrice(book.originalPrice)}
                          </span>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Save {formatPrice(book.originalPrice - currentFormat.price)}
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
                      disabled={!book.inStock || isAddingToCart}
                      className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${
                        book.inStock
                          ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isAddingToCart ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
                    <div className="font-semibold">{book.pages}</div>
                    <div className="text-sm text-gray-600">Pages</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar className="mx-auto text-blue-600 mb-2" size={20} />
                    <div className="font-semibold">{book.publishedDate.split(' ')[2]}</div>
                    <div className="text-sm text-gray-600">Published</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Globe className="mx-auto text-blue-600 mb-2" size={20} />
                    <div className="font-semibold">{book.language}</div>
                    <div className="text-sm text-gray-600">Language</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bookmark className="mx-auto text-blue-600 mb-2" size={20} />
                    <div className="font-semibold">{book.isbn}</div>
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
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">{book.description}</p>
                  <div 
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: book.longDescription }}
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
                        <dd className="font-medium">{book.publisher}</dd>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">Publication Date</dt>
                        <dd className="font-medium">{book.publishedDate}</dd>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">Pages</dt>
                        <dd className="font-medium">{book.pages}</dd>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">Language</dt>
                        <dd className="font-medium">{book.language}</dd>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">ISBN-10</dt>
                        <dd className="font-medium">{book.isbn}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Physical Specifications</h4>
                    <dl className="space-y-3">
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">Dimensions</dt>
                        <dd className="font-medium">{book.specifications.dimensions}</dd>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">Weight</dt>
                        <dd className="font-medium">{book.specifications.weight}</dd>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">Age Range</dt>
                        <dd className="font-medium">{book.specifications.ageRange}</dd>
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
                      <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                      <div className="flex justify-center lg:justify-start mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < Math.floor(averageRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : i < averageRating
                                ? 'fill-yellow-300 text-yellow-300'
                                : 'fill-gray-300 text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-gray-600">
                        Based on {totalReviews.toLocaleString()} reviews
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
                  
                  {/* Review Form */}
                  <div className="mb-8 p-6 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-4">Share your thoughts</h4>
                    <button className="w-full md:w-auto px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      Write a review
                    </button>
                  </div>
                  
                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <img
                              src={review.avatar}
                              alt={review.user}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <div className="font-medium">{review.user}</div>
                              <div className="flex items-center text-sm text-gray-600">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'fill-gray-300 text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="mx-2">•</span>
                                <span>{review.date}</span>
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
                        <p className="text-gray-700 mb-4">{review.content}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <button className="flex items-center mr-4 hover:text-blue-600 transition-colors">
                            <ThumbsUp size={16} className="mr-1" />
                            Helpful ({review.helpful})
                          </button>
                          <button className="flex items-center hover:text-blue-600 transition-colors">
                            <MessageCircle size={16} className="mr-1" />
                            Reply
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Load More Button */}
                    <div className="text-center pt-4">
                      <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Load More Reviews
                      </button>
                    </div>
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
                        <h4 className="font-semibold text-lg">{book.author}</h4>
                        <p className="text-gray-600 text-sm mt-2">Author</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h4 className="font-semibold text-lg mb-4">About the Author</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">{book.authorBio}</p>
                    <div className="flex space-x-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        View All Books
                      </button>
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
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">You may also like</h2>
            <Link to="/catalog" className="text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {book.similarBooks.map((similarBook) => (
              <Link
                key={similarBook.id}
                to={`/book/${similarBook.id}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex">
                  <div className="w-24 h-32 shrink-0">
                    <img
                      src={similarBook.image}
                      alt={similarBook.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                              i < Math.floor(similarBook.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-300 text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {similarBook.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="font-bold text-lg">
                      ${similarBook.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;