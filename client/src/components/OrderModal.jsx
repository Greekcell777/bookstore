import React, { useState, useEffect } from 'react';
import { 
  X, Package, User, Calendar, DollarSign, MapPin, 
  CreditCard, Truck, Mail, Phone, Home, Printer, 
  Save, Edit, Check, Clock, AlertCircle, ChevronDown,
  Tag, MessageSquare, Download, RefreshCw
} from 'lucide-react';

const OrderModal = ({ isOpen, onClose, mode = 'view', initialData = null, onSave }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    paymentStatus: '',
    trackingNumber: '',
    carrier: '',
    estimatedDelivery: '',
    notes: ''
  });

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'refunded', label: 'Refunded', color: 'bg-red-100 text-red-800' },
    { value: 'failed', label: 'Failed', color: 'bg-gray-100 text-gray-800' }
  ];

  const carrierOptions = ['UPS', 'FedEx', 'USPS', 'DHL', 'Amazon Logistics'];

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        status: initialData.status || '',
        paymentStatus: initialData.paymentStatus || '',
        trackingNumber: initialData.trackingNumber || '',
        carrier: initialData.carrier || '',
        estimatedDelivery: initialData.estimatedDelivery || '',
        notes: initialData.notes || ''
      });
    }
  }, [initialData, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedData = {
        ...initialData,
        ...formData,
        updatedAt: new Date().toISOString()
      };

      if (onSave) {
        onSave(updatedData);
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
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !initialData) return null;

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
                <Package size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order {initialData.id}</h2>
                <p className="text-sm text-gray-600">
                  {mode === 'view' ? 'View order details' : 'Update order information'}
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
                onClick={() => setActiveTab('details')}
                className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Order Details
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'items' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Items ({initialData.items})
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'shipping' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Shipping & Billing
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'timeline' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Order Timeline
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-160px)] p-6">
            <form onSubmit={handleSubmit}>
              {/* Order Details Tab */}
              {activeTab === 'details' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Order Summary */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Customer Information */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <User size={20} className="mr-2" />
                        Customer Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Customer Name</p>
                          <p className="font-medium">{initialData.customer.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{initialData.customer.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{initialData.customer.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Customer ID</p>
                          <p className="font-medium">CUST-{initialData.customer.id}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Information */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar size={20} className="mr-2" />
                        Order Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Order Date</p>
                          <p className="font-medium">{formatDate(initialData.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Last Updated</p>
                          <p className="font-medium">{formatDate(initialData.updatedAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Payment Method</p>
                          <p className="font-medium">{initialData.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tags</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {initialData.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <MessageSquare size={20} className="mr-2" />
                        Order Notes
                      </h3>
                      {mode === 'view' ? (
                        <p className="text-gray-700">{initialData.notes || 'No notes available'}</p>
                      ) : (
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full p-3 border rounded-lg outline-none resize-none"
                          placeholder="Add notes about this order..."
                        />
                      )}
                    </div>
                  </div>

                  {/* Right Column - Status & Actions */}
                  <div className="space-y-6">
                    {/* Order Status */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
                      {mode === 'view' ? (
                        <div>
                          <span className={`px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(initialData.status)} inline-block mb-4`}>
                            {initialData.status.charAt(0).toUpperCase() + initialData.status.slice(1)}
                          </span>
                          <p className="text-sm text-gray-600 mt-2">
                            Current status: {initialData.status}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Order Status
                            </label>
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                              className="w-full p-3 border rounded-lg outline-none"
                            >
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Payment Status
                            </label>
                            <select
                              name="paymentStatus"
                              value={formData.paymentStatus}
                              onChange={handleInputChange}
                              className="w-full p-3 border rounded-lg outline-none"
                            >
                              {paymentStatusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Shipping Information */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Truck size={20} className="mr-2" />
                        Shipping Information
                      </h3>
                      {mode === 'view' ? (
                        <div>
                          {initialData.trackingNumber ? (
                            <>
                              <p className="text-sm text-gray-600">Tracking Number</p>
                              <p className="font-medium">{initialData.trackingNumber}</p>
                              <p className="text-sm text-gray-600 mt-2">Carrier</p>
                              <p className="font-medium">{initialData.carrier}</p>
                              {initialData.estimatedDelivery && (
                                <>
                                  <p className="text-sm text-gray-600 mt-2">Estimated Delivery</p>
                                  <p className="font-medium">{formatDate(initialData.estimatedDelivery)}</p>
                                </>
                              )}
                            </>
                          ) : (
                            <p className="text-gray-600">No tracking information available</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tracking Number
                            </label>
                            <input
                              type="text"
                              name="trackingNumber"
                              value={formData.trackingNumber}
                              onChange={handleInputChange}
                              className="w-full p-3 border rounded-lg outline-none"
                              placeholder="Enter tracking number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Carrier
                            </label>
                            <select
                              name="carrier"
                              value={formData.carrier}
                              onChange={handleInputChange}
                              className="w-full p-3 border rounded-lg outline-none"
                            >
                              <option value="">Select Carrier</option>
                              {carrierOptions.map((carrier) => (
                                <option key={carrier} value={carrier}>
                                  {carrier}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Estimated Delivery
                            </label>
                            <input
                              type="date"
                              name="estimatedDelivery"
                              value={formData.estimatedDelivery}
                              onChange={handleInputChange}
                              className="w-full p-3 border rounded-lg outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">{formatCurrency(initialData.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium">{formatCurrency(initialData.shipping)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium">{formatCurrency(initialData.tax)}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-lg">{formatCurrency(initialData.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Items Tab */}
              {activeTab === 'items' && (
                <div className="space-y-6">
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {initialData.itemsDetails.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-4">
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  {item.author && (
                                    <p className="text-sm text-gray-500">{item.author}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-medium">{formatCurrency(item.price)}</td>
                            <td className="px-6 py-4">{item.quantity}</td>
                            <td className="px-6 py-4 font-bold">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Order Totals */}
                  <div className="bg-white border rounded-lg p-6">
                    <div className="max-w-md ml-auto">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">{formatCurrency(initialData.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium">{formatCurrency(initialData.shipping)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium">{formatCurrency(initialData.tax)}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between">
                          <span className="font-semibold text-lg">Total</span>
                          <span className="font-bold text-xl">{formatCurrency(initialData.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping & Billing Tab */}
              {activeTab === 'shipping' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Shipping Address */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Truck size={20} className="mr-2" />
                      Shipping Address
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Home size={16} className="text-gray-400 mt-1 mr-3" />
                        <div>
                          <p className="font-medium">{initialData.shippingAddress.name}</p>
                          <p className="text-gray-600">{initialData.shippingAddress.street}</p>
                          <p className="text-gray-600">
                            {initialData.shippingAddress.city}, {initialData.shippingAddress.state} {initialData.shippingAddress.zipCode}
                          </p>
                          <p className="text-gray-600">{initialData.shippingAddress.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard size={20} className="mr-2" />
                      Billing Address
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Home size={16} className="text-gray-400 mt-1 mr-3" />
                        <div>
                          <p className="font-medium">{initialData.billingAddress.name}</p>
                          <p className="text-gray-600">{initialData.billingAddress.street}</p>
                          <p className="text-gray-600">
                            {initialData.billingAddress.city}, {initialData.billingAddress.state} {initialData.billingAddress.zipCode}
                          </p>
                          <p className="text-gray-600">{initialData.billingAddress.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white border rounded-lg p-6 lg:col-span-2">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <User size={20} className="mr-2" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center">
                        <Mail size={16} className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{initialData.customer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone size={16} className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{initialData.customer.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Customer ID</p>
                          <p className="font-medium">CUST-{initialData.customer.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-6">Order Timeline</h3>
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      
                      {/* Timeline Events */}
                      <div className="space-y-8 relative">
                        {[
                          { 
                            event: 'Order Placed', 
                            date: initialData.date, 
                            description: 'Customer placed the order',
                            icon: '🛒',
                            color: 'bg-green-500'
                          },
                          { 
                            event: 'Payment Confirmed', 
                            date: initialData.date, 
                            description: `Payment of ${formatCurrency(initialData.total)} confirmed via ${initialData.paymentMethod}`,
                            icon: '💳',
                            color: 'bg-blue-500'
                          },
                          { 
                            event: 'Order Processing', 
                            date: initialData.status === 'processing' || initialData.status === 'shipped' || initialData.status === 'delivered' ? initialData.date : null,
                            description: 'Order is being prepared for shipment',
                            icon: '📦',
                            color: 'bg-purple-500'
                          },
                          { 
                            event: 'Order Shipped', 
                            date: initialData.status === 'shipped' || initialData.status === 'delivered' ? initialData.date : null,
                            description: initialData.trackingNumber ? `Shipped via ${initialData.carrier} (${initialData.trackingNumber})` : 'Ready for shipment',
                            icon: '🚚',
                            color: 'bg-orange-500'
                          },
                          { 
                            event: 'Order Delivered', 
                            date: initialData.status === 'delivered' ? initialData.actualDelivery : null,
                            description: initialData.status === 'delivered' ? 'Package delivered successfully' : 'In transit',
                            icon: '🏠',
                            color: 'bg-green-500'
                          }
                        ].map((timelineEvent, index) => (
                          <div key={index} className="flex items-start">
                            <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full ${timelineEvent.color} flex items-center justify-center text-white mr-4`}>
                              <span className="text-lg">{timelineEvent.icon}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">{timelineEvent.event}</h4>
                                <span className="text-sm text-gray-500">
                                  {timelineEvent.date ? formatDate(timelineEvent.date) : 'Pending'}
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
                      <RefreshCw size={18} className="mr-2" />
                      Update Tracking
                    </button>
                    <button className="px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center">
                      <Mail size={18} className="mr-2" />
                      Email Customer
                    </button>
                    <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center">
                      <Printer size={18} className="mr-2" />
                      Print Invoice
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
                            <Save size={16} className="mr-2" />
                            Save Changes
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
                      onClick={() => {
                        // Switch to edit mode
                        onClose();
                        // In parent component, you would open the modal in edit mode
                      }}
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Order
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

export default OrderModal;