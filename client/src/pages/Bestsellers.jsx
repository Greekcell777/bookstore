import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Star, 
  Award, 
  Clock, 
  Filter,
  ChevronDown,
  Sparkles,
  TrendingDown,
  Crown,
  Zap,
  Calendar,
  RefreshCw
} from 'lucide-react';

const Bestsellers = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rank');

  // Mock bestsellers data
  const bestsellers = [
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      price: 27.99,
      rating: 4.8,
      reviews: 28945,
      rank: 1,
      lastWeek: 2,
      weeksOnList: 156,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop",
      category: "Self-Help"
    },
    {
      id: 2,
      title: "The Midnight Library",
      author: "Matt Haig",
      price: 24.99,
      rating: 4.5,
      reviews: 24578,
      rank: 2,
      lastWeek: 1,
      weeksOnList: 120,
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop",
      category: "Fiction"
    },
    {
      id: 3,
      title: "Project Hail Mary",
      author: "Andy Weir",
      price: 29.99,
      rating: 4.7,
      reviews: 18923,
      rank: 3,
      lastWeek: 3,
      weeksOnList: 95,
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop",
      category: "Science Fiction"
    },
    {
      id: 4,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      price: 26.99,
      rating: 4.3,
      reviews: 16789,
      rank: 4,
      lastWeek: 4,
      weeksOnList: 85,
      image: "https://images.unsplash.com/photo-1531346688376-ab6275c4725e?w=300&h=450&fit=crop",
      category: "Fiction"
    },
    {
      id: 5,
      title: "The Four Winds",
      author: "Kristin Hannah",
      price: 23.99,
      rating: 4.6,
      reviews: 19876,
      rank: 5,
      lastWeek: 6,
      weeksOnList: 72,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop",
      category: "Historical Fiction"
    },
    {
      id: 6,
      title: "The Code Breaker",
      author: "Walter Isaacson",
      price: 32.99,
      rating: 4.4,
      reviews: 12345,
      rank: 6,
      lastWeek: 5,
      weeksOnList: 60,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
      category: "Biography"
    },
    {
      id: 7,
      title: "The Push",
      author: "Ashley Audrain",
      price: 25.99,
      rating: 4.2,
      reviews: 9876,
      rank: 7,
      lastWeek: 8,
      weeksOnList: 48,
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
      category: "Thriller"
    },
    {
      id: 8,
      title: "The Sanatorium",
      author: "Sarah Pearse",
      price: 24.99,
      rating: 4.0,
      reviews: 8765,
      rank: 8,
      lastWeek: 7,
      weeksOnList: 42,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
      category: "Mystery"
    },
    {
      id: 9,
      title: "The Hill We Climb",
      author: "Amanda Gorman",
      price: 19.99,
      rating: 4.9,
      reviews: 23456,
      rank: 9,
      lastWeek: 10,
      weeksOnList: 36,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
      category: "Poetry"
    },
    {
      id: 10,
      title: "Think Again",
      author: "Adam Grant",
      price: 28.99,
      rating: 4.5,
      reviews: 15678,
      rank: 10,
      lastWeek: 9,
      weeksOnList: 30,
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop",
      category: "Psychology"
    }
  ];

  // Categories for filtering
  const categories = [
    'all', 'fiction', 'non-fiction', 'science fiction', 'mystery', 
    'biography', 'self-help', 'romance', 'history', 'poetry'
  ];

  // Timeframe options
  const timeframeOptions = [
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'yearly', label: 'This Year' },
    { value: 'all-time', label: 'All Time' }
  ];

  // Calculate rank change indicator
  const getRankChange = (rank, lastWeek) => {
    if (lastWeek === 0) return 'new';
    const change = lastWeek - rank;
    if (change > 0) return { direction: 'up', value: change };
    if (change < 0) return { direction: 'down', value: Math.abs(change) };
    return { direction: 'same', value: 0 };
  };

  // Filter bestsellers based on category
  const filteredBestsellers = bestsellers.filter(book => 
    activeCategory === 'all' || 
    book.category.toLowerCase() === activeCategory.toLowerCase() ||
    book.category.toLowerCase().includes(activeCategory.toLowerCase())
  );

  // Sort bestsellers
  const sortedBestsellers = [...filteredBestsellers].sort((a, b) => {
    if (sortBy === 'rank') return a.rank - b.rank;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviews - a.reviews;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return a.rank - b.rank;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center mb-4">
                <Crown size={32} className="text-yellow-400 mr-3" />
                <h1 className="text-4xl font-bold">Bestsellers</h1>
              </div>
              <p className="text-blue-100 max-w-2xl">
                Discover the books everyone is talking about. Updated weekly based on actual sales data.
              </p>
            </div>
            
            {/* Timeframe Selector */}
            <div className="flex items-center space-x-4">
              <Calendar className="text-blue-200" size={24} />
              <div className="flex space-x-2">
                {timeframeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeframe(option.value)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      timeframe === option.value
                        ? 'bg-white text-blue-600 font-semibold'
                        : 'text-blue-200 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{bestsellers.length}</div>
              <div className="text-sm text-gray-600">Bestselling Titles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {Math.max(...bestsellers.map(b => b.weeksOnList))}
              </div>
              <div className="text-sm text-gray-600">Most Weeks on List</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {Math.max(...bestsellers.map(b => b.reviews)).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Most Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">4.6</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="font-semibold text-lg mb-6 flex items-center">
                <Filter className="mr-2" size={20} />
                Filter & Sort
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeCategory === 'all'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.slice(1).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${
                        activeCategory === category
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="capitalize">{category}</span>
                      <span className="text-sm text-gray-500">
                        {bestsellers.filter(b => 
                          b.category.toLowerCase() === category.toLowerCase() ||
                          b.category.toLowerCase().includes(category.toLowerCase())
                        ).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: 'rank', label: 'Rank (Highest First)' },
                    { value: 'rating', label: 'Rating (Highest First)' },
                    { value: 'reviews', label: 'Reviews (Most First)' },
                    { value: 'price-low', label: 'Price (Low to High)' },
                    { value: 'price-high', label: 'Price (High to Low)' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                        sortBy === option.value
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {option.value === 'rank' && <TrendingUp size={16} className="mr-2" />}
                      {option.value === 'rating' && <Star size={16} className="mr-2" />}
                      {option.value === 'reviews' && <Sparkles size={16} className="mr-2" />}
                      {option.value.includes('price') && <Award size={16} className="mr-2" />}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Last Updated */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2" />
                  <span>Updated: Today, 9:00 AM</span>
                </div>
                <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center">
                  <RefreshCw size={14} className="mr-1" />
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Bestsellers List */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {activeCategory === 'all' ? 'All Bestsellers' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Showing {filteredBestsellers.length} of {bestsellers.length} titles
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Timeframe:</span>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {timeframeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Bestsellers List */}
            <div className="space-y-4">
              {sortedBestsellers.map((book) => {
                const rankChange = getRankChange(book.rank, book.lastWeek);
                
                return (
                  <Link
                    key={book.id}
                    to={`/book/${book.id}`}
                    className="block group"
                  >
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-start">
                        {/* Rank Badge */}
                        <div className="shrink-0 mr-6">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            book.rank <= 3 
                              ? 'bg-linear-to-br from-yellow-400 to-orange-500 text-white' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            <span className="text-xl font-bold">#{book.rank}</span>
                          </div>
                          
                          {/* Rank Change Indicator */}
                          <div className="mt-2 text-center">
                            {rankChange === 'new' ? (
                              <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                NEW
                              </div>
                            ) : rankChange.direction === 'up' ? (
                              <div className="flex items-center justify-center text-green-600">
                                <TrendingUp size={12} className="mr-1" />
                                <span className="text-xs font-medium">+{rankChange.value}</span>
                              </div>
                            ) : rankChange.direction === 'down' ? (
                              <div className="flex items-center justify-center text-red-600">
                                <TrendingDown size={12} className="mr-1" />
                                <span className="text-xs font-medium">-{rankChange.value}</span>
                              </div>
                            ) : (
                              <div className="text-xs text-gray-500">-</div>
                            )}
                          </div>
                        </div>

                        {/* Book Image */}
                        <div className="w-16 h-24 rounded-lg overflow-hidden mr-6 shrink-0">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Book Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {book.title}
                              </h3>
                              <p className="text-gray-600 mb-2">{book.author}</p>
                              
                              <div className="flex items-center flex-wrap gap-4">
                                {/* Rating */}
                                <div className="flex items-center">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < Math.floor(book.rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : i < book.rating
                                            ? 'fill-yellow-300 text-yellow-300'
                                            : 'fill-gray-300 text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="ml-2 text-sm font-medium">
                                    {book.rating.toFixed(1)}
                                  </span>
                                  <span className="ml-2 text-sm text-gray-500">
                                    ({book.reviews.toLocaleString()})
                                  </span>
                                </div>
                                
                                {/* Category */}
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  {book.category}
                                </span>
                                
                                {/* Weeks on List */}
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock size={14} className="mr-1" />
                                  <span>{book.weeksOnList} weeks</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Price */}
                            <div className="mt-4 md:mt-0 md:text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                ${book.price.toFixed(2)}
                              </div>
                              <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Empty State */}
            {sortedBestsellers.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                  <Crown size={96} />
                </div>
                <h3 className="text-xl font-semibold mb-2">No bestsellers found</h3>
                <p className="text-gray-600 mb-6">
                  Try selecting a different category
                </p>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Categories
                </button>
              </div>
            )}

            {/* Additional Info */}
            <div className="mt-12 p-6 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How we rank our bestsellers
                  </h3>
                  <p className="text-gray-600">
                    Rankings are based on actual sales data from the past {timeframe === 'weekly' ? '7 days' : timeframe === 'monthly' ? '30 days' : timeframe === 'yearly' ? '365 days' : 'all time'}. 
                    Updated weekly to reflect current trends.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <Zap className="text-yellow-500" size={20} />
                  <span className="text-sm text-gray-700">Real-time sales data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bestsellers;