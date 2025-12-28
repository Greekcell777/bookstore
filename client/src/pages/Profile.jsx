import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Camera, Upload, Check, Package, Heart, MessageCircle, Calendar } from 'lucide-react';
import { useBookStore } from '../components/BookstoreContext';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  // Use BookStore context
  const {
    user,
    orders,
    wishlist,
    cart,
    logout,
    isLoading,
    error,
    getCurrentUser,
    // Note: You may need to add updateUserProfile and changePassword methods to your context
  } = useBookStore();

  // User profile data state - initialize from context
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    bio: 'Book enthusiast and avid reader. Love collecting vintage books and exploring new genres.',
    preferences: {
      emailNotifications: true,
      newsletter: true,
      promotionalOffers: false,
      orderUpdates: true,
    },
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load user data from context
  useEffect(() => {
    if (user) {
      setUserData(prev => ({
        ...prev,
        fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || prev.bio,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (preference) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: !prev.preferences[preference]
      }
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // In a real app, you would make an API call to update the profile
      // For now, we'll simulate it and update the context if you have an updateUser method
      console.log('Saving profile:', userData);
      
      // If you have an updateUser method in your context, call it here:
      // await updateUserProfile(userData);
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    try {
      // In a real app, you would make an API call to change password
      // For now, we'll simulate it
      console.log('Changing password:', passwordData);
      
      // If you have a changePassword method in your context, call it here:
      // await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('Password changed successfully!');
    } catch (err) {
      console.error('Error changing password:', err);
      alert('Failed to change password');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (err) {
      console.error('Error logging out:', err);
      alert('Failed to logout');
    }
  };

  // Calculate stats from context
  const stats = {
    orders: orders?.length || 0,
    wishlist: wishlist?.length || 0,
    cartItems: cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0,
    memberSince: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Recently',
  };

  // Loading state
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If no user is logged in, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => window.location.href = '/register'}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : user.profile_image ? (
                      <img 
                        src={user.profile_image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={64} className="text-blue-600" />
                    )}
                  </div>
                  <label htmlFor="profileImage" className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                    <Camera size={16} />
                    <input
                      type="file"
                      id="profileImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                    />
                  </label>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{userData.fullName}</h2>
                <p className="text-gray-600 text-sm">{userData.email}</p>
                <span className="mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {user.role || 'Member'}
                </span>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <User size={20} className="mr-3" />
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Lock size={20} className="mr-3" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeTab === 'preferences' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Check size={20} className="mr-3" />
                  Preferences
                </button>
              </nav>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
              <h3 className="font-semibold text-gray-900 mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <Package size={16} className="mr-2" />
                    <span>Orders</span>
                  </div>
                  <span className="font-semibold">{stats.orders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <Heart size={16} className="mr-2" />
                    <span>Wishlist</span>
                  </div>
                  <span className="font-semibold">{stats.wishlist}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <Package size={16} className="mr-2" />
                    <span>Cart Items</span>
                  </div>
                  <span className="font-semibold">{stats.cartItems}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <MessageCircle size={16} className="mr-2" />
                    <span>Reviews</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>Member Since</span>
                  </div>
                  <span className="font-semibold text-sm">{stats.memberSince}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  My Orders
                </a>
                <a href="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  My Wishlist
                </a>
                <a href="/cart" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  My Cart
                </a>
                <a href="/addresses" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  Address Book
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                  <button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                  >
                    {isEditing ? (
                      <>
                        <Check size={20} className="mr-2" />
                        Save Changes
                      </>
                    ) : 'Edit Profile'}
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="flex items-center p-3 border rounded-lg">
                        <User size={20} className="text-gray-400 mr-3" />
                        <input
                          type="text"
                          name="fullName"
                          value={userData.fullName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="flex-1 outline-none disabled:bg-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center p-3 border rounded-lg">
                        <Mail size={20} className="text-gray-400 mr-3" />
                        <input
                          type="email"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="flex-1 outline-none disabled:bg-transparent"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="flex items-center p-3 border rounded-lg">
                        <Phone size={20} className="text-gray-400 mr-3" />
                        <input
                          type="tel"
                          name="phone"
                          value={userData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="flex-1 outline-none disabled:bg-transparent"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <div className="flex items-center p-3 border rounded-lg">
                        <MapPin size={20} className="text-gray-400 mr-3" />
                        <input
                          type="text"
                          name="address"
                          value={userData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="flex-1 outline-none disabled:bg-transparent"
                          placeholder="Enter your address"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={userData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="4"
                      className="w-full p-3 border rounded-lg outline-none resize-none disabled:bg-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Display context error if any */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <div className="flex items-center p-3 border rounded-lg">
                            <Lock size={20} className="text-gray-400 mr-3" />
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="flex-1 outline-none"
                              placeholder="Enter current password"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="flex items-center p-3 border rounded-lg">
                            <Lock size={20} className="text-gray-400 mr-3" />
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="flex-1 outline-none"
                              placeholder="Enter new password"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="flex items-center p-3 border rounded-lg">
                            <Lock size={20} className="text-gray-400 mr-3" />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="flex-1 outline-none"
                              placeholder="Confirm new password"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleChangePassword}
                        disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        className={`px-4 py-2 rounded-lg transition ${!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-medium text-red-800 mb-2">Delete Account</p>
                      <p className="text-sm text-red-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      {Object.entries(userData.preferences).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-600">
                              {key === 'emailNotifications' && 'Receive notifications via email'}
                              {key === 'newsletter' && 'Weekly newsletter with book recommendations'}
                              {key === 'promotionalOffers' && 'Special offers and discounts'}
                              {key === 'orderUpdates' && 'Order status and shipping updates'}
                            </p>
                          </div>
                          <button
                            onClick={() => handlePreferenceChange(key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Language
                        </label>
                        <select className="w-full p-2 border rounded-lg">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Theme
                        </label>
                        <select className="w-full p-2 border rounded-lg">
                          <option>Light</option>
                          <option>Dark</option>
                          <option>System</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex justify-end">
                      <button 
                        onClick={() => {
                          // Save preferences logic here
                          alert('Preferences saved!');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;