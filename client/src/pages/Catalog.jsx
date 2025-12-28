import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Grid, 
  List, 
  ChevronDown, 
  ChevronUp,
  SlidersHorizontal,
  X,
  Loader2
} from 'lucide-react';
import BookCard from '../components/BookCard';
import { useBookStore } from '../components/BookstoreContext'; // Updated import

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    books,
    categories,
    filters,
    isLoading,
    error,
    updateFilters,
    resetFilters,
    fetchBooks
  } = useBookStore();
  
  // Initialize local filters from URL or context
  const [localFilters, setLocalFilters] = useState({
    category: searchParams.get('category') || filters.category || null,
    searchQuery: searchParams.get('searchQuery') || filters.searchQuery || '',
    sortBy: searchParams.get('sortBy') || filters.sortBy || 'title',
    priceRange: searchParams.get('priceRange') 
      ? searchParams.get('priceRange').split(',').map(Number) 
      : filters.priceRange || [0, 100],
    format: searchParams.get('format') || filters.format || 'all'
  });

  // Sync URL with filters
  const updateURLParams = (filters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, value.toString());
        }
      }
    });
    
    setSearchParams(params);
  };

  // Filter books based on localFilters
  const getFilteredBooks = () => {
    let filtered = [...books];
    
    // Apply category filter
    if (localFilters.category) {
      filtered = filtered.filter(book => 
        book.categories?.some(cat => cat.id === localFilters.category)
      );
    }
    
    // Apply search filter
    if (localFilters.searchQuery) {
      const query = localFilters.searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        (book.description && book.description.toLowerCase().includes(query))
      );
    }
    
    // Apply format filter
    if (localFilters.format !== 'all') {
      filtered = filtered.filter(book => book.format === localFilters.format);
    }
    
    // Apply price filter
    filtered = filtered.filter(book => {
      const price = book.sale_price || book.list_price || 0;
      return price >= localFilters.priceRange[0] && price <= localFilters.priceRange[1];
    });
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (localFilters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'price_low':
          return (a.sale_price || a.list_price) - (b.sale_price || b.list_price);
        case 'price_high':
          return (b.sale_price || b.list_price) - (a.sale_price || a.list_price);
        case 'newest':
          return new Date(b.publication_date) - new Date(a.publication_date);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  // Handle filter changes
  const handleCategoryChange = (categoryId) => {
    const newCategory = localFilters.category === categoryId ? null : categoryId;
    const newFilters = { ...localFilters, category: newCategory };
    setLocalFilters(newFilters);
    updateFilters({ category: newCategory });
    updateURLParams(newFilters);
  };

  const handlePriceChange = (min, max) => {
    const newFilters = { ...localFilters, priceRange: [min, max] };
    setLocalFilters(newFilters);
    updateFilters({ priceRange: [min, max] });
    updateURLParams(newFilters);
  };

  const handleSortChange = (sortBy) => {
    const newFilters = { ...localFilters, sortBy };
    setLocalFilters(newFilters);
    updateFilters({ sortBy });
    updateURLParams(newFilters);
  };

  const handleFormatChange = (format) => {
    const newFilters = { ...localFilters, format };
    setLocalFilters(newFilters);
    updateFilters({ format });
    updateURLParams(newFilters);
  };

  const handleSearch = (searchQuery) => {
    const newFilters = { ...localFilters, searchQuery };
    setLocalFilters(newFilters);
    updateFilters({ searchQuery });
    updateURLParams(newFilters);
  };

  const resetAllFilters = () => {
    const defaultFilters = {
      category: null,
      searchQuery: '',
      sortBy: 'title',
      priceRange: [0, 100],
      format: 'all'
    };
    
    setLocalFilters(defaultFilters);
    resetFilters();
    setSearchParams(new URLSearchParams());
  };

  // Get filtered books
  const filteredBooks = getFilteredBooks();
  
  // Pagination logic
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [localFilters.category, localFilters.searchQuery, localFilters.priceRange, localFilters.format]);

  // Loading state
  if (isLoading && !books.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error && !books.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 text-red-300">
            <SlidersHorizontal size={96} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Error loading books</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchBooks()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Book Catalog</h1>
          <p className="text-blue-100 max-w-2xl">
            Discover {filteredBooks.length} books in our collection. Filter by category, price, or format to find your perfect read.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 shrink-0">
            {}
            <FilterSidebar
              categories={categories.categories}
              activeFilters={localFilters}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              onFormatChange={handleFormatChange}
              onReset={resetAllFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Top Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                
                {/* Results Count */}
                <div className="text-gray-600">
                  Showing <span className="font-semibold">
                    {Math.min(startIndex + 1, filteredBooks.length)}-
                    {Math.min(startIndex + itemsPerPage, filteredBooks.length)}
                  </span> of{' '}
                  <span className="font-semibold">{filteredBooks.length}</span> books
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
                      value={localFilters.sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="title">Title A-Z</option>
                      <option value="author">Author A-Z</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="newest">Newest Arrivals</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
              
              {/* Search Input */}
              <div className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search books by title, author, or description..."
                    value={localFilters.searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {localFilters.searchQuery && (
                    <button
                      onClick={() => handleSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Active Filters */}
              {(localFilters.category || 
                localFilters.searchQuery || 
                localFilters.format !== 'all' ||
                localFilters.priceRange[0] > 0 || 
                localFilters.priceRange[1] < 100) && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    
                    {localFilters.category && (
                      <button
                        onClick={() => handleCategoryChange(localFilters.category)}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm hover:bg-blue-200 transition-colors"
                      >
                        {/* Fixed: Get category name from categories array */}
                        {(() => {
                          // Find the category object
                          {categories}
                          const categoryObj = categories?.find(c => {
                            // Handle both string and number IDs
                            return c.id == localFilters.category || c.id === localFilters.category;
                          });
                          return categoryObj?.name || 'Category';
                        })()}
                        <X size={14} className="ml-2" />
                      </button>
                    )}
                    
                    {localFilters.format !== 'all' && (
                      <button
                        onClick={() => handleFormatChange('all')}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm hover:bg-purple-200 transition-colors"
                      >
                        {localFilters.format}
                        <X size={14} className="ml-2" />
                      </button>
                    )}
                    
                    {(localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 100) && (
                      <button
                        onClick={() => handlePriceChange(0, 100)}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm hover:bg-green-200 transition-colors"
                      >
                        ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                        <X size={14} className="ml-2" />
                      </button>
                    )}
                    
                    {localFilters.searchQuery && (
                      <button
                        onClick={() => handleSearch('')}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm hover:bg-yellow-200 transition-colors"
                      >
                        Search: {localFilters.searchQuery}
                        <X size={14} className="ml-2" />
                      </button>
                    )}
                    
                    <button
                      onClick={resetAllFilters}
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
                    categories={categories.categories}
                    activeFilters={localFilters}
                    onCategoryChange={handleCategoryChange}
                    onPriceChange={handlePriceChange}
                    onFormatChange={handleFormatChange}
                    onReset={resetAllFilters}
                  />
                </div>
              </div>
            )}

            {/* Books Grid/List */}
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                <p className="mt-2 text-gray-600">Filtering books...</p>
              </div>
            ) : paginatedBooks.length > 0 ? (
              <>
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "space-y-4"
                }>
                  {paginatedBooks.map((book) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
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
                  onClick={resetAllFilters}
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
  onFormatChange,
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
        <div className="space-y-2 max-h-60 overflow-y-auto">
          
          {categories?.map(category => (
            <label key={category.id} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={activeFilters.category === category.id}
                onChange={() => onCategoryChange(category.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                {category.name}
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
          <div className="relative h-2 bg-gray-200 rounded-lg">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={activeFilters.priceRange[0]}
              onChange={(e) => onPriceChange(Number(e.target.value), activeFilters.priceRange[1])}
              className="absolute w-full h-2 bg-transparent appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={activeFilters.priceRange[1]}
              onChange={(e) => onPriceChange(activeFilters.priceRange[0], Number(e.target.value))}
              className="absolute w-full h-2 bg-transparent appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Format */}
      <div>
        <h3 className="font-semibold mb-4">Format</h3>
        <div className="space-y-2">
          {['all', 'Paperback', 'Hardcover', 'eBook'].map(format => (
            <label key={format} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="format"
                checked={activeFilters.format === format}
                onChange={() => onFormatChange(format)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors capitalize">
                {format === 'all' ? 'All Formats' : format}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// Pagination Component (keep this as is, no changes needed)
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

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
    </div>
  );
};

export default Catalog;