// Login component - Updated to redirect admins to admin dashboard
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, AlertCircle,
  BookOpen, ChevronLeft, Loader2, Shield
} from 'lucide-react';
import { useBookStore } from './BookstoreContext'; // Use BookStoreContext directly

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Use BookStoreContext
  const { login, user } = useBookStore();
  
  // Display message from redirect
  useEffect(() => {
    if (location.state?.message) {
      alert(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await login(formData);
      console.log('Login response:', response);
      
      // Check if user is admin
      if (response?.user?.role === 'admin') {
        // Redirect admin to admin dashboard
        const adminRedirect = location.state?.adminRedirect || '/admin';
        
        // Show admin welcome message
        setTimeout(() => {
          alert(`Welcome back, Admin ${response.user.first_name || response.user.username}!`);
        }, 100);
        
        // Check for pending actions
        const pendingActions = JSON.parse(localStorage.getItem('pendingActions') || '[]');
        if (pendingActions.length > 0) {
          // Clear pending actions for admin (they might want to handle differently)
          localStorage.removeItem('pendingActions');
          localStorage.removeItem('redirectAfterLogin');
        }
        
        navigate(adminRedirect, { replace: true });
      } else {
        // Regular user login flow
        const pendingActions = JSON.parse(localStorage.getItem('pendingActions') || '[]');
        const redirectAfterLogin = localStorage.getItem('redirectAfterLogin') || '/';
        
        // Show success message
        if (pendingActions.length > 0) {
          const cartActions = pendingActions.filter(a => a.type === 'addToCart');
          const wishlistActions = pendingActions.filter(a => a.type === 'addToWishlist');
          
          let message = 'Login successful!';
          if (cartActions.length > 0) {
            message += `\nAdded ${cartActions.length} item${cartActions.length > 1 ? 's' : ''} to your cart.`;
          }
          if (wishlistActions.length > 0) {
            message += `\nAdded ${wishlistActions.length} item${wishlistActions.length > 1 ? 's' : ''} to your wishlist.`;
          }
          alert(message);
          
          // Clear pending actions
          localStorage.removeItem('pendingActions');
          localStorage.removeItem('redirectAfterLogin');
          
          // Redirect to original page
          navigate(redirectAfterLogin, { replace: true });
        } else {
          // No pending actions, redirect based on location state or home
          const from = location.state?.redirectTo || 
                      location.state?.from?.pathname || 
                      '/';
          navigate(from, { replace: true });
        }
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.response?.data?.message || error.message || 'Invalid email or password. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  // Demo login for regular user
  const handleDemoLogin = async () => {
    setFormData({
      email: 'demo@booknook.com',
      password: 'demo123',
      rememberMe: false
    });
    
    setTimeout(() => {
      document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));
    }, 100);
  };

  // Admin demo login
  const handleAdminDemoLogin = async () => {
    setFormData({
      email: 'admin@booknook.com',
      password: 'admin123',
      rememberMe: false
    });
    
    setTimeout(() => {
      document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));
    }, 100);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-8 group">
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-full mb-6">
              <BookOpen size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your BookTopia account</p>
            
            {/* Role indicator */}
            <div className="mt-4 flex justify-center space-x-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                <BookOpen size={12} className="mr-1" />
                Customer Access
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
                <Shield size={12} className="mr-1" />
                Admin Access
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mx-8 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
              <span className="text-red-700 text-sm">{errors.general}</span>
            </div>
          )}

          

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8">
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  id="rememberMe"
                />
                <label htmlFor="rememberMe" className="ml-3 text-sm text-gray-700">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="border-t border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-2">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                Create an account
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Admin access requires special permissions. Contact system administrator.
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Lock size={14} className="mr-2" />
            <span>Your data is securely encrypted and protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;