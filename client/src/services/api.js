const API_URL = 'http://127.0.0.1:5555';


function getCSRFToken() {
    const name = 'csrf_access_token';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Helper function for API calls with Fetch
const apiRequest = async (endpoint, method = 'GET', data = null, requireAuth = true) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials :"include",
  };

  // Add auth token if required and available
  if (requireAuth) {
      config.headers["X-CSRF-TOKEN"] = getCSRFToken() 
    
  }

  // Add request body if provided
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      // Try to parse error message from response
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        console.log(errorData, 1)
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Parse successful response
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// services/api.js - Add this section with your other APIs

// Admin API calls
export const adminAPI = {
  // ================= DASHBOARD STATS =================
  getDashboardStats: async () => {
    console.log('Getting stats')
    return await apiRequest('/api/admin/dashboard/stats', 'GET', null, true);
  },

  // ================= USER MANAGEMENT =================
  getUsers: async (params = {}) => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    // Add all parameters that exist
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    
    const queryString = queryParams.toString();
    const url = `/api/admin/users${queryString ? `?${queryString}` : ''}`;
    return await apiRequest(url, 'GET', null, true);
  },

  updateUser: async (userId, userData) => {
    return await apiRequest(`/api/admin/users/${userId}`, 'PUT', userData, true);
  },

  // ================= ORDER MANAGEMENT =================
  getOrders: async (params = {}) => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.status) queryParams.append('status', params.status);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    
    const queryString = queryParams.toString();
    const url = `/api/admin/orders${queryString ? `?${queryString}` : ''}`;
    return await apiRequest(url, 'GET', null, true);
  },

  updateOrderStatus: async (orderId, statusData) => {
    return await apiRequest(
      `/api/admin/orders/${orderId}/status`, 
      'PUT', 
      statusData, 
      true
    );
  },

  // ================= REVIEW MANAGEMENT =================
  getReviews: async (params = {}) => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    if (params.status) queryParams.append('status', params.status);
    if (params.book_id) queryParams.append('book_id', params.book_id);
    if (params.user_id) queryParams.append('user_id', params.user_id);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    
    const queryString = queryParams.toString();
    const url = `/api/admin/reviews${queryString ? `?${queryString}` : ''}`;
    return await apiRequest(url, 'GET', null, true);
  },

  updateReview: async (reviewId, reviewData) => {
    return await apiRequest(
      `/api/admin/reviews/${reviewId}`, 
      'PUT', 
      reviewData, 
      true
    );
  },

  // ================= ADDITIONAL ADMIN ENDPOINTS =================
  
  // Get system statistics
  getSystemStats: async () => {
    return await apiRequest('/api/admin/system-stats', 'GET', null, true);
  },

  // Get recent activities
  getRecentActivities: async (limit = 50) => {
    return await apiRequest(`/api/admin/activities?limit=${limit}`, 'GET', null, true);
  },

  // Export data
  exportData: async (type, format = 'json') => {
    return await apiRequest(`/api/admin/export/${type}?format=${format}`, 'GET', null, true);
  }
};

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    console.log("Logging in")
    return await apiRequest('/api/login', 'POST', credentials, false);
  },

  register: async (userData) => {
    return await apiRequest('/api/register', 'POST', userData, false);
  },

  logout: async () => {
    console.log('Logging out')
    return await apiRequest('/api/logout', 'POST', null, true);
  },

  getCurrentUser: async () => {
    return await apiRequest('/api/login', 'GET', null, true);
  },

  validateToken: async () => {
    return await apiRequest('/api/login', 'GET', null, true);
  },

  updateProfile: async (userData) => {
    return await apiRequest('/api/auth/profile', 'PUT', userData, true);
  },

  changePassword: async (passwordData) => {
    return await apiRequest('/api/auth/change-password', 'POST', passwordData, true);
  }
};

// Books API calls
export const booksAPI = {
  // Get all books with optional filters
  getBooks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/books${queryString ? `?${queryString}` : ''}`;
    return await apiRequest(url, 'GET', null, false);
  },

  // Get single book by ID
  getBook: async (id) => {
    return await apiRequest(`/api/books/${id}`, 'GET', null, false);
  },

  // Get featured books
  getFeaturedBooks: async () => {
    return await apiRequest('/api/books/featured', 'GET', null, false);
  },

  // Get bestsellers
  getBestsellers: async () => {
    return await apiRequest('/api/books/bestsellers', 'GET', null, false);
  },

  // Get categories
  getCategories: async () => {
    return await apiRequest('/api/categories', 'GET', null, false);
  },

  // Search books
  searchBooks: async (query, limit = 10) => {
    return await apiRequest(`/api/books/search?q=${encodeURIComponent(query)}&limit=${limit}`, 'GET', null, false);
  },

  // Create book (admin only)
  createBook: async (bookData) => {
    return await apiRequest('/api/admin/books', 'POST', bookData, true);
  },

  // Update book (admin only)
  updateBook: async (id, bookData) => {
    return await apiRequest(`/api/admin/books/${id}`, 'PUT', bookData, true);
  },

  // Delete book (admin only)
  deleteBook: async (id) => {
    return await apiRequest(`/api/admin/books/${id}`, 'DELETE', null, true);
  }
};

// Cart API calls
export const cartAPI = {
  // Get cart items
  getCart: async () => {
    return await apiRequest('/api/cart', 'GET', null, true);
  },

  // Add item to cart
  addToCart: async (bookId, quantity = 1) => {
    return await apiRequest('/api/cart/items', 'POST', { bookId, quantity }, true);
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    return await apiRequest(`/api/cart/items/${itemId}`, 'PUT', { quantity }, true);
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    return await apiRequest(`/api/cart/items/${itemId}`, 'DELETE', null, true);
  },

  // Clear cart
  clearCart: async () => {
    return await apiRequest('/api/cart', 'DELETE', null, true);
  }
};

// Orders API calls
export const ordersAPI = {
  // Create order
  createOrder: async (orderData) => {
    return await apiRequest('/api/orders', 'POST', orderData, true);
  },

  // Get user's orders
  getOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/orders${queryString ? `?${queryString}` : ''}`;
    return await apiRequest(url, 'GET', null, true);
  },

  // Get single order
  getOrder: async (orderId) => {
    return await apiRequest(`/api/orders/${orderId}`, 'GET', null, true);
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    return await apiRequest(`/api/orders/${orderId}/cancel`, 'POST', null, true);
  }
};

// Reviews API calls
export const reviewsAPI = {
  // Get reviews for a book
  getBookReviews: async (bookId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/books/${bookId}/reviews${queryString ? `?${queryString}` : ''}`;
    return await apiRequest(url, 'GET', null, false);
  },

  // Create review
  createReview: async (bookId, reviewData) => {
    return await apiRequest(`/api/books/${bookId}/reviews`, 'POST', reviewData, true);
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    return await apiRequest(`/api/reviews/${reviewId}`, 'PUT', reviewData, true);
  },

  // Delete review
  deleteReview: async (reviewId) => {
    return await apiRequest(`/api/reviews/${reviewId}`, 'DELETE', null, true);
  },

  // Mark review as helpful
  markHelpful: async (reviewId) => {
    return await apiRequest(`/api/reviews/${reviewId}/helpful`, 'POST', null, true);
  },

  // Mark review as unhelpful
  markUnhelpful: async (reviewId) => {
    return await apiRequest(`/api/reviews/${reviewId}/unhelpful`, 'POST', null, true);
  }
};

// Admin API calls
// export const adminAPI = {
//   // Dashboard stats
//   getDashboardStats: async () => {
//     return await apiRequest('/api/admin/dashboard/stats', 'GET', null, true);
//   },

//   // Get all users
//   getUsers: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/admin/users${queryString ? `?${queryString}` : ''}`;
//     return await apiRequest(url, 'GET', null, true);
//   },

//   // Update user
//   updateUser: async (userId, userData) => {
//     return await apiRequest(`/api/admin/users/${userId}`, 'PUT', userData, true);
//   },

//   // Get all orders (admin)
//   getAllOrders: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/admin/orders${queryString ? `?${queryString}` : ''}`;
//     return await apiRequest(url, 'GET', null, true);
//   },

//   // Update order status
//   updateOrderStatus: async (orderId, status) => {
//     return await apiRequest(`/api/admin/orders/${orderId}/status`, 'PUT', { status }, true);
//   },

//   // Get all reviews (admin)
//   getAllReviews: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/admin/reviews${queryString ? `?${queryString}` : ''}`;
//     return await apiRequest(url, 'GET', null, true);
//   },

//   // Update review status
//   updateReviewStatus: async (reviewId, status, adminResponse = null) => {
//     const data = { status };
//     if (adminResponse) data.admin_response = adminResponse;
//     return await apiRequest(`/api/admin/reviews/${reviewId}`, 'PUT', data, true);
//   }
// };

// Wishlist API calls
export const wishlistAPI = {
  // Get wishlist
  getWishlist: async () => {
    return await apiRequest('/api/wishlist', 'GET', null, true);
  },

  // Add to wishlist
  addToWishlist: async (bookId) => {
    return await apiRequest('/api/wishlist/items', 'POST', { bookId }, true);
  },

  // Remove from wishlist
  removeFromWishlist: async (itemId) => {
    return await apiRequest(`/api/wishlist/items/${itemId}`, 'DELETE', null, true);
  },

  // Move to cart
  moveToCart: async (itemId) => {
    return await apiRequest(`/api/wishlist/items/${itemId}/move-to-cart`, 'POST', null, true);
  }
};

// Export all API services
export default {
  auth: authAPI,
  books: booksAPI,
  cart: cartAPI,
  orders: ordersAPI,
  reviews: reviewsAPI,
  admin: adminAPI,
  wishlist: wishlistAPI
};