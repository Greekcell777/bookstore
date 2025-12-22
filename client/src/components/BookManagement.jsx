import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, MoreVertical, Download, Upload, BookOpen, Grid, List } from 'lucide-react';
import BookModal from './BookModal';

const BooksManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedBook, setSelectedBook] = useState(null);

  // Sample books data with more details
  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      isbn: '978-1-250-30169-7',
      category: 'Mystery & Thriller',
      price: 29.99,
      discountPrice: 24.99,
      stock: 45,
      status: 'Published',
      sales: 234,
      rating: 4.5,
      description: 'The Silent Patient is a shocking psychological thriller of a woman\'s act of violence against her husband—and of the therapist obsessed with uncovering her motive.',
      shortDescription: 'A psychological thriller about a woman who shoots her husband and then stops speaking.',
      pages: 336,
      language: 'English',
      publisher: 'Celadon Books',
      publicationDate: '2019-02-05',
      weight: '500',
      dimensions: '8.5×5.5×1.2',
      tags: ['Psychological', 'Thriller', 'Mystery'],
      featured: true,
      bestseller: true,
      newRelease: false,
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
    },
    {
      id: 2,
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '978-0-735-21148-7',
      category: 'Self-Help',
      price: 24.99,
      discountPrice: 22.99,
      stock: 32,
      status: 'Published',
      sales: 189,
      rating: 4.7,
      description: 'Tiny Changes, Remarkable Results: An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
      shortDescription: 'A guide to building good habits and breaking bad ones.',
      pages: 320,
      language: 'English',
      publisher: 'Avery',
      publicationDate: '2018-10-16',
      weight: '450',
      dimensions: '8.4×5.5×1.1',
      tags: ['Self-Help', 'Productivity', 'Psychology'],
      featured: true,
      bestseller: true,
      newRelease: false,
      imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400'
    },
    {
      id: 3,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      isbn: '978-0-593-20021-1',
      category: 'Science Fiction',
      price: 27.99,
      discountPrice: 24.99,
      stock: 0,
      status: 'Out of Stock',
      sales: 156,
      rating: 4.8,
      description: 'A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian.',
      shortDescription: 'A lone astronaut must save the earth from disaster.',
      pages: 496,
      language: 'English',
      publisher: 'Ballantine Books',
      publicationDate: '2021-05-04',
      weight: '680',
      dimensions: '9.3×6.4×1.7',
      tags: ['Sci-Fi', 'Space', 'Adventure'],
      featured: true,
      bestseller: true,
      newRelease: true,
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'
    },
    {
      id: 4,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      isbn: '978-0-525-55948-1',
      category: 'Fiction',
      price: 19.99,
      stock: 28,
      status: 'Published',
      sales: 134,
      rating: 4.4,
      description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
      shortDescription: 'A novel about a library that contains books that let you experience the lives you could have lived.',
      pages: 304,
      language: 'English',
      publisher: 'Viking',
      publicationDate: '2020-08-13',
      weight: '420',
      dimensions: '8.2×5.5×1.0',
      tags: ['Fiction', 'Fantasy', 'Philosophical'],
      featured: false,
      bestseller: true,
      newRelease: false,
      imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400'
    },
    {
      id: 5,
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '978-0-441-17271-8',
      category: 'Science Fiction',
      price: 29.99,
      discountPrice: 26.99,
      stock: 15,
      status: 'Published',
      sales: 128,
      rating: 4.6,
      description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange.',
      shortDescription: 'Epic science fiction set on the desert planet Arrakis.',
      pages: 412,
      language: 'English',
      publisher: 'Ace',
      publicationDate: '1965-08-01',
      weight: '560',
      dimensions: '8.1×5.4×1.3',
      tags: ['Classic', 'Sci-Fi', 'Adventure'],
      featured: true,
      bestseller: true,
      newRelease: false,
      imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400'
    },
    {
      id: 6,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '978-0-618-34625-6',
      category: 'Fantasy',
      price: 22.99,
      discountPrice: 19.99,
      stock: 50,
      status: 'Published',
      sales: 432,
      rating: 4.8,
      description: 'Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar.',
      shortDescription: 'The adventure of Bilbo Baggins in Middle-earth.',
      pages: 300,
      language: 'English',
      publisher: 'Houghton Mifflin',
      publicationDate: '1937-09-21',
      weight: '480',
      dimensions: '8.2×5.5×1.0',
      tags: ['Fantasy', 'Adventure', 'Classic'],
      featured: true,
      bestseller: true,
      newRelease: false,
      imageUrl: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400'
    },
    {
      id: 7,
      title: 'Educated',
      author: 'Tara Westover',
      isbn: '978-0-399-59050-4',
      category: 'Memoir',
      price: 26.99,
      stock: 22,
      status: 'Published',
      sales: 198,
      rating: 4.7,
      description: 'Tara Westover was seventeen the first time she set foot in a classroom. Born to survivalists in the mountains of Idaho, she prepared for the end of the world by stockpiling home-canned peaches.',
      shortDescription: 'A memoir about a woman who leaves her survivalist family and goes on to earn a PhD.',
      pages: 334,
      language: 'English',
      publisher: 'Random House',
      publicationDate: '2018-02-20',
      weight: '520',
      dimensions: '8.5×5.8×1.2',
      tags: ['Memoir', 'Biography', 'Education'],
      featured: false,
      bestseller: true,
      newRelease: false,
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'
    },
    {
      id: 8,
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      isbn: '978-0-06-231609-7',
      category: 'History',
      price: 31.99,
      discountPrice: 28.99,
      stock: 0,
      status: 'Out of Stock',
      sales: 345,
      rating: 4.5,
      description: 'From a renowned historian comes a groundbreaking narrative of humanity\'s creation and evolution that explores the ways in which biology and history have defined us.',
      shortDescription: 'A brief history of humankind from the Stone Age to the present.',
      pages: 464,
      language: 'English',
      publisher: 'Harper',
      publicationDate: '2015-02-10',
      weight: '620',
      dimensions: '9.0×6.0×1.4',
      tags: ['History', 'Anthropology', 'Science'],
      featured: false,
      bestseller: true,
      newRelease: false,
      imageUrl: 'https://images.unsplash.com/photo-1531346688376-ab6275c4725e?w=400'
    }
  ]);

  // Modal handlers
  const handleOpenModal = (mode, book = null) => {
    setModalMode(mode);
    setSelectedBook(book);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  const handleSaveBook = (bookData) => {
    if (modalMode === 'add') {
      // Add new book
      const newBook = {
        ...bookData,
        id: books.length + 1,
        sales: Math.floor(Math.random() * 200) + 50, // Random sales for demo
        rating: parseFloat((Math.random() * 1 + 3.5).toFixed(1)), // Random rating for demo
      };
      setBooks([...books, newBook]);
    } else if (modalMode === 'edit' && selectedBook) {
      // Update existing book
      setBooks(books.map(book => 
        book.id === selectedBook.id ? { ...bookData, id: book.id } : book
      ));
    }
  };

  const handleDeleteBook = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(book => book.id !== id));
      setSelectedBooks(selectedBooks.filter(bookId => bookId !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedBooks(books.map(book => book.id));
    } else {
      setSelectedBooks([]);
    }
  };

  const handleSelectBook = (id) => {
    if (selectedBooks.includes(id)) {
      setSelectedBooks(selectedBooks.filter(bookId => bookId !== id));
    } else {
      setSelectedBooks([...selectedBooks, id]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedBooks.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedBooks.length} selected book(s)?`)) {
      setBooks(books.filter(book => !selectedBooks.includes(book.id)));
      setSelectedBooks([]);
    }
  };

  // Filter books based on search term
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Books Management</h1>
          <p className="text-gray-600">Manage your bookstore inventory and listings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center">
            <Download size={20} className="mr-2" />
            Export
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center">
            <Upload size={20} className="mr-2" />
            Import
          </button>
          <button 
            onClick={() => handleOpenModal('add')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add New Book
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">{books.length}</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <BookOpen size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {books.filter(book => book.stock === 0).length}
              </p>
            </div>
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <BookOpen size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {books.filter(book => book.stock > 0 && book.stock < 10).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <BookOpen size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bestsellers</p>
              <p className="text-2xl font-bold text-gray-900">
                {books.filter(book => book.bestseller).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <BookOpen size={24} />
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
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select className="border rounded-lg px-3 py-2">
                <option>All Categories</option>
                <option>Fiction</option>
                <option>Non-Fiction</option>
                <option>Science Fiction</option>
                <option>Mystery & Thriller</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select className="border rounded-lg px-3 py-2">
                <option>All Status</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Out of Stock</option>
              </select>
            </div>
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 flex items-center ${viewMode === 'table' ? 'bg-gray-100 text-blue-600' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                <List size={18} className="mr-2" />
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 flex items-center ${viewMode === 'grid' ? 'bg-gray-100 text-blue-600' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                <Grid size={18} className="mr-2" />
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedBooks.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-blue-700 font-medium">
              {selectedBooks.length} book{selectedBooks.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Bulk Edit
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

      {/* Books Display - Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedBooks.length === filteredBooks.length && filteredBooks.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(book.id)}
                        onChange={() => handleSelectBook(book.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <img 
                            src={book.imageUrl} 
                            alt={book.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{book.title}</div>
                          <div className="text-sm text-gray-500">{book.author}</div>
                          <div className="text-xs text-gray-400">{book.isbn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium">
                          ${book.discountPrice ? book.discountPrice.toFixed(2) : book.price.toFixed(2)}
                        </span>
                        {book.discountPrice && (
                          <span className="ml-2 text-sm text-gray-400 line-through">
                            ${book.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={book.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                          {book.stock}
                        </span>
                        {book.stock < 10 && book.stock > 0 && (
                          <span className="ml-2 text-xs text-red-600">Low Stock</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        book.status === 'Published' ? 'bg-green-100 text-green-800' :
                        book.status === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="font-medium">{book.sales}</span>
                        <div className="ml-2 flex items-center">
                          <span className={`text-xs ${book.rating >= 4 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {book.rating}★
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleOpenModal('view', book)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleOpenModal('edit', book)}
                          className="p-1 text-gray-400 hover:text-green-600 transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteBook(book.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredBooks.length}</span> of{' '}
              <span className="font-medium">{books.length}</span> books
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {book.featured && (
                  <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </div>
                )}
                {book.bestseller && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Bestseller
                  </div>
                )}
                {book.stock === 0 && (
                  <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Out of Stock
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <div className="flex items-center mt-1">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {book.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{book.rating}</span>
                  <span className="text-sm text-gray-400">({book.sales})</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      ${book.discountPrice ? book.discountPrice.toFixed(2) : book.price.toFixed(2)}
                    </p>
                    {book.discountPrice && (
                      <p className="text-sm text-gray-400 line-through">${book.price.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenModal('view', book)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition"
                      title="View Details"
                    >
                      <Eye size={20} />
                    </button>
                    <button 
                      onClick={() => handleOpenModal('edit', book)}
                      className="p-2 text-gray-600 hover:text-green-600 transition"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => handleDeleteBook(book.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Modal */}
      <BookModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        initialData={selectedBook}
        onSave={handleSaveBook}
      />
    </div>
  );
};

export default BooksManagement;