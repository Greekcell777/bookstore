import React, { useState } from 'react';
import { 
  Search, Plus, Edit, Trash2, Eye, MoreVertical, 
  Tag, Package, Filter, X, Check, ChevronDown,
  ArrowUpDown, RefreshCw, AlertCircle
} from 'lucide-react';
import CategoryModal from './CategoryModal';

const CategoriesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample categories data
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Mystery & Thriller',
      slug: 'mystery-thriller',
      description: 'Suspenseful stories with mysterious plots',
      booksCount: 234,
      status: 'active',
      icon: '🔍',
      color: '#8B5CF6',
      parentId: null,
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      name: 'Science Fiction',
      slug: 'science-fiction',
      description: 'Futuristic and speculative fiction',
      booksCount: 189,
      status: 'active',
      icon: '🚀',
      color: '#3B82F6',
      parentId: null,
      createdAt: '2023-02-10'
    },
    {
      id: 3,
      name: 'Self-Help',
      slug: 'self-help',
      description: 'Personal development and improvement',
      booksCount: 156,
      status: 'active',
      icon: '💪',
      color: '#10B981',
      parentId: null,
      createdAt: '2023-03-05'
    },
    {
      id: 4,
      name: 'Fiction',
      slug: 'fiction',
      description: 'General fiction and literary works',
      booksCount: 432,
      status: 'active',
      icon: '📚',
      color: '#F59E0B',
      parentId: null,
      createdAt: '2023-01-20'
    },
    {
      id: 5,
      name: 'Fantasy',
      slug: 'fantasy',
      description: 'Magical and supernatural elements',
      booksCount: 278,
      status: 'active',
      icon: '✨',
      color: '#EC4899',
      parentId: null,
      createdAt: '2023-02-15'
    },
    {
      id: 6,
      name: 'Biography',
      slug: 'biography',
      description: 'Real-life stories and memoirs',
      booksCount: 145,
      status: 'active',
      icon: '👤',
      color: '#6366F1',
      parentId: null,
      createdAt: '2023-03-12'
    },
    {
      id: 7,
      name: 'Business',
      slug: 'business',
      description: 'Entrepreneurship and management',
      booksCount: 98,
      status: 'active',
      icon: '💼',
      color: '#059669',
      parentId: null,
      createdAt: '2023-04-01'
    },
    {
      id: 8,
      name: 'Technology',
      slug: 'technology',
      description: 'Tech and programming books',
      booksCount: 67,
      status: 'inactive',
      icon: '💻',
      color: '#2563EB',
      parentId: null,
      createdAt: '2023-04-20'
    },
    {
      id: 9,
      name: 'Children',
      slug: 'children',
      description: 'Books for young readers',
      booksCount: 312,
      status: 'active',
      icon: '👶',
      color: '#F97316',
      parentId: null,
      createdAt: '2023-05-10'
    },
    {
      id: 10,
      name: 'Romance',
      slug: 'romance',
      description: 'Love and relationship stories',
      booksCount: 189,
      status: 'active',
      icon: '❤️',
      color: '#DC2626',
      parentId: null,
      createdAt: '2023-05-25'
    }
  ]);

  const filterOptions = [
    { id: 'all', label: 'All Categories', count: categories.length },
    { id: 'active', label: 'Active', count: categories.filter(c => c.status === 'active').length },
    { id: 'inactive', label: 'Inactive', count: categories.filter(c => c.status === 'inactive').length },
    { id: 'popular', label: 'Popular', count: categories.filter(c => c.booksCount > 200).length }
  ];

  // Modal handlers
  const handleOpenModal = (mode, category = null) => {
    setModalMode(mode);
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = (categoryData) => {
    if (modalMode === 'add') {
      // Add new category
      const newCategory = {
        ...categoryData,
        id: categories.length + 1,
        booksCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCategories([...categories, newCategory]);
    } else if (modalMode === 'edit' && selectedCategory) {
      // Update existing category
      setCategories(categories.map(category => 
        category.id === selectedCategory.id ? { ...categoryData, id: category.id } : category
      ));
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(category => category.id !== id));
      setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCategories(categories.map(category => category.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedCategories.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedCategories.length} selected category(s)?`)) {
      setCategories(categories.filter(category => !selectedCategories.includes(category.id)));
      setSelectedCategories([]);
    }
  };

  const handleToggleStatus = (id) => {
    setCategories(categories.map(category => 
      category.id === id 
        ? { ...category, status: category.status === 'active' ? 'inactive' : 'active' }
        : category
    ));
  };

  // Filter categories based on active filter and search term
  const filteredCategories = categories.filter(category => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'active' && category.status === 'active') ||
      (activeFilter === 'inactive' && category.status === 'inactive') ||
      (activeFilter === 'popular' && category.booksCount > 200);
    
    const matchesSearch = searchTerm === '' || 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate statistics
  const totalBooks = categories.reduce((sum, cat) => sum + cat.booksCount, 0);
  const activeCategories = categories.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage book categories and genres</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center">
            <RefreshCw size={20} className="mr-2" />
            Refresh
          </button>
          <button 
            onClick={() => handleOpenModal('add')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Tag size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900">{activeCategories}</p>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Check size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">{totalBooks}</p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Package size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select 
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                {filterOptions.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.label} ({filter.count})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowUpDown size={20} className="text-gray-400" />
              <select className="border rounded-lg px-3 py-2">
                <option>Sort by: Name</option>
                <option>Sort by: Books Count</option>
                <option>Sort by: Date Added</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCategories.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-blue-700 font-medium">
              {selectedCategories.length} category{selectedCategories.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Activate Selected
            </button>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Deactivate Selected
            </button>
            <button 
              onClick={handleDeleteSelected}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-3"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <span style={{ color: category.color }}>{category.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.slug}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleOpenModal('view', category)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => handleOpenModal('edit', category)}
                    className="p-1 text-gray-400 hover:text-green-600 transition"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Package size={16} className="text-gray-400 mr-2" />
                  <span className="font-medium text-gray-900">{category.booksCount}</span>
                  <span className="text-sm text-gray-500 ml-1">books</span>
                </div>
                <button
                  onClick={() => handleToggleStatus(category.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(category.status)}`}
                >
                  {category.status === 'active' ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                <span>Created: {formatDate(category.createdAt)}</span>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleSelectCategory(category.id)}
                  className="rounded border-gray-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? `No categories match "${searchTerm}"`
              : 'Get started by adding your first category'
            }
          </p>
          <button 
            onClick={() => handleOpenModal('add')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} className="inline mr-2" />
            Add Category
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredCategories.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCategories.length}</span> of{' '}
            <span className="font-medium">{categories.length}</span> categories
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        initialData={selectedCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default CategoriesManagement;