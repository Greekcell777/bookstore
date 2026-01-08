import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, Edit, Trash2, Eye, 
  MoreVertical, Download, Upload, BookOpen, 
  Grid, List, Loader2, AlertCircle, RefreshCw,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import BookModal from './BookModal';
import { useBookStore } from './BookstoreContext';

const BooksManagement = () => {
  const { 
    books: contextBooks, 
    fetchBooks, 
    isLoading, 
    error,
    booksAPI 
  } = useBookStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Load books from context or API
  useEffect(() => {
    const loadBooks = async () => {
      setLocalLoading(true);
      setLocalError(null);
      try {
        // If we have booksAPI, use it with pagination
        if (booksAPI && booksAPI.getBooks) {
          const params = {
            page: currentPage,
            per_page: itemsPerPage,
            search: searchTerm
          };
          
          const response = await booksAPI.getBooks(params);
          console.log('API response:', response);
          
          if (response.books) {
            setBooks(response.books);
            setTotalItems(response.pagination?.total || response.books.length);
            setTotalPages(response.pagination?.pages || 1);
          } else if (Array.isArray(response)) {
            // Handle direct array response
            setBooks(response);
            setTotalItems(response.length);
            setTotalPages(Math.ceil(response.length / itemsPerPage));
          }
        } else if (contextBooks && contextBooks.length > 0) {
          // Use books from context
          setBooks(contextBooks);
          setTotalItems(contextBooks.length);
          setTotalPages(Math.ceil(contextBooks.length / itemsPerPage));
        } else {
          // Fetch books from regular API
          await fetchBooks();
        }
      } catch (err) {
        console.error('Failed to load books:', err);
        setLocalError('Failed to load books. Please try again.');
      } finally {
        setLocalLoading(false);
      }
    };

    loadBooks();
  }, [contextBooks, fetchBooks, booksAPI, currentPage, itemsPerPage, searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  const handleSaveBook = async (bookData) => {
    try {
      setLocalLoading(true);
      
      if (modalMode === 'add') {
        if (booksAPI && booksAPI.createBook) {
          const response = await booksAPI.createBook(bookData);
          if (response.book) {
            // Refresh books list
            await handleRefreshBooks();
          }
        } else {
          // Fallback: Add to local state
          const newBook = {
            ...bookData,
            id: books.length + 1,
            sales: Math.floor(Math.random() * 200) + 50,
            rating: parseFloat((Math.random() * 1 + 3.5).toFixed(1)),
            status: 'Published',
            stock: bookData.stock || 0,
            imageUrl: bookData.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
          };
          setBooks(prev => [...prev, newBook]);
          setTotalItems(prev => prev + 1);
        }
      } else if (modalMode === 'edit' && selectedBook) {
        if (booksAPI && booksAPI.updateBook) {
          const response = await booksAPI.updateBook(selectedBook.id, bookData);
          if (response.book) {
            await handleRefreshBooks();
          }
        } else {
          setBooks(prev => 
            prev.map(book => 
              book.id === selectedBook.id ? { ...book, ...bookData, id: book.id } : book
            )
          );
        }
      }
      console.log(books)
      
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save book:', error);
      setLocalError('Failed to save book. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      setLocalLoading(true);
      
      if (booksAPI && booksAPI.deleteBook) {
        await booksAPI.deleteBook(id);
        await handleRefreshBooks();
      } else {
        setBooks(prev => prev.filter(book => book.id !== id));
        setSelectedBooks(prev => prev.filter(bookId => bookId !== id));
        setTotalItems(prev => prev - 1);
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
      setLocalError('Failed to delete book. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    const currentPageBooks = getCurrentPageBooks();
    if (e.target.checked) {
      setSelectedBooks(currentPageBooks.map(book => book.id));
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

  const handleDeleteSelected = async () => {
    if (selectedBooks.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedBooks.length} selected book(s)?`)) {
      return;
    }

    try {
      setLocalLoading(true);
      
      if (booksAPI && booksAPI.deleteBook) {
        await Promise.all(selectedBooks.map(id => booksAPI.deleteBook(id)));
        await handleRefreshBooks();
      } else {
        setBooks(prev => prev.filter(book => !selectedBooks.includes(book.id)));
        setSelectedBooks([]);
        setTotalItems(prev => prev - selectedBooks.length);
      }
    } catch (error) {
      console.error('Failed to delete selected books:', error);
      setLocalError('Failed to delete selected books. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleRefreshBooks = async () => {
    try {
      setLocalLoading(true);
      setLocalError(null);
      setSelectedBooks([]);
      
      // Reset to first page and reload
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        // Force reload by calling API again
        if (booksAPI && booksAPI.getBooks) {
          const params = {
            page: currentPage,
            per_page: itemsPerPage,
            search: searchTerm
          };
          const response = await booksAPI.getBooks(params);
          if (response.books) {
            setBooks(response.books);
            setTotalItems(response.pagination?.total || response.books.length);
            setTotalPages(response.pagination?.pages || 1);
          }
        }
      }
    } catch (error) {
      console.error('Failed to refresh books:', error);
      setLocalError('Failed to refresh books. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  // Filter books based on search term (for local filtering when API doesn't support search)
  const filteredBooks = books.filter(book => {
    if (!book) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (book.title?.toLowerCase() || '').includes(searchLower) ||
      (book.author?.toLowerCase() || '').includes(searchLower) ||
      (book.isbn?.toLowerCase() || '').includes(searchLower) ||
      (book.category?.toLowerCase() || '').includes(searchLower) ||
      (book.genre?.toLowerCase() || '').includes(searchLower)
    );
  });

  // Get current page books (for local pagination when API doesn't support it)
  const getCurrentPageBooks = () => {
    if (booksAPI && booksAPI.getBooks) {
      // API handles pagination
      return books;
    } else {
      // Local pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredBooks.slice(startIndex, endIndex);
    }
  };

  // Calculate stats
  const totalBooks = books.length;
  const outOfStock = books.filter(book => book.stock === 0 || book.stock_quantity === 0).length;
  const lowStock = books.filter(book => (book.stock > 0 && book.stock < 10) || (book.stock_quantity > 0 && book.stock_quantity < 10)).length;
  const bestsellers = books.filter(book => book.bestseller).length;

  // Pagination controls
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Show loading state
  if (isLoading || localLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || localError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Books</h2>
          <p className="text-gray-600 mb-4">{error || localError}</p>
          <button
            onClick={handleRefreshBooks}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center mx-auto"
          >
            <RefreshCw size={20} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentPageBooks = getCurrentPageBooks();
  const displayTotalItems = booksAPI && booksAPI.getBooks ? totalItems : filteredBooks.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Books Management</h1>
          <p className="text-gray-600">
            {displayTotalItems} books in inventory • Page {currentPage} of {totalPages}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefreshBooks}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center"
            disabled={localLoading}
          >
            <RefreshCw size={20} className={`mr-2 ${localLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
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
            disabled={localLoading}
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
              <p className="text-2xl font-bold text-gray-900">{totalBooks}</p>
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
              <p className="text-2xl font-bold text-gray-900">{outOfStock}</p>
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
              <p className="text-2xl font-bold text-gray-900">{lowStock}</p>
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
              <p className="text-2xl font-bold text-gray-900">{bestsellers}</p>
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
              placeholder="Search books by title, author, ISBN, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Categories</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="science-fiction">Science Fiction</option>
                <option value="mystery-thriller">Mystery & Thriller</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
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
              disabled={localLoading}
            >
              {localLoading ? 'Deleting...' : 'Delete Selected'}
            </button>
          </div>
        </div>
      )}

      {/* No Books Message */}
      {currentPageBooks.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? `No books match your search for "${searchTerm}"` : 'No books in inventory'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              handleOpenModal('add');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Your First Book
          </button>
        </div>
      )}

      {/* Books Display - Table View */}
      {currentPageBooks.length > 0 && viewMode === 'table' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedBooks.length === currentPageBooks.length && currentPageBooks.length > 0}
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
                {currentPageBooks.map((book) => (
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
                          {book.image_url || book.imageUrl ? (
                            <img 
                              src={book.image_url || book.imageUrl} 
                              alt={book.title}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400';
                              }}
                            />
                          ) : (
                            <BookOpen size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">{book.title}</div>
                          <div className="text-sm text-gray-500">{book.author}</div>
                          <div className="text-xs text-gray-400">{book.isbn || 'No ISBN'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {book.categories.map((cat)=> cat.name).join(', ') || book.genre || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium">
                          KES{book.sale_price ? (book.sale_price.toFixed(2) * 130).toFixed(1) : (book.list_price?.toFixed(2) * 130).toFixed(1) || '0.00'}
                        </span>
                        {book.sale_price && book.list_price && (
                          <span className="ml-2 text-sm text-gray-400 line-through">
                            KES{(book.list_price.toFixed(2) * 130).toFixed(1)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={book.stock_quantity < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                          {book.stock_quantity || book.stock || 0}
                        </span>
                        {book.stock_quantity > 0 && book.stock_quantity < 10 && (
                          <span className="ml-2 text-xs text-red-600">Low Stock</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (book.status === 'Published' || book.status === 'published') ? 'bg-green-100 text-green-800' :
                        (book.status === 'Out of Stock' || book.stock_quantity === 0) ? 'bg-red-100 text-red-800' :
                        book.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {book.status || (book.stock_quantity === 0 ? 'Out of Stock' : 'Published')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="font-medium">{book.total_sold || book.sales || 0}</span>
                        {(book.average_rating || book.rating) && (
                          <div className="ml-2 flex items-center">
                            <span className={`text-xs ${(book.average_rating || book.rating) >= 4 ? 'text-green-600' : 'text-yellow-600'}`}>
                              {(book.average_rating || book.rating)?.toFixed(1)}★
                            </span>
                          </div>
                        )}
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
                          disabled={localLoading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, displayTotalItems)}
                </span> of{' '}
                <span className="font-medium">{displayTotalItems}</span> books
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Show:</span>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-700 ml-2">per page</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                title="First page"
              >
                <ChevronsLeft size={20} />
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                title="Previous page"
              >
                <ChevronLeft size={20} />
              </button>
              
              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  if (pageNum < 1 || pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-1 border rounded hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                title="Next page"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                title="Last page"
              >
                <ChevronsRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Books Display - Grid View */}
      {currentPageBooks.length > 0 && viewMode === 'grid' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentPageBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gray-100 overflow-hidden">
                    {book.image_url || book.imageUrl ? (
                      <img
                        src={book.image_url || book.imageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={48} className="text-gray-300" />
                      </div>
                    )}
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
                  {(book.stock_quantity === 0 || book.stock === 0) && (
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
                        {book.category || book.genre || 'Uncategorized'}
                      </span>
                    </div>
                  </div>

                  {(book.average_rating || book.rating) && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(book.average_rating || book.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{(book.average_rating || book.rating)?.toFixed(1)}</span>
                      <span className="text-sm text-gray-400">({book.total_sold || book.sales || 0})</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        ${book.sale_price ? book.sale_price.toFixed(2) : book.list_price?.toFixed(2) || '0.00'}
                      </p>
                      {book.sale_price && book.list_price && (
                        <p className="text-sm text-gray-400 line-through">${book.list_price.toFixed(2)}</p>
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
                        disabled={localLoading}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination for Grid View */}
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, displayTotalItems)}
              </span> of{' '}
              <span className="font-medium">{displayTotalItems}</span> books
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                title="First page"
              >
                <ChevronsLeft size={20} />
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                title="Previous page"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  if (pageNum < 1 || pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                title="Next page"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                title="Last page"
              >
                <ChevronsRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Book Modal */}
      <BookModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        initialData={selectedBook}
        onSave={handleSaveBook}
        isLoading={localLoading}
      />
    </div>
  );
};

export default BooksManagement;