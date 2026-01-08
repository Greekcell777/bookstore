import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Phone, MapPin, Calendar, Package, 
  DollarSign, Star, CheckCircle, XCircle, Clock, 
  MessageSquare, Save, Edit, CreditCard, ShoppingBag,
  Tag, Home, Globe, Lock, Bell, UserPlus, Download
} from 'lucide-react';

const CustomerModal = ({ isOpen, onClose, mode = 'view', initialData = null, onSave }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    emailVerified: false,
    phoneVerified: false,
    membershipTier: 'Bronze',
    favoriteCategory: '',
    notes: '',
    communicationPreferences: {
      email: true,
      sms: false,
      newsletter: true,
      promotions: false
    }
  });

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.first_name || '',
        lastName: initialData.second_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: (initialData.address ? Object.values(initialData.address).map(i=>i).join(', ') :  ''),
        status: initialData.status || 'active',
        emailVerified: initialData.emailVerified || false,
        phoneVerified: initialData.phoneVerified || false,
        membershipTier: initialData.membershipTier || 'Bronze',
        favoriteCategory: initialData.favoriteCategory || '',
        notes: initialData.notes || '',
        communicationPreferences: initialData.communicationPreferences || {
          email: true,
          sms: false,
          newsletter: true,
          promotions: false
        }
      });
    } else if (mode === 'add') {
      // Reset form for new customer
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
        emailVerified: false,
        phoneVerified: false,
        membershipTier: 'Bronze',
        favoriteCategory: '',
        notes: '',
        communicationPreferences: {
          email: true,
          sms: false,
          newsletter: true,
          promotions: false
        }
      });
    }
  }, [initialData, mode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('communication.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        communicationPreferences: {
          ...prev.communicationPreferences,
          [prefKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      console.log(formData)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const customerData = {
        ...formData,
        id: initialData?.id || Math.floor(Math.random() * 1000) + 200,
        registrationDate: initialData?.registrationDate || new Date().toISOString().split('T')[0],
        lastLogin: initialData?.lastLogin || null,
        totalOrders: initialData?.totalOrders || 0,
        totalSpent: initialData?.totalSpent || 0,
        averageOrderValue: initialData?.averageOrderValue || 0,
        recentOrders: initialData?.recentOrders || [],
        tags: initialData?.tags || []
      };

      if (onSave) {
        onSave(customerData);
      }

      setLoading(false);
      onClose();
    }, 1500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipColor = (tier) => {
    switch (tier) {
      case 'Platinum': return 'bg-gradient-to-r from-gray-700 to-gray-900 text-white';
      case 'Gold': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'Silver': return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900';
      case 'Bronze': return 'bg-gradient-to-r from-amber-700 to-amber-800 text-white';
      case 'New': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModalTitle = () => {
    if (mode === 'add') return 'Add New Customer';
    if (mode === 'edit') return 'Edit Customer';
    return `${initialData?.firstName} ${initialData?.lastName}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h2>
                <p className="text-sm text-gray-600">
                  {mode === 'view' ? 'Customer details and statistics' : 
                   mode === 'edit' ? 'Update customer information' : 
                   'Add a new customer to your database'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="px-6 flex space-x-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'preferences' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'activity' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Activity
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-160px)] p-6">
            <form onSubmit={handleSubmit}>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Customer Information */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="w-full p-3 border rounded-lg outline-none disabled:bg-gray-50"
                            placeholder="Enter first name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="w-full p-3 border rounded-lg outline-none disabled:bg-gray-50"
                            placeholder="Enter last name"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <div className="flex items-center">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={mode === 'view'}
                              className="flex-1 p-3 border rounded-lg outline-none disabled:bg-gray-50"
                              placeholder="customer@example.com"
                              required
                            />
                            {mode !== 'view' && (
                              <label className="ml-4 flex items-center">
                                <input
                                  type="checkbox"
                                  name="emailVerified"
                                  checked={formData.emailVerified}
                                  onChange={handleInputChange}
                                  className="h-4 w-4 text-blue-600 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">Verified</span>
                              </label>
                            )}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="flex items-center">
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              disabled={mode === 'view'}
                              className="flex-1 p-3 border rounded-lg outline-none disabled:bg-gray-50"
                              placeholder="+1 (555) 123-4567"
                            />
                            {mode !== 'view' && (
                              <label className="ml-4 flex items-center">
                                <input
                                  type="checkbox"
                                  name="phoneVerified"
                                  checked={formData.address.city}
                                  onChange={handleInputChange}
                                  className="h-4 w-4 text-blue-600 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">Verified</span>
                              </label>
                            )}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            rows="3"
                            className="w-full p-3 border rounded-lg outline-none resize-none disabled:bg-gray-50"
                            placeholder="Enter full address"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Notes</h3>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        disabled={mode === 'view'}
                        rows="4"
                        className="w-full p-3 border rounded-lg outline-none resize-none disabled:bg-gray-50"
                        placeholder="Add notes about this customer..."
                      />
                    </div>
                  </div>

                  {/* Right Column - Status & Stats */}
                  <div className="space-y-6">
                    {/* Customer Status */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Customer Status</h3>
                      {mode === 'view' ? (
                        <div className="space-y-4">
                          <div>
                            {/* <span className={`px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(initialData.status)} inline-block`}>
                              {initialData.status.charAt(0).toUpperCase() + initialData.status.slice(1)}
                            </span> */}
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Membership Tier</p>
                            <span className={`px-3 py-2 rounded-lg text-sm font-medium ${getMembershipColor(initialData.membershipTier)} inline-block mt-1`}>
                              {initialData.membershipTier}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Status
                            </label>
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                              className="w-full p-3 border rounded-lg outline-none"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="suspended">Suspended</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Membership Tier
                            </label>
                            <select
                              name="membershipTier"
                              value={formData.membershipTier}
                              onChange={handleInputChange}
                              className="w-full p-3 border rounded-lg outline-none"
                            >
                              <option value="New">New</option>
                              <option value="Bronze">Bronze</option>
                              <option value="Silver">Silver</option>
                              <option value="Gold">Gold</option>
                              <option value="Platinum">Platinum</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Statistics */}
                    {mode === 'view' && initialData && (
                      <div className="bg-white border rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Customer Statistics</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Orders</span>
                            <span className="font-bold">{initialData.order_count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Spent</span>
                            <span className="font-bold">{formatCurrency(initialData.totalSpent)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average Order Value</span>
                            <span className="font-bold">{formatCurrency(initialData.averageOrderValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Favorite Category</span>
                            <span className="font-bold">{initialData.favoriteCategory}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Registration Date</span>
                            <span className="font-bold">{formatDate(initialData.created_at)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Login</span>
                            <span className="font-bold">
                              {initialData.lastLogin 
                                ? new Date(initialData.lastLogin).toLocaleDateString()
                                : ''
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {mode === 'view' && initialData?.tags && initialData.tags.length > 0 && (
                      <div className="bg-white border rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {initialData.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && initialData && (
                <div className="space-y-6">
                  {/* Order Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-linear-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Total Orders</p>
                          <p className="text-2xl font-bold">{initialData.totalOrders}</p>
                        </div>
                        <ShoppingBag size={32} className="opacity-80" />
                      </div>
                    </div>
                    <div className="bg-linear-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Total Spent</p>
                          <p className="text-2xl font-bold">{formatCurrency(initialData.totalSpent)}</p>
                        </div>
                        <DollarSign size={32} className="opacity-80" />
                      </div>
                    </div>
                    <div className="bg-linear-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Avg. Order Value</p>
                          <p className="text-2xl font-bold">{formatCurrency(initialData.averageOrderValue)}</p>
                        </div>
                        <CreditCard size={32} className="opacity-80" />
                      </div>
                    </div>
                    <div className="bg-linear-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Favorite Category</p>
                          <p className="text-2xl font-bold">{initialData.favoriteCategory}</p>
                        </div>
                        <Star size={32} className="opacity-80" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders Table */}
                  {initialData.orders && initialData.orders.length > 0 ? (
                    <div className="bg-white border rounded-lg overflow-hidden">
                      <div className="p-6 border-b">
                        <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {initialData.orders.map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <span className="font-medium text-blue-600">{order.id}</span>
                                </td>
                                <td className="px-6 py-4">{formatDate(order.date)}</td>
                                <td className="px-6 py-4">{order.item_count}</td>
                                <td className="px-6 py-4 font-bold">{formatCurrency(order.total)}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border rounded-lg p-12 text-center">
                      <Package size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                      <p className="text-gray-600">This customer hasn't placed any orders yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  {/* Communication Preferences */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Communication Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${formData.communicationPreferences.email ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            name="communication.email"
                            checked={formData.communicationPreferences.email}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <span className="font-medium text-gray-900">Email Notifications</span>
                          <p className="text-sm text-gray-500">Order updates, promotions, and newsletters</p>
                        </div>
                      </label>

                      <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${formData.communicationPreferences.sms ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            name="communication.sms"
                            checked={formData.communicationPreferences.sms}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <span className="font-medium text-gray-900">SMS Notifications</span>
                          <p className="text-sm text-gray-500">Shipping updates and important alerts</p>
                        </div>
                      </label>

                      <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${formData.communicationPreferences.newsletter ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            name="communication.newsletter"
                            checked={formData.communicationPreferences.newsletter}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <span className="font-medium text-gray-900">Newsletter</span>
                          <p className="text-sm text-gray-500">Weekly book recommendations and news</p>
                        </div>
                      </label>

                      <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${formData.communicationPreferences.promotions ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            name="communication.promotions"
                            checked={formData.communicationPreferences.promotions}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <span className="font-medium text-gray-900">Promotional Offers</span>
                          <p className="text-sm text-gray-500">Discounts, special offers, and sales</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Favorite Categories */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Reading Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Favorite Category
                        </label>
                        <input
                          type="text"
                          name="favoriteCategory"
                          value={formData.favoriteCategory}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          className="w-full p-3 border rounded-lg outline-none disabled:bg-gray-50"
                          placeholder="e.g., Mystery & Thriller"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Format
                        </label>
                        <select
                          disabled={mode === 'view'}
                          className="w-full p-3 border rounded-lg outline-none disabled:bg-gray-50"
                        >
                          <option>Paperback</option>
                          <option>Hardcover</option>
                          <option>E-book</option>
                          <option>Audiobook</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && initialData && (
                <div className="space-y-6">
                  {/* Activity Timeline */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-6">Customer Activity Timeline</h3>
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      
                      {/* Timeline Events */}
                      <div className="space-y-8 relative">
                        {[
                          { 
                            event: 'Account Created', 
                            date: initialData.registrationDate, 
                            description: 'Customer registered on BookNook',
                            icon: '👤',
                            color: 'bg-blue-500'
                          },
                          initialData.totalOrders > 0 && { 
                            event: 'First Purchase', 
                            date: initialData.recentOrders[0]?.date, 
                            description: `Made first purchase of ${formatCurrency(initialData.recentOrders[0]?.total || 0)}`,
                            icon: '🛒',
                            color: 'bg-green-500'
                          },
                          initialData.totalOrders > 3 && { 
                            event: 'Became Regular Customer', 
                            date: '2024-01-15', 
                            description: 'Placed 5+ orders in first month',
                            icon: '⭐',
                            color: 'bg-yellow-500'
                          },
                          initialData.totalSpent > 1000 && { 
                            event: 'Reached VIP Status', 
                            date: '2024-02-01', 
                            description: 'Total spending exceeded $1,000',
                            icon: '🏆',
                            color: 'bg-purple-500'
                          },
                          initialData.lastLogin && { 
                            event: 'Last Login', 
                            date: initialData.lastLogin, 
                            description: 'Last active on the platform',
                            icon: '🔐',
                            color: 'bg-gray-500'
                          }
                        ].filter(Boolean).map((timelineEvent, index) => (
                          <div key={index} className="flex items-start">
                            <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full ${timelineEvent.color} flex items-center justify-center text-white mr-4`}>
                              <span className="text-lg">{timelineEvent.icon}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">{timelineEvent.event}</h4>
                                <span className="text-sm text-gray-500">
                                  {formatDate(timelineEvent.date)}
                                </span>
                              </div>
                              <p className="text-gray-600 mt-1">{timelineEvent.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center">
                      <Mail size={18} className="mr-2" />
                      Send Welcome Email
                    </button>
                    <button className="px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center">
                      <MessageSquare size={18} className="mr-2" />
                      Send Message
                    </button>
                    <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center">
                      <Download size={18} className="mr-2" />
                      Export Data
                    </button>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              {mode !== 'view' && (
                <div className="sticky bottom-0 bg-white border-t mt-6 -mb-6 -mx-6 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <div className="flex items-center space-x-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            {mode === 'add' ? <UserPlus size={16} className="mr-2" /> : <Save size={16} className="mr-2" />}
                            {mode === 'add' ? 'Add Customer' : 'Save Changes'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'view' && (
                <div className="sticky bottom-0 bg-white border-t mt-6 -mb-6 -mx-6 px-6 py-4">
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Customer
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;