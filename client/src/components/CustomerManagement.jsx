import React, { useState } from 'react';
import { 
  Search, Filter, Download, MoreVertical, Eye, Edit, Trash2, 
  User, Mail, Phone, Calendar, DollarSign, Package, Star, 
  ChevronDown, ChevronUp, MapPin, ShoppingBag, Clock, 
  CheckCircle, XCircle, AlertCircle, UserPlus, MessageSquare,
  ArrowUpRight, ArrowDownRight, Users, CreditCard
} from 'lucide-react';
import CustomerModal from './CustomerModal';

const CustomersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample customers data
  const [customers, setCustomers] = useState([
    {
      id: 101,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street, New York, NY 10001',
      registrationDate: '2023-01-15',
      lastLogin: '2024-03-18 14:30:00',
      status: 'active',
      emailVerified: true,
      phoneVerified: true,
      totalOrders: 12,
      totalSpent: 1034.67,
      averageOrderValue: 86.22,
      favoriteCategory: 'Mystery & Thriller',
      membershipTier: 'Gold',
      notes: 'Frequent buyer, prefers hardcover books',
      tags: ['vip', 'frequent-buyer'],
      recentOrders: [
        { id: 'ORD-789456', date: '2024-03-15', total: 103.16, status: 'delivered' },
        { id: 'ORD-654321', date: '2024-02-28', total: 67.89, status: 'delivered' },
        { id: 'ORD-123456', date: '2024-02-10', total: 45.99, status: 'delivered' }
      ],
      communicationPreferences: {
        email: true,
        sms: false,
        newsletter: true,
        promotions: true
      }
    },
    {
      id: 102,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      address: '456 Oak Avenue, Los Angeles, CA 90001',
      registrationDate: '2023-03-22',
      lastLogin: '2024-03-17 09:15:00',
      status: 'active',
      emailVerified: true,
      phoneVerified: false,
      totalOrders: 8,
      totalSpent: 567.34,
      averageOrderValue: 70.92,
      favoriteCategory: 'Self-Help',
      membershipTier: 'Silver',
      notes: 'Prefers e-books, usually buys during sales',
      tags: ['newsletter-subscriber'],
      recentOrders: [
        { id: 'ORD-123456', date: '2024-03-10', total: 54.65, status: 'processing' },
        { id: 'ORD-987654', date: '2024-02-15', total: 89.99, status: 'delivered' }
      ],
      communicationPreferences: {
        email: true,
        sms: true,
        newsletter: true,
        promotions: false
      }
    },
    {
      id: 103,
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.j@example.com',
      phone: '+1 (555) 456-7890',
      address: '789 Pine Road, Chicago, IL 60601',
      registrationDate: '2023-06-10',
      lastLogin: '2024-03-16 11:45:00',
      status: 'active',
      emailVerified: true,
      phoneVerified: true,
      totalOrders: 5,
      totalSpent: 289.75,
      averageOrderValue: 57.95,
      favoriteCategory: 'Science Fiction',
      membershipTier: 'Bronze',
      notes: 'Collects signed editions',
      tags: ['collector'],
      recentOrders: [
        { id: 'ORD-456123', date: '2024-03-05', total: 25.58, status: 'shipped' },
        { id: 'ORD-111222', date: '2024-02-20', total: 120.45, status: 'delivered' }
      ],
      communicationPreferences: {
        email: true,
        sms: false,
        newsletter: false,
        promotions: false
      }
    },
    {
      id: 104,
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      phone: '+1 (555) 321-0987',
      address: '321 Elm Street, Miami, FL 33101',
      registrationDate: '2023-08-05',
      lastLogin: '2024-02-28 16:20:00',
      status: 'inactive',
      emailVerified: true,
      phoneVerified: true,
      totalOrders: 3,
      totalSpent: 189.99,
      averageOrderValue: 63.33,
      favoriteCategory: 'Fiction',
      membershipTier: 'Bronze',
      notes: 'No recent activity',
      tags: ['inactive'],
      recentOrders: [
        { id: 'ORD-987654', date: '2024-02-28', total: 139.63, status: 'cancelled' }
      ],
      communicationPreferences: {
        email: false,
        sms: false,
        newsletter: false,
        promotions: false
      }
    },
    {
      id: 105,
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.b@example.com',
      phone: '+1 (555) 654-3210',
      address: '654 Maple Drive, Seattle, WA 98101',
      registrationDate: '2024-01-20',
      lastLogin: '2024-03-12 08:30:00',
      status: 'active',
      emailVerified: false,
      phoneVerified: false,
      totalOrders: 1,
      totalSpent: 68.61,
      averageOrderValue: 68.61,
      favoriteCategory: 'Fantasy',
      membershipTier: 'New',
      notes: 'New customer, first purchase',
      tags: ['new-customer'],
      recentOrders: [
        { id: 'ORD-654321', date: '2024-03-12', total: 68.61, status: 'pending' }
      ],
      communicationPreferences: {
        email: true,
        sms: true,
        newsletter: true,
        promotions: true
      }
    },
    {
      id: 106,
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1 (555) 789-0123',
      address: '987 Cedar Lane, Boston, MA 02101',
      registrationDate: '2023-11-30',
      lastLogin: '2024-03-15 10:20:00',
      status: 'active',
      emailVerified: true,
      phoneVerified: true,
      totalOrders: 15,
      totalSpent: 2345.89,
      averageOrderValue: 156.39,
      favoriteCategory: 'Business',
      membershipTier: 'Platinum',
      notes: 'Corporate account, bulk purchases',
      tags: ['vip', 'corporate', 'wholesale'],
      recentOrders: [
        { id: 'ORD-333444', date: '2024-03-14', total: 345.67, status: 'delivered' },
        { id: 'ORD-222333', date: '2024-03-01', total: 567.89, status: 'delivered' },
        { id: 'ORD-111999', date: '2024-02-15', total: 789.01, status: 'delivered' }
      ],
      communicationPreferences: {
        email: true,
        sms: true,
        newsletter: true,
        promotions: true
      }
    },
    {
      id: 107,
      firstName: 'David',
      lastName: 'Miller',
      email: 'david.m@example.com',
      phone: '+1 (555) 234-5678',
      address: '234 Birch Street, Austin, TX 73301',
      registrationDate: '2023-09-15',
      lastLogin: '2024-03-10 14:15:00',
      status: 'suspended',
      emailVerified: true,
      phoneVerified: true,
      totalOrders: 2,
      totalSpent: 145.67,
      averageOrderValue: 72.84,
      favoriteCategory: 'Technology',
      membershipTier: 'Bronze',
      notes: 'Account suspended due to payment issues',
      tags: ['suspended'],
      recentOrders: [],
      communicationPreferences: {
        email: false,
        sms: false,
        newsletter: false,
        promotions: false
      }
    },
    {
      id: 108,
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'lisa.a@example.com',
      phone: '+1 (555) 876-5432',
      address: '876 Walnut Street, Denver, CO 80201',
      registrationDate: '2024-02-10',
      lastLogin: '2024-03-18 16:45:00',
      status: 'active',
      emailVerified: true,
      phoneVerified: true,
      totalOrders: 6,
      totalSpent: 456.78,
      averageOrderValue: 76.13,
      favoriteCategory: 'Romance',
      membershipTier: 'Silver',
      notes: 'Active in book clubs',
      tags: ['book-club'],
      recentOrders: [
        { id: 'ORD-888777', date: '2024-03-17', total: 89.99, status: 'processing' },
        { id: 'ORD-777666', date: '2024-03-05', total: 67.89, status: 'delivered' }
      ],
      communicationPreferences: {
        email: true,
        sms: false,
        newsletter: true,
        promotions: true
      }
    }
  ]);

  const filterOptions = [
    { id: 'all', label: 'All Customers', count: customers.length, color: 'bg-gray-500' },
    { id: 'active', label: 'Active', count: customers.filter(c => c.status === 'active').length, color: 'bg-green-500' },
    { id: 'inactive', label: 'Inactive', count: customers.filter(c => c.status === 'inactive').length, color: 'bg-yellow-500' },
    { id: 'suspended', label: 'Suspended', count: customers.filter(c => c.status === 'suspended').length, color: 'bg-red-500' },
    { id: 'new', label: 'New', count: customers.filter(c => c.membershipTier === 'New').length, color: 'bg-blue-500' },
    { id: 'vip', label: 'VIP', count: customers.filter(c => c.tags.includes('vip')).length, color: 'bg-purple-500' }
  ];

  // Modal handlers
  const handleOpenModal = (mode, customer = null) => {
    setModalMode(mode);
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSaveCustomer = (customerData) => {
    if (modalMode === 'edit' && selectedCustomer) {
      setCustomers(customers.map(customer => 
        customer.id === selectedCustomer.id ? { ...customerData, id: customer.id } : customer
      ));
    } else if (modalMode === 'add') {
      // Add new customer
      const newCustomer = {
        ...customerData,
        id: Math.max(...customers.map(c => c.id)) + 1,
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'active',
        emailVerified: false,
        phoneVerified: false,
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        recentOrders: [],
        tags: [],
        communicationPreferences: {
          email: true,
          sms: false,
          newsletter: true,
          promotions: false
        }
      };
      setCustomers([...customers, newCustomer]);
    }
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== id));
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomers(customers.map(customer => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedCustomers.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedCustomers.length} selected customer(s)?`)) {
      setCustomers(customers.filter(customer => !selectedCustomers.includes(customer.id)));
      setSelectedCustomers([]);
    }
  };

  // Filter customers based on active filter and search term
  const filteredCustomers = customers.filter(customer => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'active' && customer.status === 'active') ||
      (activeFilter === 'inactive' && customer.status === 'inactive') ||
      (activeFilter === 'suspended' && customer.status === 'suspended') ||
      (activeFilter === 'new' && customer.membershipTier === 'New') ||
      (activeFilter === 'vip' && customer.tags.includes('vip'));
    
    const matchesSearch = searchTerm === '' || 
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="text-green-500" size={16} />;
      case 'inactive': return <Clock className="text-yellow-500" size={16} />;
      case 'suspended': return <XCircle className="text-red-500" size={16} />;
      default: return <AlertCircle className="text-gray-500" size={16} />;
    }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Never';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const averageCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers Management</h1>
          <p className="text-gray-600">Manage and analyze your customer base</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center">
            <Download size={20} className="mr-2" />
            Export
          </button>
          <button 
            onClick={() => handleOpenModal('add')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <UserPlus size={20} className="mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Customers</p>
              <p className="text-2xl font-bold">{totalCustomers}</p>
            </div>
            <Users size={32} className="opacity-80" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+12.5% from last month</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Customers</p>
              <p className="text-2xl font-bold">{activeCustomers}</p>
            </div>
            <CheckCircle size={32} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm opacity-90">
            {((activeCustomers / totalCustomers) * 100).toFixed(1)}% of total
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign size={32} className="opacity-80" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+8.3% from last month</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg. Customer Value</p>
              <p className="text-2xl font-bold">{formatCurrency(averageCustomerValue)}</p>
            </div>
            <User size={32} className="opacity-80" />
          </div>
          <div className="mt-4 flex items-center text-sm">
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
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select className="border rounded-lg px-3 py-2">
                <option>All Membership Tiers</option>
                <option>Platinum</option>
                <option>Gold</option>
                <option>Silver</option>
                <option>Bronze</option>
                <option>New</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select className="border rounded-lg px-3 py-2">
                <option>Sort by: Registration Date</option>
                <option>Sort by: Total Spent</option>
                <option>Sort by: Last Login</option>
                <option>Sort by: Name</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-blue-700 font-medium">
              {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              <Mail size={16} className="mr-1" />
              Send Email
            </button>
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              <MessageSquare size={16} className="mr-1" />
              Send SMS
            </button>
            <button 
              onClick={handleDeleteSelected}
              className="text-red-600 hover:text-red-700 font-medium flex items-center"
            >
              <Trash2 size={16} className="mr-1" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <React.Fragment key={customer.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-sm text-gray-500">ID: CUST-{customer.id}</div>
                          <div className="text-xs text-gray-400">
                            Joined {formatDate(customer.registrationDate)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail size={14} className="text-gray-400 mr-2" />
                          <span>{customer.email}</span>
                          {customer.emailVerified && (
                            <CheckCircle size={14} className="text-green-500 ml-1" />
                          )}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone size={14} className="text-gray-400 mr-2" />
                          <span>{customer.phone}</span>
                          {customer.phoneVerified && (
                            <CheckCircle size={14} className="text-green-500 ml-1" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)} flex items-center`}>
                          {getStatusIcon(customer.status)}
                          <span className="ml-1">{customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMembershipColor(customer.membershipTier)}`}>
                        {customer.membershipTier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Package size={16} className="text-gray-400 mr-2" />
                        <span className="font-medium">{customer.totalOrders}</span>
                        {customer.recentOrders.length > 0 && (
                          <span className="ml-2 text-sm text-gray-500">
                            ({customer.recentOrders.length} recent)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {formatCurrency(customer.totalSpent)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Avg: {formatCurrency(customer.averageOrderValue)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={14} className="mr-2" />
                        {formatDateTime(customer.lastLogin)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition"
                          title={expandedCustomer === customer.id ? "Hide Details" : "View Details"}
                        >
                          {expandedCustomer === customer.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        <button 
                          onClick={() => handleOpenModal('view', customer)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition"
                          title="View Full Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleOpenModal('edit', customer)}
                          className="p-1 text-gray-400 hover:text-green-600 transition"
                          title="Edit Customer"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row Details */}
                  {expandedCustomer === customer.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="9" className="px-6 py-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Customer Details */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Customer Details</h4>
                            <div className="space-y-3">
                              <div className="flex items-start">
                                <MapPin size={16} className="text-gray-400 mt-1 mr-2" />
                                <div>
                                  <p className="text-sm font-medium">Address</p>
                                  <p className="text-sm text-gray-600">{customer.address}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Star size={16} className="text-gray-400 mr-2" />
                                <div>
                                  <p className="text-sm font-medium">Favorite Category</p>
                                  <p className="text-sm text-gray-600">{customer.favoriteCategory}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <MessageSquare size={16} className="text-gray-400 mr-2" />
                                <div>
                                  <p className="text-sm font-medium">Notes</p>
                                  <p className="text-sm text-gray-600">{customer.notes}</p>
                                </div>
                              </div>
                              {customer.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {customer.tags.map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Recent Orders */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Recent Orders</h4>
                            {customer.recentOrders.length > 0 ? (
                              <div className="space-y-2">
                                {customer.recentOrders.map((order) => (
                                  <div key={order.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                    <div>
                                      <p className="font-medium text-sm">{order.id}</p>
                                      <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">{formatCurrency(order.total)}</p>
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {order.status}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">No recent orders</p>
                            )}
                          </div>

                          {/* Communication Preferences */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Communication Preferences</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                <span className="text-sm">Email Notifications</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  customer.communicationPreferences.email 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {customer.communicationPreferences.email ? 'Enabled' : 'Disabled'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                <span className="text-sm">SMS Notifications</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  customer.communicationPreferences.sms 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {customer.communicationPreferences.sms ? 'Enabled' : 'Disabled'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                <span className="text-sm">Newsletter</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  customer.communicationPreferences.newsletter 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {customer.communicationPreferences.newsletter ? 'Subscribed' : 'Unsubscribed'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                <span className="text-sm">Promotional Offers</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  customer.communicationPreferences.promotions 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {customer.communicationPreferences.promotions ? 'Enabled' : 'Disabled'}
                                </span>
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCustomers.length}</span> of{' '}
            <span className="font-medium">{customers.length}</span> customers
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

      {/* Customer Modal */}
      <CustomerModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        initialData={selectedCustomer}
        onSave={handleSaveCustomer}
      />
    </div>
  );
};

export default CustomersManagement;