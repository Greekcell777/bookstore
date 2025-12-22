import React, { useState } from 'react';
import { 
  Search, Filter, Download, MoreVertical, Eye, Check, X, 
  Truck, Package, Clock, DollarSign, User, Calendar, 
  ChevronDown, ChevronUp, Edit, RefreshCw, Printer, Mail,
  AlertCircle, ArrowUpRight, ArrowDownRight, Home, Phone, MapPin
} from 'lucide-react';
import OrderModal from './OrderModal';

const OrdersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample orders data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-789456',
      customer: {
        id: 101,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street, New York, NY 10001'
      },
      date: '2024-03-15',
      items: 3,
      subtotal: 89.97,
      shipping: 5.99,
      tax: 7.20,
      total: 103.16,
      status: 'delivered',
      paymentMethod: 'Visa ending in 1234',
      paymentStatus: 'paid',
      trackingNumber: 'TRK789456123',
      carrier: 'UPS',
      estimatedDelivery: '2024-03-18',
      actualDelivery: '2024-03-18',
      itemsDetails: [
        { 
          id: 1, 
          name: 'The Silent Patient', 
          price: 29.99, 
          quantity: 1, 
          total: 29.99,
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
          category: 'Mystery & Thriller',
          author: 'Alex Michaelides'
        },
        { 
          id: 2, 
          name: 'Atomic Habits', 
          price: 24.99, 
          quantity: 1, 
          total: 24.99,
          image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400',
          category: 'Self-Help',
          author: 'James Clear'
        },
        { 
          id: 3, 
          name: 'Bookmark Set', 
          price: 34.99, 
          quantity: 1, 
          total: 34.99,
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
          category: 'Accessories'
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      billingAddress: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      notes: 'Please deliver before 5 PM',
      tags: ['regular', 'express'],
      updatedAt: '2024-03-18 14:30:00'
    },
    {
      id: 'ORD-123456',
      customer: {
        id: 102,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1 (555) 987-6543',
        address: '456 Oak Avenue, Los Angeles, CA 90001'
      },
      date: '2024-03-10',
      items: 2,
      subtotal: 45.98,
      shipping: 4.99,
      tax: 3.68,
      total: 54.65,
      status: 'processing',
      paymentMethod: 'PayPal',
      paymentStatus: 'paid',
      trackingNumber: null,
      carrier: null,
      estimatedDelivery: '2024-03-17',
      actualDelivery: null,
      itemsDetails: [
        { 
          id: 4, 
          name: 'Project Hail Mary', 
          price: 27.99, 
          quantity: 1, 
          total: 27.99,
          image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
          category: 'Science Fiction',
          author: 'Andy Weir'
        },
        { 
          id: 5, 
          name: 'Book Cover', 
          price: 17.99, 
          quantity: 1, 
          total: 17.99,
          image: 'https://images.unsplash.com/photo-1523327442315-c2263fd39244?w=400',
          category: 'Accessories'
        }
      ],
      shippingAddress: {
        name: 'Jane Smith',
        street: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA'
      },
      billingAddress: {
        name: 'Jane Smith',
        street: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA'
      },
      notes: 'Gift wrapping requested',
      tags: ['gift'],
      updatedAt: '2024-03-10 09:15:00'
    },
    {
      id: 'ORD-456123',
      customer: {
        id: 103,
        name: 'Robert Johnson',
        email: 'robert.j@example.com',
        phone: '+1 (555) 456-7890',
        address: '789 Pine Road, Chicago, IL 60601'
      },
      date: '2024-03-05',
      items: 1,
      subtotal: 19.99,
      shipping: 3.99,
      tax: 1.60,
      total: 25.58,
      status: 'shipped',
      paymentMethod: 'MasterCard ending in 5678',
      paymentStatus: 'paid',
      trackingNumber: 'TRK456123789',
      carrier: 'FedEx',
      estimatedDelivery: '2024-03-12',
      actualDelivery: null,
      itemsDetails: [
        { 
          id: 6, 
          name: 'The Midnight Library', 
          price: 19.99, 
          quantity: 1, 
          total: 19.99,
          image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
          category: 'Fiction',
          author: 'Matt Haig'
        }
      ],
      shippingAddress: {
        name: 'Robert Johnson',
        street: '789 Pine Road',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA'
      },
      billingAddress: {
        name: 'Robert Johnson',
        street: '789 Pine Road',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA'
      },
      notes: '',
      tags: ['regular'],
      updatedAt: '2024-03-08 11:45:00'
    },
    {
      id: 'ORD-987654',
      customer: {
        id: 104,
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        phone: '+1 (555) 321-0987',
        address: '321 Elm Street, Miami, FL 33101'
      },
      date: '2024-02-28',
      items: 4,
      subtotal: 120.96,
      shipping: 8.99,
      tax: 9.68,
      total: 139.63,
      status: 'cancelled',
      paymentMethod: 'Visa ending in 1234',
      paymentStatus: 'refunded',
      trackingNumber: null,
      carrier: null,
      estimatedDelivery: null,
      actualDelivery: null,
      itemsDetails: [
        { 
          id: 7, 
          name: 'Dune', 
          price: 29.99, 
          quantity: 1, 
          total: 29.99,
          image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
          category: 'Science Fiction',
          author: 'Frank Herbert'
        },
        { 
          id: 8, 
          name: 'Book Light', 
          price: 25.99, 
          quantity: 1, 
          total: 25.99,
          image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400',
          category: 'Accessories'
        },
        { 
          id: 9, 
          name: 'Reading Journal', 
          price: 19.99, 
          quantity: 1, 
          total: 19.99,
          image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
          category: 'Accessories'
        },
        { 
          id: 10, 
          name: 'Book Sleeve', 
          price: 44.99, 
          quantity: 1, 
          total: 44.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          category: 'Accessories'
        }
      ],
      shippingAddress: {
        name: 'Emily Davis',
        street: '321 Elm Street',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'USA'
      },
      billingAddress: {
        name: 'Emily Davis',
        street: '321 Elm Street',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'USA'
      },
      notes: 'Customer requested cancellation',
      tags: ['cancelled'],
      updatedAt: '2024-02-29 16:20:00'
    },
    {
      id: 'ORD-654321',
      customer: {
        id: 105,
        name: 'Michael Brown',
        email: 'michael.b@example.com',
        phone: '+1 (555) 654-3210',
        address: '654 Maple Drive, Seattle, WA 98101'
      },
      date: '2024-03-12',
      items: 2,
      subtotal: 57.98,
      shipping: 5.99,
      tax: 4.64,
      total: 68.61,
      status: 'pending',
      paymentMethod: 'Apple Pay',
      paymentStatus: 'pending',
      trackingNumber: null,
      carrier: null,
      estimatedDelivery: null,
      actualDelivery: null,
      itemsDetails: [
        { 
          id: 11, 
          name: 'The Hobbit', 
          price: 22.99, 
          quantity: 1, 
          total: 22.99,
          image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
          category: 'Fantasy',
          author: 'J.R.R. Tolkien'
        },
        { 
          id: 12, 
          name: 'Educated', 
          price: 26.99, 
          quantity: 1, 
          total: 26.99,
          image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
          category: 'Memoir',
          author: 'Tara Westover'
        }
      ],
      shippingAddress: {
        name: 'Michael Brown',
        street: '654 Maple Drive',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA'
      },
      billingAddress: {
        name: 'Michael Brown',
        street: '654 Maple Drive',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA'
      },
      notes: '',
      tags: ['new'],
      updatedAt: '2024-03-12 08:30:00'
    }
  ]);

  const filterOptions = [
    { id: 'all', label: 'All Orders', count: orders.length, color: 'bg-gray-500' },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-500' },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length, color: 'bg-blue-500' },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length, color: 'bg-purple-500' },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: 'bg-green-500' },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length, color: 'bg-red-500' }
  ];

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

  const handleSaveOrder = (orderData) => {
    if (modalMode === 'edit' && selectedOrder) {
      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? { ...orderData, id: order.id } : order
      ));
    }
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== id));
      setSelectedOrders(selectedOrders.filter(orderId => orderId !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(order => order.id));
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

  const handleDeleteSelected = () => {
    if (selectedOrders.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedOrders.length} selected order(s)?`)) {
      setOrders(orders.filter(order => !selectedOrders.includes(order.id)));
      setSelectedOrders([]);
    }
  };

  // Filter orders based on active filter and search term
  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center">
            <Download size={20} className="mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center">
            <RefreshCw size={20} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
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
            onClick={() => setActiveFilter(filter.id)}
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select className="border rounded-lg px-3 py-2">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 24 hours</option>
                <option>Custom range</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select className="border rounded-lg px-3 py-2">
                <option>All Payment Methods</option>
                <option>Credit Card</option>
                <option>PayPal</option>
                <option>Apple Pay</option>
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
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              <Check size={16} className="mr-1" />
              Mark as Processing
            </button>
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              <Truck size={16} className="mr-1" />
              Mark as Shipped
            </button>
            <button 
              onClick={handleDeleteSelected}
              className="text-red-600 hover:text-red-700 font-medium flex items-center"
            >
              <X size={16} className="mr-1" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
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
              {filteredOrders.map((order) => (
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
                      <span className="font-medium text-blue-600">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <User size={16} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{order.customer.name}</div>
                          <div className="text-sm text-gray-500">{order.customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        {formatDate(order.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Package size={16} className="text-gray-400 mr-2" />
                        {order.items} item{order.items > 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatCurrency(order.total)}
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
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
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
                        <button 
                          onClick={() => handleOpenModal('edit', order)}
                          className="p-1 text-gray-400 hover:text-green-600 transition"
                          title="Edit Order"
                        >
                          <Edit size={18} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row Details */}
                  {expandedOrder === order.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="9" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Order Items */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                            <div className="space-y-3">
                              {order.itemsDetails.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                                      <img 
                                        src={item.image} 
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm">{item.name}</p>
                                      {item.author && (
                                        <p className="text-xs text-gray-500">by {item.author}</p>
                                      )}
                                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{formatCurrency(item.total)}</p>
                                    <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Information */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Shipping Information</h4>
                            <div className="p-4 bg-white rounded-lg border">
                              <div className="flex items-start mb-3">
                                <Home size={16} className="text-gray-400 mt-1 mr-2" />
                                <div>
                                  <p className="font-medium">{order.shippingAddress.name}</p>
                                  <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
                                  <p className="text-sm text-gray-600">
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                  </p>
                                  <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                                </div>
                              </div>
                              {order.trackingNumber && (
                                <div className="mt-4 pt-4 border-t">
                                  <p className="font-medium text-sm">Tracking Information</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <div>
                                      <p className="text-sm">{order.trackingNumber}</p>
                                      <p className="text-xs text-gray-500">{order.carrier}</p>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                                      Track Shipment
                                    </button>
                                  </div>
                                </div>
                              )}
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
                              <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center">
                                <Mail size={16} className="mr-2" />
                                Send Tracking
                              </button>
                              
                              {/* Status Update Buttons */}
                              <div className="grid grid-cols-2 gap-2 mt-4">
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
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
            <span className="font-medium">{orders.length}</span> orders
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        initialData={selectedOrder}
        onSave={handleSaveOrder}
      />
    </div>
  );
};

export default OrdersManagement;