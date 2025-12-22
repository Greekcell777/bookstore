import React, { createContext, useState, useContext, useEffect } from 'react';

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

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('booknook_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 1,
            email,
            name: 'John Doe',
            token: 'fake-jwt-token'
          });
        }, 1500);
      });

      setUser(response);
      localStorage.setItem('booknook_user', JSON.stringify(response));
      return { success: true };
    } catch (error) {
      return { success: false, error: `Invalid credentials ${error}` };
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now(),
            ...userData,
            token: 'fake-jwt-token'
          });
        }, 2000);
      });

      setUser(response);
      localStorage.setItem('booknook_user', JSON.stringify(response));
      return { success: true };
    } catch (error) {
      return { success: false, error: `Registration failed${error}` };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('booknook_user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};