import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid, List, Filter, BookOpen, ChevronRight, TrendingUp, Star, Clock } from 'lucide-react';

const Categories = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Mock categories with images
  const categories = [
    {
      id: 1,
      name: 'Fiction',
      bookCount: 2450,
      description: 'Novels, short stories, and literary fiction',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
      color: 'from-blue-500 to-purple-600',
      popularBooks: ['The Midnight Library', 'Klara and the Sun', 'Project Hail Mary'],
      trending: true
    },
    {
      id: 2,
      name: 'Science Fiction',
      bookCount: 1200,
      description: 'Futuristic technology, space exploration, aliens',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop',
      color: 'from-indigo-500 to-blue-600',
      popularBooks: ['Dune', 'Neuromancer', 'The Three-Body Problem'],
      trending: true
    },
    {
      id: 3,
      name: 'Mystery & Thriller',
      bookCount: 980,
      description: 'Suspense, crime, detective stories',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
      color: 'from-gray-700 to-gray-900',
      popularBooks: ['The Silent Patient', 'Gone Girl', 'The Girl with the Dragon Tattoo']
    },
    {
      id: 4,
      name: 'Biography',
      bookCount: 850,
      description: 'Real-life stories and memoirs',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
      color: 'from-amber-500 to-orange-600',
      popularBooks: ['Becoming', 'Educated', 'Steve Jobs']
    },
    {
      id: 5,
      name: 'Self-Help',
      bookCount: 1100,
      description: 'Personal development and psychology',
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&h=400&fit=crop',
      color: 'from-emerald-500 to-teal-600',
      popularBooks: ['Atomic Habits', 'The Subtle Art', 'Thinking Fast and Slow']
    },
    {
      id: 6,
      name: 'Romance',
      bookCount: 1800,
      description: 'Love stories and relationship dramas',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&h=400&fit=crop',
      color: 'from-pink-500 to-rose-600',
      popularBooks: ['The Love Hypothesis', 'Red, White & Royal Blue', 'Beach Read']
    },
    {
      id: 7,
      name: 'Fantasy',
      bookCount: 1350,
      description: 'Magic, mythical creatures, epic quests',
      image: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=600&h=400&fit=crop',
      color: 'from-purple-500 to-violet-600',
      popularBooks: ['The Hobbit', 'Game of Thrones', 'Harry Potter']
    },
    {
      id: 8,
      name: 'Technology',
      bookCount: 750,
      description: 'Programming, AI, and tech innovation',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
      color: 'from-cyan-500 to-blue-600',
      popularBooks: ['Clean Code', 'The Pragmatic Programmer', 'AI Superpowers']
    },
    {
      id: 9,
      name: 'History',
      bookCount: 920,
      description: 'Historical events and analysis',
      image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&h=400&fit=crop',
      color: 'from-amber-700 to-yellow-600',
      popularBooks: ['Sapiens', 'The Guns of August', 'A People\'s History']
    },
    {
      id: 10,
      name: 'Poetry',
      bookCount: 620,
      description: 'Verse, sonnets, and poetic works',
      image: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?w=600&h=400&fit=crop',
      color: 'from-fuchsia-500 to-pink-600',
      popularBooks: ['Milk and Honey', 'The Sun and Her Flowers', 'Leaves of Grass']
    },
    {
      id: 11,
      name: 'Children\'s Books',
      bookCount: 2100,
      description: 'Books for young readers',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
      color: 'from-green-500 to-emerald-600',
      popularBooks: ['Where the Wild Things Are', 'Goodnight Moon', 'The Very Hungry Caterpillar']
    },
    {
      id: 12,
      name: 'Business',
      bookCount: 880,
      description: 'Economics, entrepreneurship, management',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
      color: 'from-blue-700 to-blue-800',
      popularBooks: ['The Lean Startup', 'Good to Great', 'Thinking in Bets']
    }
  ];

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.bookCount - a.bookCount;
      case 'books':
        return b.bookCount - a.bookCount;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Browse Categories</h1>
          <p className="text-blue-100 max-w-2xl text-lg">
            Explore our collection organized by genre. Find your next favorite book from {categories.reduce((sum, cat) => sum + cat.bookCount, 0).toLocaleString()} titles.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search */}
            <div className="w-full md:w-auto md:flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-4">
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

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="books">Most Books</option>
                  <option value="name">Alphabetical</option>
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{categories.length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">
                  {categories.reduce((sum, cat) => sum + cat.bookCount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Books</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-700">
                  {categories.filter(cat => cat.trending).length}
                </div>
                <div className="text-sm text-gray-600">Trending Now</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-700">
                  {Math.max(...categories.map(cat => cat.bookCount)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Largest Category</div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCategories.map((category) => (
              <Link
                key={category.id}
                to={`/catalog?category=${encodeURIComponent(category.name)}`}
                className="group block"
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-linear-to-br ${category.color} opacity-90`} />
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {category.trending && (
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          <TrendingUp size={14} className="mr-1" />
                          Trending
                        </div>
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                      <p className="text-gray-200 text-sm">{category.description}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <BookOpen size={18} className="text-gray-400 mr-2" />
                        <span className="font-semibold">{category.bookCount.toLocaleString()} books</span>
                      </div>
                      <ChevronRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Popular Books */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">Popular in this category:</h4>
                      <div className="space-y-1">
                        {category.popularBooks.slice(0, 2).map((book, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <Star size={12} className="text-yellow-400 mr-2 fill-current" />
                            <span className="text-gray-700 truncate">{book}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {sortedCategories.map((category) => (
              <Link
                key={category.id}
                to={`/catalog?category=${encodeURIComponent(category.name)}`}
                className="block"
              >
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 group hover:bg-blue-50/30">
                  <div className="flex items-start">
                    {/* Image */}
                    <div className="w-24 h-32 rounded-lg overflow-hidden shrink-0 mr-6">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 mt-1">{category.description}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          {category.trending && (
                            <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                              <TrendingUp size={14} className="mr-1" />
                              Trending
                            </div>
                          )}
                          <ChevronRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 mt-4">
                        <div className="flex items-center">
                          <BookOpen size={16} className="text-gray-400 mr-2" />
                          <span className="font-semibold">{category.bookCount.toLocaleString()} books</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-3">Popular:</span>
                            <div className="flex space-x-2">
                              {category.popularBooks.slice(0, 3).map((book, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 rounded-lg">
                                  {book}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {sortedCategories.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <Filter size={96} />
            </div>
            <h3 className="text-xl font-semibold mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search term
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;