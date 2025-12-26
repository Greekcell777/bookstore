import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  AlertCircle,
  Smartphone,
  Check,
  ChevronLeft,
  BookOpen,
  Loader2
} from 'lucide-react';
import { useAuth } from './AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    email: '',
    phone: '',
    password: 'Fr@nk2024',
    confirmPassword: 'Fr@nk2024',
    acceptTerms: false,
    newsletter: true
  });

  // Password strength checker
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ''
  });
  
  const {register} = useAuth()
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }

    // Check password match
    if (name === 'confirmPassword' || name === 'password') {
      if (formData.password && formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        } else {
          setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
      }
    }
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = '';

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        message = 'Very weak';
        break;
      case 2:
        message = 'Weak';
        break;
      case 3:
        message = 'Good';
        break;
      case 4:
        message = 'Strong';
        break;
      default:
        message = '';
    }

    setPasswordStrength({ score, message });
  };

  // Get password strength color
  const getStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  // Handle form submission with backend integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for backend
      const userData = {
        firstName: formData.firstName.trim(),
        secondName: formData.secondName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        password: formData.password,
        username: formData.email.trim().split('@')[0] // Generate username from email
      };

      // Call backend API
      const response = await register(userData);
      
      if (response.user && response.token) {
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('booknook_user', JSON.stringify(response.user));
        
        // Show success message
        alert('Registration successful! You are now logged in.');
        
        // Redirect to dashboard or home page
        navigate('/profile');
      } else {
        throw new Error(response.error || 'Registration failed');
      }
      
    } catch (error) {
      // Handle specific error cases
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message.includes('Email already registered')) {
        setErrors({ email: 'This email is already registered. Please use a different email or login.' });
      } else if (error.message.includes('Invalid email format')) {
        setErrors({ email: 'Please enter a valid email address.' });
      } else if (error.message.includes('password')) {
        setErrors({ password: 'Password requirements not met. Please use a stronger password.' });
      } else {
        setErrors({ general: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle API response errors
  const handleApiError = (error) => {
    console.error('Registration error:', error);
    
    // Map backend error messages to form errors
    if (error.includes('already exists') || error.includes('already registered')) {
      return { email: 'This email is already registered. Please use a different email or login.' };
    } else if (error.includes('Invalid email')) {
      return { email: 'Please enter a valid email address.' };
    } else if (error.includes('password')) {
      return { password: 'Password requirements not met. Please use a stronger password.' };
    } else {
      return { general: error };
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-8 group"
        >
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center border-b border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-full mb-6">
              <BookOpen size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join BookNook</h1>
            <p className="text-gray-600">Create your account and start your reading journey</p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
              <span className="text-red-700 text-sm">{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="John"
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="secondName"
                    value={formData.secondName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Doe"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
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
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone (Optional) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-gray-500 text-sm">(Optional)</span>
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+254712345678"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Create a password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Password strength:</span>
                      <span className={`text-sm font-medium ${
                        passwordStrength.score === 0 ? 'text-red-600' :
                        passwordStrength.score === 1 ? 'text-red-600' :
                        passwordStrength.score === 2 ? 'text-orange-600' :
                        passwordStrength.score === 3 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength.message}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Password must contain at least 8 characters including uppercase, lowercase, number, and special character
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Checkboxes */}
              <div className="md:col-span-2 space-y-4">
                {/* Terms & Conditions */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    id="acceptTerms"
                    disabled={isLoading}
                  />
                  <label htmlFor="acceptTerms" className="ml-3 text-sm text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.acceptTerms}
                  </p>
                )}

                {/* Newsletter */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    id="newsletter"
                    disabled={isLoading}
                  />
                  <label htmlFor="newsletter" className="ml-3 text-sm text-gray-700">
                    Send me reading recommendations, updates, and exclusive offers via email
                  </label>
                </div>
              </div>

              {/* Benefits List */}
              <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Account Benefits:</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center">
                    <Check size={16} className="mr-2 text-green-500" />
                    Save books to your wishlist
                  </li>
                  <li className="flex items-center">
                    <Check size={16} className="mr-2 text-green-500" />
                    Track your reading progress
                  </li>
                  <li className="flex items-center">
                    <Check size={16} className="mr-2 text-green-500" />
                    Get personalized recommendations
                  </li>
                  <li className="flex items-center">
                    <Check size={16} className="mr-2 text-green-500" />
                    Access exclusive member discounts
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="border-t border-gray-200 p-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Lock size={14} className="mr-2" />
            <span>Your personal information is protected with industry-standard encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;