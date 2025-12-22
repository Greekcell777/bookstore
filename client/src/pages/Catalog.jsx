import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Filter, 
  Grid, 
  List, 
  ChevronDown, 
  ChevronUp,
  Star,
  SlidersHorizontal,
  X
} from 'lucide-react';
import BookCard from '../components/BookCard';

const Catalog = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity');
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    priceRange: [0, 100],
    rating: null,
    availability: 'all'
  });

  // Mock data - books
  const books = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Book Title ${i + 1}`,
    author: `Author ${String.fromCharCode(65 + (i % 26))}`,
    price: 9.99 + (i % 10) * 5,
    rating: 3 + Math.random() * 2,
    reviews: Math.floor(Math.random() * 1000),
    image: `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&ixid=${i}`,
    category: ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 'Romance'][i % 5],
    inStock: Math.random() > 0.1,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  }));

  // Mock data - categories
  const categories = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery & Thriller',
    'Romance', 'Biography', 'Self-Help', 'Children\'s Books',
    'Academic', 'Technology', 'Fantasy', 'Historical'
  ];

  // Pagination settings
  const itemsPerPage = 12;
  const totalPages = Math.ceil(books.length / itemsPerPage);
  
  // Calculate paginated books
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = books.slice(startIndex, startIndex + itemsPerPage);

  // Filter logic
  const filteredBooks = paginatedBooks.filter(book => {
    // Category filter
    if (activeFilters.categories.length > 0 && 
        !activeFilters.categories.includes(book.category)) {
      return false;
    }
    
    // Price filter
    if (book.price < activeFilters.priceRange[0] || 
        book.price > activeFilters.priceRange[1]) {
      return false;
    }
    
    // Rating filter
    if (activeFilters.rating && book.rating < activeFilters.rating) {
      return false;
    }
    
    // Availability filter
    if (activeFilters.availability === 'in-stock' && !book.inStock) {
      return false;
    }
    
    if (activeFilters.availability === 'out-of-stock' && book.inStock) {
      return false;
    }
    
    return true;
  });

  // Handle filter changes
  const handleCategoryChange = (category) => {
    setActiveFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return { ...prev, categories: newCategories };
    });
  };

  const handlePriceChange = (min, max) => {
    setActiveFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  const handleRatingChange = (rating) => {
    setActiveFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? null : rating
    }));
  };

  const handleAvailabilityChange = (availability) => {
    setActiveFilters(prev => ({
      ...prev,
      availability
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setActiveFilters({
      categories: [],
      priceRange: [0, 100],
      rating: null,
      availability: 'all'
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = end - maxVisible + 1;
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (start > 1) pages.unshift('...');
      if (end < totalPages) pages.push('...');
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Book Catalog</h1>
          <p className="text-blue-100 max-w-2xl">
            Discover {books.length} books in our collection. Filter by category, price, or rating to find your perfect read.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              categories={categories}
              activeFilters={activeFilters}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              onRatingChange={handleRatingChange}
              onAvailabilityChange={handleAvailabilityChange}
              onReset={resetFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Top Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                
                {/* Results Count */}
                <div className="text-gray-600">
                  Showing <span className="font-semibold">{filteredBooks.length}</span> of{' '}
                  <span className="font-semibold">{books.length}</span> books
                </div>
                
                {/* View Controls */}
                <div className="flex items-center space-x-4">
                  
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter size={18} />
                    <span>Filters</span>
                    {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  
                  {/* View Toggle */}
                  <div className="flex items-center space-x-2 border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="popularity">Sort by Popularity</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest Arrivals</option>
                      <option value="title">Title A-Z</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
              
              {/* Active Filters */}
              {Object.values(activeFilters).some(filter => 
                Array.isArray(filter) ? filter.length > 0 : 
                typeof filter === 'number' ? filter !== null : 
                filter !== 'all'
              ) && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    
                    {activeFilters.categories.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm hover:bg-blue-200 transition-colors"
                      >
                        {category}
                        <X size={14} className="ml-2" />
                      </button>
                    ))}
                    
                    {activeFilters.rating && (
                      <button
                        onClick={() => handleRatingChange(activeFilters.rating)}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm hover:bg-yellow-200 transition-colors"
                      >
                        {activeFilters.rating}+ Stars
                        <X size={14} className="ml-2" />
                      </button>
                    )}
                    
                    {activeFilters.availability !== 'all' && (
                      <button
                        onClick={() => handleAvailabilityChange('all')}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm hover:bg-green-200 transition-colors"
                      >
                        {activeFilters.availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                        <X size={14} className="ml-2" />
                      </button>
                    )}
                    
                    <button
                      onClick={resetFilters}
                      className="ml-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Filters Overlay */}
            {showFilters && (
              <div className="lg:hidden mb-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <FilterSidebar
                    categories={categories}
                    activeFilters={activeFilters}
                    onCategoryChange={handleCategoryChange}
                    onPriceChange={handlePriceChange}
                    onRatingChange={handleRatingChange}
                    onAvailabilityChange={handleAvailabilityChange}
                    onReset={resetFilters}
                  />
                </div>
              </div>
            )}

            {/* Books Grid/List */}
            {filteredBooks.length > 0 ? (
              <>
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "space-y-4"
                }>
                  {filteredBooks.map((book) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  getPageNumbers={getPageNumbers}
                />
              </>
            ) : (
              // Empty State
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                  <SlidersHorizontal size={96} />
                </div>
                <h3 className="text-xl font-semibold mb-2">No books found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Sidebar Component
const FilterSidebar = ({
  categories,
  activeFilters,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onAvailabilityChange,
  onReset
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset all
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={activeFilters.categories.includes(category)}
                onChange={() => onCategoryChange(category)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>${activeFilters.priceRange[0]}</span>
            <span>${activeFilters.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={activeFilters.priceRange[0]}
            onChange={(e) => onPriceChange(Number(e.target.value), activeFilters.priceRange[1])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={activeFilters.priceRange[1]}
            onChange={(e) => onPriceChange(activeFilters.priceRange[0], Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => onRatingChange(rating)}
              className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                activeFilters.rating === rating 
                  ? 'bg-yellow-50 border border-yellow-200' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-300 text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-3 text-sm">
                {rating}+ stars
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold mb-4">Availability</h3>
        <div className="space-y-2">
          {['all', 'in-stock', 'out-of-stock'].map(option => (
            <label key={option} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="availability"
                checked={activeFilters.availability === option}
                onChange={() => onAvailabilityChange(option)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors capitalize">
                {option === 'all' ? 'All Books' : 
                 option === 'in-stock' ? 'In Stock Only' : 'Out of Stock'}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, getPageNumbers }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-600">
        Page <span className="font-semibold">{currentPage}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>
      </div>
      
      <nav className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronDown className="transform rotate-90" size={16} />
        </button>
        
        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg border transition-all duration-200 ${
                currentPage === page
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronDown className="transform -rotate-90" size={16} />
        </button>
      </nav>
      
      {/* Go to Page */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Go to:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = Math.min(Math.max(1, parseInt(e.target.value) || 1), totalPages);
            onPageChange(page);
          }}
          className="w-16 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default Catalog;