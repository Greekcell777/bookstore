import React, { useState } from 'react';
import { Package, Calendar, DollarSign, Truck, CheckCircle, Clock, XCircle, Search, Filter, Download, Eye, RefreshCw } from 'lucide-react';

const OrdersPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sample orders data
  const orders = [
    {
      id: 'ORD-789456',
      date: '2024-03-15',
      items: 3,
      total: 89.97,
      status: 'delivered',
      trackingNumber: 'TRK789456123',
      itemsDetails: [
        { name: 'The Silent Patient', price: 29.99, quantity: 1, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
        { name: 'Atomic Habits', price: 24.99, quantity: 1, image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w-400' },
        { name: 'Bookmark Set', price: 34.99, quantity: 1, image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400' }
      ],
      deliveryDate: '2024-03-18',
      paymentMethod: 'Visa ending in 1234'
    },
    {
      id: 'ORD-123456',
      date: '2024-03-10',
      items: 2,
      total: 45.98,
      status: 'processing',
      trackingNumber: null,
      itemsDetails: [
        { name: 'Project Hail Mary', price: 27.99, quantity: 1, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
        { name: 'Book Cover', price: 17.99, quantity: 1, image: 'https://images.unsplash.com/photo-1523327442315-c2263fd39244?w=400' }
      ],
      deliveryDate: '2024-03-17',
      paymentMethod: 'PayPal'
    },
    {
      id: 'ORD-456123',
      date: '2024-03-05',
      items: 1,
      total: 19.99,
      status: 'shipped',
      trackingNumber: 'TRK456123789',
      itemsDetails: [
        { name: 'The Midnight Library', price: 19.99, quantity: 1, image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400' }
      ],
      deliveryDate: '2024-03-12',
      paymentMethod: 'MasterCard ending in 5678'
    },
    {
      id: 'ORD-987654',
      date: '2024-02-28',
      items: 4,
      total: 120.96,
      status: 'cancelled',
      trackingNumber: null,
      itemsDetails: [
        { name: 'Dune', price: 29.99, quantity: 1, image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400' },
        { name: 'Book Light', price: 25.99, quantity: 1, image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400' },
        { name: 'Reading Journal', price: 19.99, quantity: 1, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
        { name: 'Book Sleeve', price: 44.99, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' }
      ],
      deliveryDate: null,
      paymentMethod: 'Visa ending in 1234'
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

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
                  className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
                />
              </div>
              <button className="px-4 py-2 border rounded-lg flex items-center hover:bg-gray-50 transition">
                <Filter size={20} className="mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full flex items-center ${activeFilter === filter.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
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
              <p className="text-gray-600">You haven't placed any orders yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
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
                          ${order.total.toFixed(2)}
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
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center">
                          <RefreshCw size={18} className="mr-2" />
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex items-center gap-4 mb-4">
                    {order.itemsDetails.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                  <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2">Shipping Information</h5>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                {order.trackingNumber ? (
                                  <div className="flex items-center justify-between">
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
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-gray-700 mb-2">Payment Information</h5>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p>{order.paymentMethod}</p>
                                <div className="mt-2 flex justify-between">
                                  <span className="text-gray-600">Total Amount</span>
                                  <span className="font-bold">${order.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

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
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
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
                  {orders.filter(o => o.status === 'delivered').length}
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
                  {orders.filter(o => o.status === 'processing' || o.status === 'shipped').length}
                </p>
              </div>
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;