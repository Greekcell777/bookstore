import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, LogOut, Package, Heart, Settings, Bell, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useBookStore } from '../components/BookstoreContext';

const MinimalNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // Use SimpleBookStore context instead of AuthContext
  const { 
    user, 
    logout, 
    cart, 
    wishlist,
    cartItemCount,
    wishlistCount 
  } = useBookStore();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsUserDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    
    // Handle different user object structures
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    
    if (user.firstName && user.secondName) {
      return `${user.firstName.charAt(0)}${user.secondName.charAt(0)}`.toUpperCase();
    }
    
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    
    if (user.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return '';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    if (user.firstName && user.secondName) {
      return `${user.firstName} ${user.secondName}`;
    }
    
    if (user.name) {
      return user.name;
    }
    
    return user.email || 'User';
  };

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Menu */}
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BookNook
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/catalog" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Books
            </Link>
            <Link 
              to="/categories" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Categories
            </Link>
            <Link 
              to="/bestsellers" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Bestsellers
            </Link>
            {user?.is_admin && (
              <Link 
                to="/admin" 
                className="text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center"
              >
                <Settings size={16} className="mr-1" />
                Admin
              </Link>
            )}
          </div>

          {/* Right: Search & Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search books, authors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
            
            {/* Mobile Search */}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => navigate('/search')}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-md transition-colors">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-md transition-colors">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {user ? (
                // Logged In User
                <button 
                  className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitials()}
                  </div>
                </button>
              ) : (
                // Not Logged In
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  aria-label="User menu"
                >
                  <User size={20} />
                </button>
              )}
              
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border py-2 z-50">
                  {user ? (
                    // Logged In Dropdown
                    <>
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {getUserInitials()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[160px]">
                              {user.email || ''}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <User size={16} className="mr-3 text-gray-500" />
                        My Profile
                      </Link>
                      
                      <Link 
                        to="/orders" 
                        className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Package size={16} className="mr-3 text-gray-500" />
                        My Orders
                      </Link>
                      
                      <Link 
                        to="/wishlist" 
                        className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Heart size={16} className="mr-3 text-gray-500" />
                        Wishlist
                        {wishlistCount > 0 && (
                          <span className="ml-auto bg-red-100 text-red-800 text-xs rounded-full px-2 py-0.5">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                      
                      {user?.is_admin && (
                        <Link 
                          to="/admin" 
                          className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-t"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Settings size={16} className="mr-3 text-red-500" />
                          <span className="text-red-600 font-medium">Admin Dashboard</span>
                        </Link>
                      )}
                      
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-t text-red-600"
                      >
                        <LogOut size={16} className="mr-3" />
                        Logout
                      </button>
                    </>
                  ) : (
                    // Not Logged In Dropdown
                    <>
                      <div className="px-4 py-3 border-b">
                        <p className="font-medium text-sm text-gray-700">Welcome to BookNook</p>
                        <p className="text-xs text-gray-500">Sign in to access all features</p>
                      </div>
                      
                      <Link 
                        to="/login" 
                        className="flex items-center justify-center px-4 py-3 hover:bg-gray-50 text-sm font-medium text-blue-600"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <User size={16} className="mr-2" />
                        Sign In
                      </Link>
                      
                      <Link 
                        to="/register" 
                        className="flex items-center justify-center px-4 py-3 hover:bg-gray-50 text-sm border-t"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Create Free Account
                      </Link>
                      
                      <div className="px-4 py-3 border-t text-xs text-gray-500">
                        <p className="font-medium mb-1">Member Benefits:</p>
                        <ul className="space-y-1">
                          <li className="flex items-center">
                            <Heart size={12} className="mr-2 text-green-500" />
                            Save to wishlist
                          </li>
                          <li className="flex items-center">
                            <Package size={12} className="mr-2 text-green-500" />
                            Track orders
                          </li>
                          <li className="flex items-center">
                            <Bell size={12} className="mr-2 text-green-500" />
                            Exclusive deals
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t animate-slide-down">
            <div className="flex flex-col space-y-1">
              {/* Search in Mobile Menu */}
              <form onSubmit={handleSearch} className="px-4 pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search books..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>
              
              <Link 
                to="/catalog" 
                className="px-4 py-3 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Books
              </Link>
              
              <Link 
                to="/categories" 
                className="px-4 py-3 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              
              <Link 
                to="/bestsellers" 
                className="px-4 py-3 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Bestsellers
              </Link>
              
              {user ? (
                <>
                  <div className="px-4 py-3 border-t mt-2">
                    <p className="text-sm font-medium text-gray-500">My Account</p>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    className="px-4 py-3 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  
                  <Link 
                    to="/orders" 
                    className="px-4 py-3 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  
                  <Link 
                    to="/wishlist" 
                    className="px-4 py-3 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>
                  
                  <Link 
                    to="/cart" 
                    className="px-4 py-3 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart {cartItemCount > 0 && `(${cartItemCount})`}
                  </Link>
                  
                  {user?.is_admin && (
                    <Link 
                      to="/admin" 
                      className="px-4 py-3 hover:bg-gray-50 rounded-md transition-colors text-red-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-3 hover:bg-gray-50 rounded-md transition-colors text-left text-red-600 border-t mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 border-t mt-2">
                    <p className="text-sm font-medium text-gray-500">Account</p>
                  </div>
                  
                  <Link 
                    to="/login" 
                    className="px-4 py-3 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  
                  <Link 
                    to="/register" 
                    className="px-4 py-3 hover:bg-gray-50 rounded-md transition-colors font-medium text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MinimalNavbar;