import React, { useState, useEffect } from 'react';
import { 
  Package, Calendar, DollarSign, Truck, CheckCircle, 
  Clock, XCircle, Search, Filter, Download, Eye, 
  RefreshCw, Loader, AlertCircle, MapPin, CreditCard 
} from 'lucide-react';
import { useBookStore } from '../components/BookstoreContext';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Use BookStore context
  const {
    orders,
    user,
    isLoading,
    error,
    fetchOrders,
    createOrder
  } = useBookStore();

  // Fetch orders on component mount
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format price
  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Process order data from context
  const processOrderData = (orderData) => {
    if (!orderData) return null;

    // Map statuses
    const statusMapping = {
      'pending': 'processing',
      'processing': 'processing',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
      'completed': 'delivered'
    };

    // Calculate total if not provided
    const calculateTotal = (items) => {
      return items?.reduce((sum, item) => {
        const price = item.price || item.book?.current_price || item.book?.list_price || 0;
        const quantity = item.quantity || 1;
        return sum + (price * quantity);
      }, 0) || 0;
    };

    return {
      id: orderData.order_number || `ORD-${orderData.id}`,
      originalId: orderData.id,
      date: orderData.created_at || orderData.order_date || new Date().toISOString(),
      items: orderData.items?.length || 0,
      total: orderData.total_amount || calculateTotal(orderData.items),
      status: statusMapping[orderData.status?.toLowerCase()] || orderData.status || 'processing',
      trackingNumber: orderData.tracking_number,
      itemsDetails: orderData.items?.map(item => ({
        id: item.id || item.book_id,
        name: item.book?.title || 'Unknown Book',
        price: item.price || item.book?.current_price || item.book?.list_price || 0,
        quantity: item.quantity || 1,
        image: item.book?.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        bookId: item.book_id,
        format: item.format || 'paperback'
      })) || [],
      deliveryDate: orderData.delivery_date || orderData.estimated_delivery,
      paymentMethod: orderData.payment_method || 'Not specified',
      shippingAddress: orderData.shipping_address,
      billingAddress: orderData.billing_address,
      notes: orderData.notes
    };
  };

  // Process all orders
  const processedOrders = orders.map(processOrderData).filter(Boolean);

  const filterOptions = [
    { id: 'all', label: 'All Orders', count: processedOrders.length },
    { id: 'processing', label: 'Processing', count: processedOrders.filter(o => o.status === 'processing').length },
    { id: 'shipped', label: 'Shipped', count: processedOrders.filter(o => o.status === 'shipped').length },
    { id: 'delivered', label: 'Delivered', count: processedOrders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', label: 'Cancelled', count: processedOrders.filter(o => o.status === 'cancelled').length }
  ];

  // Filter and search orders
  const filteredOrders = processedOrders.filter(order => {
    // Apply status filter
    if (activeFilter !== 'all' && order.status !== activeFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.itemsDetails.some(item => item.name.toLowerCase().includes(query)) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="text-green-500" size={20} />;
      case 'processing': return <Clock className="text-yellow-500" size={20} />;
      case 'shipped': return <Truck className="text-blue-500" size={20} />;
      case 'cancelled': return <XCircle className="text-red-500" size={20} />;
      default: return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle reorder
  const handleReorder = async (order) => {
    if (!user) {
      alert('Please login to reorder');
      return;
    }

    try {
      // Create a new order with the same items
      const orderData = {
        items: order.itemsDetails.map(item => ({
          book_id: item.bookId || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address: order.shippingAddress,
        billing_address: order.billingAddress,
        payment_method: order.paymentMethod,
        notes: `Reorder of ${order.id}`
      };

      await createOrder(orderData);
      alert('Order placed successfully!');
      fetchOrders(); // Refresh orders list
    } catch (err) {
      console.error('Error reordering:', err);
      alert('Failed to place order');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  // No user logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your orders.</p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">Track and manage all your purchases</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
                />
              </div>
              <button 
                onClick={fetchOrders}
                className="px-4 py-2 border rounded-lg flex items-center hover:bg-gray-50 transition"
              >
                <RefreshCw size={20} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full flex items-center transition ${activeFilter === filter.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
            >
              {filter.label}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || activeFilter !== 'all' 
                  ? 'No orders match your search criteria' 
                  : 'You haven\'t placed any orders yet'
                }
              </p>
              {!searchQuery && activeFilter === 'all' && (
                <Link
                  to="/catalog"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Start Shopping
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} flex items-center gap-1`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2" />
                          {formatDate(order.date)}
                        </div>
                        <div className="flex items-center">
                          <Package size={16} className="mr-2" />
                          {order.items} item{order.items > 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center">
                          <DollarSign size={16} className="mr-2" />
                          {formatPrice(order.total)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="px-4 py-2 border rounded-lg flex items-center hover:bg-gray-50 transition"
                      >
                        <Eye size={18} className="mr-2" />
                        {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                      {order.status === 'delivered' && (
                        <button 
                          onClick={() => handleReorder(order)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                        >
                          <RefreshCw size={18} className="mr-2" />
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex items-center gap-4 mb-4 flex-wrap">
                    {order.itemsDetails.slice(0, 3).map((item, index) => (
                      <Link
                        key={index}
                        to={`/book/${item.bookId || item.id}`}
                        className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400';
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity} • {formatPrice(item.price)}</p>
                        </div>
                      </Link>
                    ))}
                    {order.itemsDetails.length > 3 && (
                      <div className="ml-4 text-gray-500">
                        +{order.itemsDetails.length - 3} more items
                      </div>
                    )}
                  </div>

                  {/* Detailed View */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold text-gray-900 mb-4">Order Details</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-700 mb-3">Items</h5>
                          <div className="space-y-3">
                            {order.itemsDetails.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-white rounded overflow-hidden">
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400';
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-xs text-gray-500 capitalize">{item.format}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                                  <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="space-y-4">
                            {/* Shipping Information */}
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Truck size={16} />
                                Shipping Information
                              </h5>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                {order.trackingNumber ? (
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <p className="font-medium">Tracking Number</p>
                                      <p className="text-sm text-gray-600">{order.trackingNumber}</p>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-700">
                                      Track
                                    </button>
                                  </div>
                                ) : (
                                  <p className="text-gray-600">Tracking number will be available once shipped</p>
                                )}
                                {order.deliveryDate && (
                                  <div className="mt-2">
                                    <p className="font-medium">Estimated Delivery</p>
                                    <p className="text-sm text-gray-600">{formatDate(order.deliveryDate)}</p>
                                  </div>
                                )}
                                {order.shippingAddress && (
                                  <div className="mt-2">
                                    <p className="font-medium flex items-center gap-2">
                                      <MapPin size={14} />
                                      Shipping Address
                                    </p>
                                    <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Payment Information */}
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <CreditCard size={16} />
                                Payment Information
                              </h5>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium">{order.paymentMethod}</p>
                                <div className="mt-2 space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>{formatPrice(order.total)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span>Free</span>
                                  </div>
                                  <div className="flex justify-between border-t pt-1 mt-1">
                                    <span className="font-medium">Total Amount</span>
                                    <span className="font-bold">{formatPrice(order.total)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                              <button className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center justify-center">
                                <Download size={18} className="mr-2" />
                                Invoice
                              </button>
                              <button className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                                Need Help?
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{processedOrders.length}</p>
              </div>
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(processedOrders.reduce((sum, order) => sum + order.total, 0))}
                </p>
              </div>
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {processedOrders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {processedOrders.filter(o => o.status === 'processing' || o.status === 'shipped').length}
                </p>
              </div>
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        {/* Order Status Legend */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
          <h5 className="font-medium text-gray-700 mb-3">Order Status Guide</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm">Processing: Order being prepared</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Shipped: On its way to you</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Delivered: Successfully delivered</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">Cancelled: Order cancelled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;