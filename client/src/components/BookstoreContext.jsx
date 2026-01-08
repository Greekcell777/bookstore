// context/SimpleBookStore.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { booksAPI, cartAPI, wishlistAPI, ordersAPI, authAPI, adminAPI } from '../services/api';

// Create the context
const BookStore = createContext();

// Custom hook
export const useBookStore = () => {
  const context = useContext(BookStore);
  if (!context) {
    throw new Error('useSimpleBookStore must be used within SimpleBookStoreProvider');
  }
  return context;
};

// Main provider
export const BookStoreProvider = ({ children }) => {
  // State variables
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    category: null,
    searchQuery: '',
    sortBy: 'title',
    priceRange: [0, 100],
    format: 'all'
  });

  // Admin states
  const [adminStats, setAdminStats] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminReviews, setAdminReviews] = useState([]);
  const [adminPagination, setAdminPagination] = useState({
    users: {},
    orders: {},
    reviews: {}
  });
  
  // Admin filters
  const [adminFilters, setAdminFilters] = useState({
    users: {
      search: '',
      role: '',
      status: '',
      sort: 'created_at',
      order: 'desc',
      page: 1,
      per_page: 20
    },
    orders: {
      status: '',
      start_date: '',
      end_date: '',
      search: '',
      sort: 'created_at',
      order: 'desc',
      page: 1,
      per_page: 20
    },
    reviews: {
      status: '',
      book_id: '',
      user_id: '',
      sort: 'created_at',
      order: 'desc',
      page: 1,
      per_page: 20
    }
  });

  // Add review-related states near other admin states
const [reviews, setReviews] = useState([]);
const [selectedReviews, setSelectedReviews] = useState([]);
const [activeReviewFilter, setActiveReviewFilter] = useState('all');
const [reviewSearchTerm, setReviewSearchTerm] = useState('');

// Add review filter options
const reviewFilterOptions = [
  { id: 'all', label: 'All Reviews', count: reviews.length, color: 'bg-gray-500' },
  { id: 'pending', label: 'Pending', count: reviews.filter(r => r.status === 'pending').length, color: 'bg-yellow-500' },
  { id: 'approved', label: 'Approved', count: reviews.filter(r => r.status === 'approved').length, color: 'bg-green-500' },
  { id: 'rejected', label: 'Rejected', count: reviews.filter(r => r.status === 'rejected').length, color: 'bg-red-500' },
  { id: 'unanswered', label: 'Unanswered', count: reviews.filter(r => !r.response).length, color: 'bg-blue-500' }
];

// Review statistics
const reviewStats = {
  totalReviews: reviews.length,
  averageRating: reviews.length > 0 ? 
    reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length : 0,
  pendingReviews: reviews.filter(r => r.status === 'pending').length,
  approvedReviews: reviews.filter(r => r.status === 'approved').length,
  reviewsWithResponse: reviews.filter(r => r.response).length,
  helpfulVotes: reviews.reduce((sum, review) => sum + (review.helpfulCount || 0), 0),
  ratingDistribution: {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  }
};

// Review filter logic
const getFilteredReviews = () => {
  return reviews.filter(review => {
    const matchesFilter = activeReviewFilter === 'all' || 
      (activeReviewFilter === 'pending' && review.status === 'pending') ||
      (activeReviewFilter === 'approved' && review.status === 'approved') ||
      (activeReviewFilter === 'rejected' && review.status === 'rejected') ||
      (activeReviewFilter === 'unanswered' && !review.response);
    
    const matchesSearch = reviewSearchTerm === '' || 
      (review.customer?.name || review.user?.username || '').toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
      (review.book?.title || '').toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
      (review.content || '').toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
      (review.title || '').toLowerCase().includes(reviewSearchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
};



  // Helper: Handle API calls
  const handleApiCall = async (apiCall, successHandler, errorMessage = 'Operation failed') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      
      if (successHandler) successHandler(response);
      return response;
    } catch (err) {
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ================= BOOK OPERATIONS =================
  const fetchBooks = async (params = {}) => {
    return handleApiCall(
      () => booksAPI.getBooks(params),
      (response) => setBooks(response.books || response)
    );
  };

  const fetchCategories = async () => {
    return handleApiCall(
      () => booksAPI.getCategories(),
      setCategories
    );
  };

  const fetchFeaturedBooks = async () => {
    return handleApiCall(
      () => booksAPI.getFeaturedBooks(),
      setFeaturedBooks
    );
  };

  // ================= CART OPERATIONS =================
  const fetchCart = async () => {
    return handleApiCall(
      () => cartAPI.getCart(),
      (response) => setCart(response.items || response || [])
    );
  };

  const updateCart = async (itemId, quantity) => {
    return handleApiCall(
      () => {
        if (quantity <= 0) {
          // If quantity is 0 or negative, remove the item
          return cartAPI.removeFromCart(itemId);
        } else {
          // Update quantity for existing item
          return cartAPI.updateCartItem(itemId, { quantity });
        }
      },
      async () => {
        // Refresh cart after updating
        const updatedCart = await cartAPI.getCart();
        setCart(updatedCart.items || updatedCart || []);
        
        // You could add a toast notification here
        console.log('Cart updated successfully');
      },
      'Failed to update cart'
    );
  };

  const addToCart = async (bookId, quantity = 1) => {
    return handleApiCall(
      () => cartAPI.addToCart(bookId, quantity),
      async () => {
        // Refresh cart after adding
        const updatedCart = await cartAPI.getCart();
        setCart(updatedCart.items || updatedCart || []);
      },
      'Failed to add to cart'
    );
  };

  const removeFromCart = async (itemId) => {
    return handleApiCall(
      () => cartAPI.removeFromCart(itemId),
      async () => {
        // Refresh cart after removing
        const updatedCart = await cartAPI.getCart();
        setCart(updatedCart.items || updatedCart || []);
      },
      'Failed to remove from cart'
    );
  };

  const clearCart = async () => {
    return handleApiCall(
      () => cartAPI.clearCart(),
      () => setCart([]),
      'Failed to clear cart'
    );
  };

  // ================= WISHLIST OPERATIONS =================
  const fetchWishlist = async () => {
    return handleApiCall(
      () => wishlistAPI.getWishlist(),
      (response) => setWishlist(response.items || response || [])
    );
  };

  const addToWishlist = async (bookId) => {
    return handleApiCall(
      () => wishlistAPI.addToWishlist(bookId),
      async () => {
        // Refresh wishlist after adding
        const updatedWishlist = await wishlistAPI.getWishlist();
        setWishlist(updatedWishlist.items || updatedWishlist || []);
      },
      'Failed to add to wishlist'
    );
  };

  const removeFromWishlist = async (itemId) => {
    return handleApiCall(
      () => wishlistAPI.removeFromWishlist(itemId),
      async () => {
        // Refresh wishlist after removing
        const updatedWishlist = await wishlistAPI.getWishlist();
        setWishlist(updatedWishlist.items || updatedWishlist || []);
      },
      'Failed to remove from wishlist'
    );
  };

  // Review operations
const fetchReviews = async (params = {}) => {
  return handleApiCall(
    () => adminAPI.getReviews(params),
    (response) => {
      if (response.reviews) {
        setReviews(response.reviews);
      } else {
        setReviews(response);
      }
    }
  );
};

const approveReview = async (reviewId) => {
  return handleApiCall(
    () => adminAPI.approveReview(reviewId),
    () => {
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId ? { ...review, status: 'approved' } : review
        )
      );
    },
    'Failed to approve review'
  );
};

const rejectReview = async (reviewId) => {
  return handleApiCall(
    () => adminAPI.rejectReview(reviewId),
    () => {
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId ? { ...review, status: 'rejected' } : review
        )
      );
    },
    'Failed to reject review'
  );
};

const updateReview = async (reviewId, reviewData) => {
  return handleApiCall(
    () => adminAPI.updateReview(reviewId, reviewData),
    (response) => {
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId ? { ...review, ...response } : review
        )
      );
      return response;
    }
  );
};

const deleteReview = async (reviewId) => {
  return handleApiCall(
    () => adminAPI.deleteReview(reviewId),
    () => {
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      setSelectedReviews(prev => prev.filter(id => id !== reviewId));
    },
    'Failed to delete review'
  );
};

const deleteSelectedReviews = async () => {
  return handleApiCall(
    async () => {
      const deletePromises = selectedReviews.map(id => adminAPI.deleteReview(id));
      await Promise.all(deletePromises);
    },
    () => {
      setReviews(prev => prev.filter(review => !selectedReviews.includes(review.id)));
      setSelectedReviews([]);
    },
    'Failed to delete selected reviews'
  );
};

const addAdminResponse = async (reviewId, responseData) => {
  return handleApiCall(
    () => adminAPI.addReviewResponse(reviewId, responseData),
    (response) => {
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId ? { ...review, response: response } : review
        )
      );
      return response;
    },
    'Failed to add admin response'
  );
};

  // ================= USER OPERATIONS =================
  const login = async (credentials) => {
    return handleApiCall(
      () => authAPI.login(credentials),
      async (response) => {
        if (response?.user) {
          // In your getCurrentUser and login functions
          console.log('About to set user with:', response.user);
          setUser(response.user);
          console.log('setUser called');
          // Fetch user data after login
          try {
            const [cartRes, wishlistRes] = await Promise.allSettled([
              cartAPI.getCart(),
              wishlistAPI.getWishlist()
            ]);
            
            if (cartRes.status === 'fulfilled') {
              setCart(cartRes.value.items || cartRes.value || []);
            }
            
            if (wishlistRes.status === 'fulfilled') {
              setWishlist(wishlistRes.value.items || wishlistRes.value || []);
            }
          } catch (err) {
            console.log('Error fetching user data:', err);
          }
        }
      },
      'Login failed'
    );
  };

  const register = async (userData) => {
    return handleApiCall(
      () => authAPI.register(userData),
      async (response) => {
        if (response?.user) {
          setUser(response.user);
          console.log('Registration successful:', response.user);
          
          // Store user in localStorage as fallback
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // If registration includes auto-login, fetch user data
          if (response.user) {
            try {
              const [cartRes, wishlistRes] = await Promise.allSettled([
                cartAPI.getCart(),
                wishlistAPI.getWishlist()
              ]);
              
              if (cartRes.status === 'fulfilled') {
                setCart(cartRes.value.items || cartRes.value || []);
              }
              
              if (wishlistRes.status === 'fulfilled') {
                setWishlist(wishlistRes.value.items || wishlistRes.value || []);
              }
            } catch (err) {
              console.log('Error fetching user data after registration:', err);
            }
          }
        }
      },
      'Registration failed'
    );
  };

  const logout = async () => {
    return handleApiCall(
      () => authAPI.logout(),
      () => {
        setUser(null);
        setCart([]);
        setWishlist([]);
        setOrders([]);
      },
      'Logout failed'
    );
  };

  // ================= ORDER OPERATIONS =================
  const fetchOrders = async () => {
    return handleApiCall(
      () => ordersAPI.getOrders(),
      (response) => setOrders(response.orders || response || [])
    );
  };

  const createOrder = async (orderData) => {
    return handleApiCall(
      () => ordersAPI.createOrder(orderData),
      (response) => {
        // Clear cart and add order
        setCart([]);
        setOrders(prev => [response, ...prev]);
      },
      'Failed to create order'
    );
  };

  const updateOrder = async (id, status) => {
    return handleApiCall(
      () => adminAPI.updateOrderStatus(id, status),
      (response) => {
        setOrders(prev => [response, ...prev]);
      },
      'Failed to update order'
    );
  };
  
  // ================= FILTER HELPERS =================
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      category: null,
      searchQuery: '',
      sortBy: 'title',
      priceRange: [0, 100],
      format: 'all'
    });
  };

  const getFilteredBooks = () => {
    let filtered = [...books];
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(book => 
        book.categories?.some(cat => cat.id === filters.category)
      );
    }
    
    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.description && book.description.toLowerCase().includes(query))
      );
    }
    
    // Apply format filter
    if (filters.format !== 'all') {
      filtered = filtered.filter(book => book.format === filters.format);
    }
    
    // Apply price filter
    filtered = filtered.filter(book => {
      const price = book.sale_price || book.list_price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
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

  // Calculate cart totals
  const cartTotal = cart.reduce((sum, item) => {
    const price = item.sale_price || item.list_price || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);
  
  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // ================= ADMIN OPERATIONS =================
  
  // Dashboard Stats
  const fetchAdminStats = async () => {
    console.log(user, 'here')
    if (!user || user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    
    return handleApiCall(
      () => adminAPI.getDashboardStats(),
      (response) => setAdminStats(response)
    );
  };

  // Users Management
  const fetchAdminUsers = async (params = {}) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    
    const queryParams = { ...adminFilters.users, ...params };
    
    return handleApiCall(
      () => adminAPI.getUsers(queryParams),
      (response) => {
        setAdminUsers(response.users);
        setAdminPagination(prev => ({
          ...prev,
          users: response.pagination
        }));
      }
    );
  };

  const updateAdminUser = async (userId, userData) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    
    return handleApiCall(
      () => adminAPI.updateUser(userId, userData),
      () => {
        // Refresh users list after update
        fetchAdminUsers();
      }
    );
  };

  // Orders Management
  const fetchAdminOrders = async (params = {}) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    
    const queryParams = { ...adminFilters.orders, ...params };
    
    return handleApiCall(
      () => adminAPI.getOrders(queryParams),
      (response) => {
        setAdminOrders(response.orders);
        setAdminPagination(prev => ({
          ...prev,
          orders: response.pagination
        }));
      }
    );
  };

  const updateOrderStatus = async (orderId, statusData) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    
    return handleApiCall(
      () => adminAPI.updateOrderStatus(orderId, statusData),
      () => {
        // Refresh orders list after update
        fetchAdminOrders();
        
        // Also refresh user's orders if it's their order
        const updatedOrder = adminOrders.find(o => o.id === orderId);
        if (updatedOrder && updatedOrder.user?.id === user.id) {
          fetchOrders();
        }
      }
    );
  };

  // Reviews Management
  const fetchAdminReviews = async (params = {}) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    
    const queryParams = { ...adminFilters.reviews, ...params };
    
    return handleApiCall(
      () => adminAPI.getReviews(queryParams),
      (response) => {
        setAdminReviews(response.reviews);
        setAdminPagination(prev => ({
          ...prev,
          reviews: response.pagination
        }));
      }
    );
  };

  const updateReviewStatus = async (reviewId, reviewData) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    
    return handleApiCall(
      () => adminAPI.updateReview(reviewId, reviewData),
      () => {
        // Refresh reviews list after update
        fetchAdminReviews();
      }
    );
  };

  // Update admin filters
  const updateAdminFilters = (type, newFilters) => {
    setAdminFilters(prev => ({
      ...prev,
      [type]: { ...prev[type], ...newFilters }
    }));
  };

  // Reset admin filters
  const resetAdminFilters = (type) => {
    const defaultFilters = {
      users: {
        search: '',
        role: '',
        status: '',
        sort: 'created_at',
        order: 'desc',
        page: 1,
        per_page: 20
      },
      orders: {
        status: '',
        start_date: '',
        end_date: '',
        search: '',
        sort: 'created_at',
        order: 'desc',
        page: 1,
        per_page: 20
      },
      reviews: {
        status: '',
        book_id: '',
        user_id: '',
        sort: 'created_at',
        order: 'desc',
        page: 1,
        per_page: 20
      }
    };
    
    setAdminFilters(prev => ({
      ...prev,
      [type]: defaultFilters[type]
    }));
  };
  
  // Modified getCurrentUser to check admin role
  const getCurrentUser = async () => {
    
    try {
      const response = await authAPI.getCurrentUser();
      
      if (response?.user) {
        setUser(response.user);

        // Fetch user data
        try {
          const [cartRes, wishlistRes] = await Promise.allSettled([
            cartAPI.getCart(),
            wishlistAPI.getWishlist()
          ]);
          
          if (cartRes.status === 'fulfilled') {
            setCart(cartRes.value.items || cartRes.value || []);
          }
          
          if (wishlistRes.status === 'fulfilled') {
            setWishlist(wishlistRes.value.items || wishlistRes.value || []);
          }
        } catch (err) {
          console.log('Error fetching user data:', err);
        }
      }
      return response;
    } catch (err) {
      // 401 is normal for unauthenticated users
      if (err.response?.status !== 401) {
        console.log('Auth check error:', err.message);
      }
      throw err;
    }
  };

  useEffect(() => {
  if (user?.role === 'admin') {
    fetchAdminStats();
    fetchAdminOrders()
    fetchReviews()
    fetchAdminUsers()
  }
}, [user]);


  // ================= INITIAL LOAD =================
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      
      try {
        // Load public data
        await Promise.allSettled([
          fetchBooks(),
          fetchCategories(),
          fetchFeaturedBooks()
        ]);
        
        // Try to get logged in user
        try {
          const response = await getCurrentUser();
          if (response?.user){
            fetchCart();
            fetchOrders();
            fetchWishlist();
          }
        } catch (err) {
          // Not logged in - this is normal
          console.log('User not logged in: ');
        }
      } catch (err) {
        setError('Failed to load initial data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  // ================= CONTEXT VALUE =================
  const contextValue = {
    // State
    books,
    categories,
    featuredBooks,
    wishlist,
    cart,
    orders,
    user,
    isLoading,
    error,
    filters,

    // Review state
    reviews,
    selectedReviews,
    activeReviewFilter,
    reviewSearchTerm,
    reviewStats,
    reviewFilterOptions,
    
    // Review operations
    fetchReviews,
    approveReview,
    rejectReview,
    updateReview,
    deleteReview,
    deleteSelectedReviews,
    addAdminResponse,
    setSelectedReviews,
    setActiveReviewFilter,
    setReviewSearchTerm,
    getFilteredReviews,
    
    // Admin state
    adminStats,
    adminUsers,
    adminOrders,
    adminReviews,
    adminPagination,
    adminFilters,
    updateOrder,
    updateOrderStatus,
    
    // Cart calculations
    cartTotal,
    cartItemCount,
    wishlistCount: wishlist.length,
    
    // Book operations
    fetchBooks,
    fetchCategories,
    fetchAdminUsers,
    fetchFeaturedBooks,
    
    // Cart operations
    fetchCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    
    // Wishlist operations
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    
    // User operations
    login,
    register,
    logout,
    getCurrentUser,
    
    // Order operations
    fetchOrders,
    createOrder,
    
    // Filter operations
    updateFilters,
    resetFilters,
    getFilteredBooks
  };

  return (
    <BookStore.Provider value={contextValue}>
      {children}
    </BookStore.Provider>
  );
};

// pip install -r requirements.txt && npm install --prefix client && npm run build --prefix client
// gunicorn server.app:app