import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  const initializeAuth = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('booknook_user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('booknook_user');
      }
    }
    setLoading(false);
  };

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('booknook_user');
      
      if (token && storedUser) {
        try {
          // Validate token with backend
          const response = await authAPI.validateToken();
          if (response.valid) {
            setUser(JSON.parse(storedUser));
          } else {
            // Token is invalid, clear storage
            clearAuth();
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          clearAuth();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Clear auth data
  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('booknook_user');
    setUser(null);
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      
      if (response.user && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('booknook_user', JSON.stringify(response.user));
        setUser(response.user);
        return { success: true, user: response.user };
      }
      
      return { success: false, error: response.error || 'Registration failed' };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      
      if (response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('booknook_user', JSON.stringify(response.user));
        console.log(response.user)
        setUser(response.user);
        return { success: true, user: response.user };
      }
      
      return { success: false, error: response.error || 'Login failed' };
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      if (response.user) {
        localStorage.setItem('booknook_user', JSON.stringify(response.user));
        setUser(response.user);
        return { success: true, user: response.user };
      }
      return { success: false, error: response.error || 'Update failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.is_admin || false;
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAdmin,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};