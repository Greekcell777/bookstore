import React, { useState, useEffect } from 'react';
import { 
  X, BookOpen, User, Hash, Tag, DollarSign, Package, 
  Upload, Image, Star, Calendar, Globe, FileText, 
  Save, Plus, Eye, AlertCircle, Check, ChevronDown, 
  TrendingUp
} from 'lucide-react';

const BookModal = ({ isOpen, onClose, mode = 'view', initialData = null, onSave }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn_10: '',
    isbn_13: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    pages: '',
    language: '',
    publisher: '',
    publicationDate: '',
    description: '',
    shortDescription: '',
    rating: '4.5',
    reviewsCount: '1245',
    weight: '',
    dimensions: '',
    tags: [],
    status: 'draft',
    featured: false,
    bestseller: false,
    newRelease: false
  });

  const [selectedImage, setSelectedImage] = useState(null);

  // Categories and Authors (in real app, these would come from API)
  const categories = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery & Thriller',
    'Romance', 'Fantasy', 'Biography', 'Self-Help', 'Business',
    'History', 'Science', 'Technology', 'Children', 'Young Adult'
  ];

  const authors = [
    'Alex Michaelides', 'James Clear', 'Andy Weir', 'Matt Haig',
    'Frank Herbert', 'J.R.R. Tolkien', 'Tara Westover', 'Yuval Noah Harari',
    'Stephen King', 'Margaret Atwood', 'George R.R. Martin'
  ];

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    } else {
      // Reset form for new book
      setFormData({
        title: '',
        author: '',
        isbn_10: '',
        isbn_13: '',
        category: '',
        price: '',
        discountPrice: '',
        stock: '',
        pages: '',
        language: '',
        publisher: '',
        publicationDate: '',
        description: '',
        shortDescription: '',
        rating: '4.5',
        reviewsCount: '1245',
        weight: '',
        dimensions: '',
        tags: [],
        status: 'draft',
        featured: false,
        bestseller: false,
        newRelease: false
      });
      setImagePreview('');
      setSelectedImage(null);
    }
  }, [initialData, mode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  console.log(formData)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Prepare data
      const bookData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        discountPrice: parseFloat(formData.discountPrice) || 0,
        stock: parseInt(formData.stock) || 0,
        pages: parseInt(formData.pages) || 0,
        rating: parseFloat(formData.rating) || 0,
        reviewsCount: parseInt(formData.reviewsCount) || 0,
        // In real app, you would upload the image here
        imageUrl: imagePreview || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
      };

      if (onSave) {
        onSave(bookData);
      }

      setLoading(false);
      onClose();
    }, 1500);
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'add': return 'Add New Book';
      case 'edit': return 'Edit Book';
      case 'view': return 'Book Details';
      default: return 'Book';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                <BookOpen size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{getModalTitle()}</h2>
                <p className="text-sm text-gray-600">
                  {mode === 'view' ? 'View book information' : 
                   mode === 'edit' ? 'Update book details' : 
                   'Add a new book to your collection'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="px-6 flex space-x-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'basic' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Basic Information
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'pricing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Pricing & Stock
              </button>
              <button
                onClick={() => setActiveTab('attributes')}
                className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'attributes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Attributes
              </button>
              {mode === 'view' && (
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'stats' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  Statistics
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-160px)] p-6">
            <form onSubmit={handleSubmit}>
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Book Cover
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg mx-auto"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview('');
                                setSelectedImage(null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <Image size={24} className="text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Drag & drop or click to upload
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                              JPEG, PNG up to 2MB
                            </p>
                            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer inline-block">
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={mode === 'view'}
                              />
                              <Upload size={16} className="inline mr-2" />
                              Choose Image
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:w-2/3 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <div className="flex items-center p-3 border rounded-lg">
                          <BookOpen size={20} className="text-gray-400 mr-3" />
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="flex-1 outline-none disabled:bg-transparent"
                            placeholder="Enter book title"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Author *
                        </label>
                        <div className="relative">
                          <div className="flex items-center p-3 border rounded-lg">
                            <User size={20} className="text-gray-400 mr-3" />
                            <input
                              type="text"
                              name="author"
                              value={formData.author}
                              onChange={handleInputChange}
                              disabled={mode === 'view'}
                              className="flex-1 outline-none disabled:bg-transparent"
                              placeholder="Select or enter author name"
                              required
                            />
                          </div>
                          {mode !== 'view' && (
                            <button
                              type="button"
                              onClick={() => setShowAuthorDropdown(!showAuthorDropdown)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <ChevronDown size={20} className="text-gray-400" />
                            </button>
                          )}
                          {showAuthorDropdown && mode !== 'view' && (
                            <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                              {authors.map((author) => (
                                <div
                                  key={author}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, author }));
                                    setShowAuthorDropdown(false);
                                  }}
                                >
                                  {author}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ISBN 10 *
                        </label>
                        <div className="flex items-center p-3 border rounded-lg">
                          <Hash size={20} className="text-gray-400 mr-3" />
                          <input
                            type="text"
                            name="isbn_10"
                            value={formData.isbn_10}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="flex-1 outline-none disabled:bg-transparent"
                            placeholder="Enter ISBN number"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ISBN 13 *
                        </label>
                        <div className="flex items-center p-3 border rounded-lg">
                          <Hash size={20} className="text-gray-400 mr-3" />
                          <input
                            type="text"
                            name="isbn_13"
                            value={formData.isbn_13}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="flex-1 outline-none disabled:bg-transparent"
                            placeholder="Enter ISBN number"
                            required
                          />
                        </div>
                    </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description
                    </label>
                    <textarea
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      disabled={mode === 'view'}
                      rows="2"
                      className="w-full p-3 border rounded-lg outline-none resize-none disabled:bg-transparent"
                      placeholder="Brief description for product listings"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={mode === 'view'}
                      rows="4"
                      className="w-full p-3 border rounded-lg outline-none resize-none disabled:bg-transparent"
                      placeholder="Detailed description of the book"
                    />
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <div className="flex items-center p-3 border rounded-lg">
                        <Tag size={20} className="text-gray-400 mr-3" />
                        <input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          className="flex-1 outline-none disabled:bg-transparent"
                          placeholder="Select category"
                          required
                        />
                      </div>
                      {mode !== 'view' && (
                        <button
                          type="button"
                          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <ChevronDown size={20} className="text-gray-400" />
                        </button>
                      )}
                      {showCategoryDropdown && mode !== 'view' && (
                        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {categories.map((cat) => (
                            <div
                              key={cat}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, category: cat }));
                                setShowCategoryDropdown(false);
                              }}
                            >
                              {cat}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publisher
                    </label>
                    <input
                      type="text"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      disabled={mode === 'view'}
                      className="w-full p-3 border rounded-lg outline-none disabled:bg-transparent"
                      placeholder="Publisher name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publication Date
                    </label>
                    <div className="flex items-center p-3 border rounded-lg">
                      <Calendar size={20} className="text-gray-400 mr-3" />
                      <input
                        type="date"
                        name="publicationDate"
                        value={formatDate(formData.publicationDate)}
                        onChange={handleInputChange}
                        disabled={mode === 'view'}
                        className="flex-1 outline-none disabled:bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <div className="flex items-center p-3 border rounded-lg">
                      <Globe size={20} className="text-gray-400 mr-3" />
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        disabled={mode === 'view'}
                        className="flex-1 outline-none bg-transparent disabled:bg-transparent"
                      >
                        <option value="">Select Language</option>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Japanese">Japanese</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Pages
                    </label>
                    <div className="flex items-center p-3 border rounded-lg">
                      <FileText size={20} className="text-gray-400 mr-3" />
                      <input
                        type="number"
                        name="pages"
                        value={formData.pages}
                        onChange={handleInputChange}
                        disabled={mode === 'view'}
                        className="flex-1 outline-none disabled:bg-transparent"
                        placeholder="e.g., 320"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    {console.log(formData)}
                    <input
                      type="text"
                      value={formData.categories.map((cat)=>cat.name).join(', ')}
                      onChange={handleTagsChange}
                      disabled={mode === 'view'}
                      className="w-full p-3 border rounded-lg outline-none disabled:bg-transparent"
                      placeholder="Separate tags with commas"
                    />
                    {formData.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.categories.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing & Stock Tab */}
              {activeTab === 'pricing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Regular Price *
                    </label>
                    <div className="flex items-center p-3 border rounded-lg">
                      KES 
                      <input
                        type="number"
                        name="price"
                        value={(formData.list_price * 130).toFixed(2)}
                        onChange={handleInputChange}
                        disabled={mode === 'view'}
                        className="flex-1 outline-none disabled:bg-transparent"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Price
                    </label>
                    <div className="flex items-center p-3 border rounded-lg">
                      KES 
                      <input
                        type="number"
                        name="discountPrice"
                        value={(formData.sale_price * 130).toFixed(2)}
                        onChange={handleInputChange}
                        disabled={mode === 'view'}
                        className="flex-1 outline-none disabled:bg-transparent"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {formData.discountPrice && formData.price && (
                      <div className="mt-2 text-sm text-green-600">
                        Save {((1 - formData.sale_rice / formData.list_price) * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <div className="flex items-center p-3 border rounded-lg">
                      <Package size={20} className="text-gray-400 mr-3" />
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock_quantity}
                        onChange={handleInputChange}
                        disabled={mode === 'view'}
                        className="flex-1 outline-none disabled:bg-transparent"
                        placeholder="Available units"
                        min="0"
                        required
                      />
                    </div>
                    <div className="mt-2">
                      {formData.stock < 10 && formData.stock > 0 ? (
                        <div className="flex items-center text-yellow-600 text-sm">
                          <AlertCircle size={16} className="mr-1" />
                          Low stock warning
                        </div>
                      ) : formData.stock === 0 ? (
                        <div className="flex items-center text-red-600 text-sm">
                          <AlertCircle size={16} className="mr-1" />
                          Out of stock
                        </div>
                      ) : formData.stock >= 50 ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <Check size={16} className="mr-1" />
                          In stock
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={mode === 'view'}
                      className="w-full p-3 border rounded-lg outline-none disabled:bg-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Dimensions */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (grams)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight_grams}
                        onChange={handleInputChange}
                        disabled={mode === 'view'}
                        className="w-full p-3 border rounded-lg outline-none disabled:bg-transparent"
                        placeholder="e.g., 500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dimensions (L×W×H)
                      </label>
                      <input
                        type="text"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        disabled={mode === 'view'}
                        className="w-full p-3 border rounded-lg outline-none disabled:bg-transparent"
                        placeholder="e.g., 8.5×5.5×1.2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Attributes Tab */}
              {activeTab === 'attributes' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex items-center p-3 border rounded-lg">
                        <Star size={20} className="text-gray-400 mr-3" />
                        <input
                          type="number"
                          name="rating"
                          value={formData.average_rating}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          className="flex-1 outline-none disabled:bg-transparent"
                          placeholder="0.0 - 5.0"
                          min="0"
                          max="5"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reviews Count
                      </label>
                      <input
                        type="number"
                        name="reviewsCount"
                        value={formData.review_count}
                        onChange={handleInputChange}
                        disabled={mode === 'view'}
                        className="w-full p-3 border rounded-lg outline-none disabled:bg-transparent"
                        placeholder="Number of reviews"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Flags */}
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Book Flags</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.is_featured}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Featured</span>
                          <p className="text-sm text-gray-500">Show on homepage</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          name="bestseller"
                          checked={formData.is_bestseller}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Bestseller</span>
                          <p className="text-sm text-gray-500">Mark as bestseller</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          name="newRelease"
                          checked={formData.is_new_release}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">New Release</span>
                          <p className="text-sm text-gray-500">Recently published</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {formData.isbn_10?
                          'ISBN 10':
                          'ISBN 13'}
                        </label>
                        <input
                          type="text"
                          value={formData.isbn_10 || formData.isbn_13}
                          disabled
                          className="w-full p-3 border rounded-lg bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Created Date
                        </label>
                        <input
                          type="text"
                          value={new Date().toLocaleDateString()}
                          disabled
                          className="w-full p-3 border rounded-lg bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Statistics Tab (View Only) */}
              {activeTab === 'stats' && mode === 'view' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Sales</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
                      <div className="flex items-center justify-center mt-2 text-green-600">
                        <TrendingUp size={16} className="mr-1" />
                        <span className="text-sm">+12.5% this month</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">$45,678</p>
                      <div className="flex items-center justify-center mt-2 text-green-600">
                        <TrendingUp size={16} className="mr-1" />
                        <span className="text-sm">+8.3% this month</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Average Rating</p>
                      <div className="flex items-center justify-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={`${i < Math.floor(formData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} mx-0.5`}
                          />
                        ))}
                      </div>
                      <p className="text-lg font-bold text-gray-900 mt-2">{formData.rating}/5</p>
                      <p className="text-sm text-gray-600 mt-1">{formData.reviewsCount} reviews</p>
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <h3 className="font-medium text-gray-900 mb-4">Monthly Sales Trend</h3>
                    <div className="h-48 bg-gray-50 rounded-lg p-4 flex items-end space-x-2">
                      {[65, 40, 75, 50, 60, 45, 70, 55, 80, 65, 90, 75].map((height, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-blue-500 rounded-t-lg"
                            style={{ height: `${height}%` }}
                          ></div>
                          <span className="text-xs text-gray-500 mt-2">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              {mode !== 'view' && (
                <div className="sticky bottom-0 bg-white border-t mt-6 -mb-6 -mx-6 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <div className="flex items-center space-x-3">
                      {mode === 'edit' && (
                        <button
                          type="button"
                          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                          onClick={() => setActiveTab('view')}
                        >
                          <Eye size={16} className="inline mr-2" />
                          Preview
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            {mode === 'add' ? <Plus size={16} className="mr-2" /> : <Save size={16} className="mr-2" />}
                            {mode === 'add' ? 'Add Book' : 'Save Changes'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'view' && (
                <div className="sticky bottom-0 bg-white border-t mt-6 -mb-6 -mx-6 px-6 py-4">
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      onClick={() => {
                        // Switch to edit mode
                        if (typeof onClose === 'function') {
                          onClose();
                        }
                        // In parent component, you would open the modal in edit mode
                      }}
                    >
                      <Save size={16} className="inline mr-2" />
                      Edit Book
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;