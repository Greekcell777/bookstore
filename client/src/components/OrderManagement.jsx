import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, MoreVertical, Eye, Check, X, 
  Truck, Package, Clock, DollarSign, User, Calendar, 
  ChevronDown, ChevronUp, Edit, RefreshCw, Printer, Mail,
  AlertCircle, ArrowUpRight, ArrowDownRight, Home, Phone,
  Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Smartphone, CreditCard
} from 'lucide-react';
import OrderModal from './OrderModal';
import { useBookStore } from './BookstoreContext';

const OrdersManagement = () => {
  const { 
    adminOrders,
    fetchOrders,
    updateOrder, 
    isLoading, 
    error,
    updateOrderStatus,
    adminAPI
  } = useBookStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  // Handle order status update
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      if (updateOrder) {
        await updateOrder(orderId, { status: newStatus });
        await fetchOrders(); 
        alert(`Order status updated to ${newStatus}`);
      } else {
        alert('Update status function not available');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status');
    }
  };

  // Handle bulk status update
  const handleBulkUpdateStatus = async (newStatus) => {
    if (selectedOrders.length === 0) return;
    
    const confirmed = window.confirm(
      `Update ${selectedOrders.length} order(s) to ${newStatus}?`
    );
    
    if (!confirmed) return;
    
    try {
      for (const orderId of selectedOrders) {
        await handleUpdateStatus(orderId, newStatus);
      }
      setSelectedOrders([]);
    } catch (error) {
      alert('Failed to update some orders');
    }
  };

  // Modal handlers
  const handleOpenModal = (mode, order = null) => {
    setModalMode(mode);
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  // Selection handlers
  const handleSelectAll = (e) => {
    const ordersToSelect = getFilteredOrders();
    if (e.target.checked) {
      setSelectedOrders(ordersToSelect.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(orderId => orderId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  // Filter and search orders
  const getFilteredOrders = () => {
    return adminOrders.filter(order => {
      const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
      const matchesSearch = searchTerm === '' || 
        (order.order_number || order.id).toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  };

  // Get current page orders
  const getCurrentPageOrders = () => {
    const filteredOrders = getFilteredOrders();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  };

  // Status helpers
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <Check className="text-green-500" size={16} />;
      case 'processing': return <RefreshCw className="text-blue-500" size={16} />;
      case 'shipped': return <Truck className="text-purple-500" size={16} />;
      case 'pending': return <Clock className="text-yellow-500" size={16} />;
      case 'cancelled': return <X className="text-red-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
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

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'mpesa': return <Smartphone className="text-green-500" size={14} />;
      case 'credit_card': return <CreditCard className="text-blue-500" size={14} />;
      case 'paypal': return <CreditCard className="text-blue-500" size={14} />;
      case 'cash': return <DollarSign className="text-gray-500" size={14} />;
      default: return <CreditCard className="text-gray-500" size={14} />;
    }
  };

  // Format helpers
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES'
    }).format(amount * 130|| 0);
  };

  // Calculate stats
  const filteredOrders = getFilteredOrders();
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const averageOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
  const pendingOrders = filteredOrders.filter(o => o.status === 'pending').length;
  const processingOrders = filteredOrders.filter(o => o.status === 'processing').length;

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentPageOrders = getCurrentPageOrders();

  // Pagination controls
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Orders', count: filteredOrders.length, color: 'bg-gray-500' },
    { id: 'pending', label: 'Pending', count: pendingOrders, color: 'bg-yellow-500' },
    { id: 'processing', label: 'Processing', count: processingOrders, color: 'bg-blue-500' },
    { id: 'shipped', label: 'Shipped', count: filteredOrders.filter(o => o.status === 'shipped').length, color: 'bg-purple-500' },
    { id: 'delivered', label: 'Delivered', count: filteredOrders.filter(o => o.status === 'delivered').length, color: 'bg-green-500' },
    { id: 'cancelled', label: 'Cancelled', count: filteredOrders.filter(o => o.status === 'cancelled').length, color: 'bg-red-500' }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center mx-auto"
          >
            <RefreshCw size={20} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">
            {filteredOrders.length} orders • Page {currentPage} of {totalPages}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center"
          >
            <RefreshCw size={20} className="mr-2" />
            Refresh
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center">
            <Download size={20} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Package size={24} />
            </div>
          </div>
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+12.5% from last month</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+8.3% from last month</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <Clock size={24} />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Requires attention
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageOrderValue)}</p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+5.2% from last month</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            onClick={() => {
              setActiveFilter(filter.id);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full flex items-center ${activeFilter === filter.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
          >
            <span className={`w-2 h-2 rounded-full ${filter.color} mr-2`}></span>
            {filter.label}
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-100'}`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 24 hours</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-blue-700 font-medium">
              {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => handleBulkUpdateStatus('processing')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              <Check size={16} className="mr-1" />
              Mark as Processing
            </button>
            <button 
              onClick={() => handleBulkUpdateStatus('shipped')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              <Truck size={16} className="mr-1" />
              Mark as Shipped
            </button>
          </div>
        </div>
      )}

      {/* No Orders Message */}
      {currentPageOrders.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? `No orders match your search for "${searchTerm}"` : 'No orders in the system'}
          </p>
        </div>
      )}

      {/* Orders Table */}
      {currentPageOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === currentPageOrders.length && currentPageOrders.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPageOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-blue-600">{order.order_number || `ORD-${order.id}`}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <User size={16} className="text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.user?.username || order.user?.email || `User ${order.user_id}`}
                            </div>
                            {order.user?.email && (
                              <div className="text-sm text-gray-500">{order.user.email}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Package size={16} className="text-gray-400 mr-2" />
                          {order.item_count || order.items?.length || 1} item{order.item_count !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} flex items-center`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getPaymentMethodIcon(order.payment_method)}
                          <span className="ml-2 text-sm text-gray-700">
                            {order.payment_method || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition"
                            title={expandedOrder === order.id ? "Hide Details" : "View Details"}
                          >
                            {expandedOrder === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <button 
                            onClick={() => handleOpenModal('view', order)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition"
                            title="View Full Details"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Row Details */}
                    {expandedOrder === order.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="9" className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Order Items */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Order Details</h4>
                              <div className="p-4 bg-white rounded-lg border">
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm text-gray-600">Order Number</p>
                                    <p className="font-medium">{order.order_number || `ORD-${order.id}`}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Order Date</p>
                                    <p className="font-medium">{formatDate(order.created_at)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Payment Method</p>
                                    <p className="font-medium flex items-center">
                                      {getPaymentMethodIcon(order.payment_method)}
                                      <span className="ml-2">{order.payment_method || 'Unknown'}</span>
                                    </p>
                                  </div>
                                  {order.tracking_number && (
                                    <div>
                                      <p className="text-sm text-gray-600">Tracking Number</p>
                                      <p className="font-medium">{order.tracking_number}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                              <div className="space-y-3">
                                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center">
                                  <Printer size={16} className="mr-2" />
                                  Print Invoice
                                </button>
                                
                                {/* Status Update Buttons */}
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {order.status !== 'processing' && (
                                    <button 
                                      onClick={() => handleUpdateStatus(order.id, 'processing')}
                                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                                    >
                                      Mark as Processing
                                    </button>
                                  )}
                                  {order.status !== 'shipped' && (
                                    <button 
                                      onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                      className="px-3 py-2 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200"
                                    >
                                      Mark as Shipped
                                    </button>
                                  )}
                                  {order.status !== 'delivered' && (
                                    <button 
                                      onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                      className="px-3 py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                                    >
                                      Mark as Delivered
                                    </button>
                                  )}
                                  {order.status !== 'cancelled' && (
                                    <button 
                                      onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                      className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                                    >
                                      Cancel Order
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
              </span> of{' '}
              <span className="font-medium">{filteredOrders.length}</span> orders
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                title="First page"
              >
                <ChevronsLeft size={20} />
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                title="Previous page"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  if (pageNum < 1 || pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                title="Next page"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                title="Last page"
              >
                <ChevronsRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      <OrderModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        initialData={selectedOrder}
        onSave={() => {}}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OrdersManagement;