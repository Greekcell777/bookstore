// context/SimpleBookStore.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { booksAPI, cartAPI, wishlistAPI, ordersAPI, authAPI } from '../services/api';

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

  // ================= USER OPERATIONS =================
  const login = async (credentials) => {
    return handleApiCall(
      () => authAPI.login(credentials),
      async (response) => {
        if (response?.user) {
          setUser(response.user);
          console.log(user)
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

  const getCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response?.user) {
        setUser(response.user);
        console.log(user)
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
          if (response.user){
            fetchCart()
            fetchOrders()
            fetchWishlist
          }
        } catch (err) {
          // Not logged in - this is normal
          console.log('User not logged in');
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
    
    // Cart calculations
    cartTotal,
    cartItemCount,
    wishlistCount: wishlist.length,
    
    // Book operations
    fetchBooks,
    fetchCategories,
    fetchFeaturedBooks,
    
    // Cart operations
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
    
    // Wishlist operations
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    
    // User operations
    login,
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