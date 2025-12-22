import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings, Package, Heart } from 'lucide-react';
import { Link } from 'react-router';

const MinimalNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Change this to your actual auth state
  const dropdownRef = useRef(null);

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

  // Mock login/logout functions - replace with your actual auth logic
  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsUserDropdownOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo & Menu */}
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <Link to="/" className="text-xl font-bold text-blue-600">
              BookNook
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/catalog" className="text-gray-700 hover:text-blue-600">Books</Link>
            <Link to="/categories" className="text-gray-700 hover:text-blue-600">Categories</Link>
            <Link to="/bestsellers" className="text-gray-700 hover:text-blue-600">Bestsellers</Link>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border rounded-full w-64 text-sm"
              />
            </div>
            
            {/* Mobile Search */}
            <button className="md:hidden p-2">
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link to='/cart'>
            <button className="relative p-2">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>
            </Link>
            

            {/* User - Modified Section */}
            <div className="relative" ref={dropdownRef}>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <User size={20} />
              </button>
              
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                  {isLoggedIn ? (
                    // Logged In Dropdown
                    <>
                      <div className="px-4 py-3 border-b">
                        <p className="font-medium text-sm">John Doe</p>
                        <p className="text-xs text-gray-500">john@example.com</p>
                      </div>
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <User size={16} className="mr-3" />
                        My Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Package size={16} className="mr-3" />
                        My Orders
                      </Link>
                      <Link 
                        to="/wishlist" 
                        className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Heart size={16} className="mr-3" />
                        Wishlist
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-50 text-sm text-red-600 border-t mt-1"
                      >
                        <LogOut size={16} className="mr-3" />
                        Logout
                      </button>
                    </>
                  ) : (
                    // Not Logged In Dropdown
                    <>
                      <Link 
                        to="/login" 
                        className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm font-medium"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <User size={16} className="mr-3" />
                        Sign In
                      </Link>
                      <Link 
                        to="/register" 
                        className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm border-t"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Create Account
                      </Link>
                      <div className="px-4 py-3 border-t text-xs text-gray-500">
                        <p>Access your orders, wishlist, and more</p>
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
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link to="/catalog" className="py-2">All Books</Link>
              <Link to="/categories" className="py-2">Categories</Link>
              <Link to="/bestsellers" className="py-2">Bestsellers</Link>
              <Link to="/sale" className="py-2 text-red-600 font-semibold">Sale</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="py-2">My Profile</Link>
                  <Link to="/orders" className="py-2">My Orders</Link>
                  <button onClick={handleLogout} className="py-2 text-left text-red-600 border-t pt-4">Logout</button>
                </>
              ) : (
                <Link to="/login" className="py-2 mt-4 border-t pt-4">Sign In</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MinimalNavbar;