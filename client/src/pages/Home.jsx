import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  Shield, 
  Truck, 
  Clock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  Award
} from 'lucide-react';
import { useBookStore } from '../components/BookstoreContext';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);
  
  // Get data and functions from context
  const {
    featuredBooks,
    categories,
    addToCart,
    addToWishlist,
    isLoading,
    error
  } = useBookStore();

  // Hero carousel images
  const heroSlides = [
    {
      title: "Discover Your Next Favorite Book",
      subtitle: "Browse our curated collection of 50,000+ titles",
      bgColor: "from-blue-600/80 to-purple-600/80",
      textColor: "text-white",
      buttonColor: "bg-white hover:bg-gray-100 text-blue-600",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&h=600&fit=crop",
      buttonText: "Browse Collection"
    },
    {
      title: "Summer Reading Sale",
      subtitle: "Up to 50% off on bestsellers & new releases",
      bgColor: "from-amber-600/80 to-orange-600/80",
      textColor: "text-white",
      buttonColor: "bg-white hover:bg-gray-100 text-amber-600",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
      buttonText: "View Sale"
    },
    {
      title: "Free Shipping Worldwide",
      subtitle: "On orders over $35. Limited time offer",
      bgColor: "from-emerald-600/80 to-teal-600/80",
      textColor: "text-white",
      buttonColor: "bg-white hover:bg-gray-100 text-emerald-600",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=600&fit=crop",
      buttonText: "Shop Now"
    }
  ];

  // Features
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Free Shipping",
      description: "On orders over $35"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payment",
      description: "100% secure transactions"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Dedicated customer service"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Guarantee",
      description: "Best books curated by experts"
    }
  ];

  // Stats - using context data where available
  const stats = [
    { 
      value: "50K+", 
      label: "Books Available", 
      icon: <BookOpen />,
    },
    { 
      value: categories?.length ? `${categories.length}+` : "150+", 
      label: "Categories", 
      icon: <BookOpen />,
    },
    { 
      value: "1M+", 
      label: "Happy Readers", 
      icon: <Users /> 
    },
    { 
      value: "4.8", 
      label: "Average Rating", 
      icon: <Star /> 
    }
  ];

  // Carousel auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle add to cart
  const handleAddToCart = async (bookId, event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      setLocalLoading(true);
      await addToCart(bookId, 1);
      // Optional: Show success toast
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = async (bookId, event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      setLocalLoading(true);
      await addToWishlist(bookId);
      // Optional: Show success toast
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  // Color mapping for categories
  const getCategoryColor = (categoryName) => {
    const colorMap = {
      'Fiction': 'bg-blue-100 text-blue-800',
      'Non-Fiction': 'bg-purple-100 text-purple-800',
      'Sci-Fi': 'bg-amber-100 text-amber-800',
      'Mystery': 'bg-emerald-100 text-emerald-800',
      'Biography': 'bg-pink-100 text-pink-800',
      'Self-Help': 'bg-indigo-100 text-indigo-800',
    };
    return colorMap[categoryName] || 'bg-gray-100 text-gray-800';
  };

  // Access the data directly from context state
  const featuredBooksData = Array.isArray(featuredBooks) ? featuredBooks : featuredBooks?.books || [];
  const categoriesData = Array.isArray(categories) ? categories : categories?.categories || [];

  return (
    <div className="min-h-screen">
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Carousel */}
      <section className="relative overflow-hidden bg-gray-100">
        {/* Carousel */}
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor}`} />
              
              {/* Content */}
              <div className="container mx-auto px-4 h-full flex items-center relative z-20">
                <div className={`max-w-2xl ${slide.textColor} transition-all duration-1000 ${
                  index === currentSlide ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 opacity-90">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/catalog"
                      className={`${slide.buttonColor} px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center group transition-all duration-300 hover:scale-105`}
                    >
                      {slide.buttonText}
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/sale"
                      className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-white hover:text-gray-900"
                    >
                      View Sale
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-all duration-500"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Books</h2>
              <p className="text-gray-600">Handpicked by our editorial team</p>
            </div>
            <Link
              to="/catalog"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center group"
            >
              View All
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading featured books...</p>
            </div>
          ) : featuredBooksData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured books available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredBooksData.slice(0, 4).map((book) => (
                <Link
                  key={book.id}
                  to={`/book/${book.id}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 block"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={book.image || book.cover_image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"}
                      alt={book.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop";
                      }}
                    />
                    {book.categories && book.categories.length > 0 && (
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(book.categories[0]?.name || '')}`}>
                          {book.categories[0]?.name || 'Category'}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(book.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-300 text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-white text-sm">{book.rating || '4.0'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{book.author}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-800">
                        KES{(book.sale_price * 130).toFixed(2) || (book.list_price * 130).toFixed(2) || 19.99}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => handleAddToWishlist(book.id, e)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          title="Add to wishlist"
                          disabled={localLoading}
                        >
                          <Star className="w-5 h-5 text-gray-400 hover:text-yellow-400" />
                        </button>
                        <button 
                          onClick={(e) => handleAddToCart(book.id, e)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 group-hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={localLoading}
                        >
                          {localLoading ? 'Adding...' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Readers Choose BookNook</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Join thousands of satisfied readers who have discovered their next favorite book with us
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform transition-all duration-500 hover:scale-110"
              >
                <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                  {stat.icon && <span className="mr-2 opacity-80">{stat.icon}</span>}
                  {stat.value}
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our extensive collection organized by genre and interest
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading categories...</p>
            </div>
          ) : categoriesData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No categories available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categoriesData.slice(0, 6).map((category) => (
                  
                    <div key={category.id} className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                      <div className={`w-12 h-12 rounded-lg ${getCategoryColor(category.name)} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-center mb-1">{category.name}</h3>
                      {category.book_count && (
                        <p className="text-gray-500 text-sm text-center">{category.book_count} books</p>
                      )}
                    </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  to="/categories"
                  className="inline-flex items-center px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-300 group"
                >
                  Explore All Categories
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Start Your Reading Journey Today
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Sign up now and get 15% off your first order, plus access to exclusive member benefits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Create Free Account
              </Link>
              <Link
                to="/catalog"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Browse as Guest
              </Link>
            </div>
            <p className="text-gray-500 mt-6 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;