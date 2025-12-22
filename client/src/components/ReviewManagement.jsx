import React, { useState } from 'react';
import { 
  Search, Filter, Check, X, Edit, Trash2, Eye, MoreVertical, 
  Star, User, Calendar, BookOpen, AlertCircle, RefreshCw,
  ChevronDown, ChevronUp, MessageSquare, ThumbsUp, ThumbsDown,
  ArrowUpDown, Download, StarHalf
} from 'lucide-react';
import ReviewModal from './ReviewModal';


const ReviewsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedReview, setSelectedReview] = useState(null);
  const [expandedReview, setExpandedReview] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample reviews data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      book: {
        id: 101,
        title: 'The Silent Patient',
        author: 'Alex Michaelides',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
      },
      customer: {
        id: 201,
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
      },
      rating: 5,
      title: 'Absolutely Gripping!',
      content: 'This book kept me on the edge of my seat from start to finish. The plot twists were incredible and I never saw the ending coming. Highly recommend to any thriller lover!',
      status: 'approved',
      helpfulCount: 24,
      unhelpfulCount: 2,
      verifiedPurchase: true,
      createdAt: '2024-03-15T14:30:00',
      updatedAt: '2024-03-15T14:30:00',
      response: {
        adminName: 'Sarah Johnson',
        content: 'Thank you for your detailed review! We\'re glad you enjoyed the unexpected twists.',
        createdAt: '2024-03-16T10:15:00'
      }
    },
    {
      id: 2,
      book: {
        id: 102,
        title: 'Atomic Habits',
        author: 'James Clear',
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400'
      },
      customer: {
        id: 202,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
      },
      rating: 4,
      title: 'Practical and Insightful',
      content: 'A great book with actionable advice. The concepts are explained clearly with real-world examples. Changed my approach to building habits.',
      status: 'approved',
      helpfulCount: 18,
      unhelpfulCount: 1,
      verifiedPurchase: true,
      createdAt: '2024-03-12T09:15:00',
      updatedAt: '2024-03-12T09:15:00',
      response: null
    },
    {
      id: 3,
      book: {
        id: 103,
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'
      },
      customer: {
        id: 203,
        name: 'Robert Johnson',
        email: 'robert.j@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      },
      rating: 3,
      title: 'Good but predictable',
      content: 'The science was interesting but I found the plot predictable compared to The Martian. Still an enjoyable read.',
      status: 'pending',
      helpfulCount: 8,
      unhelpfulCount: 3,
      verifiedPurchase: true,
      createdAt: '2024-03-10T16:45:00',
      updatedAt: '2024-03-10T16:45:00',
      response: null
    },
    {
      id: 4,
      book: {
        id: 104,
        title: 'The Midnight Library',
        author: 'Matt Haig',
        image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400'
      },
      customer: {
        id: 204,
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
      },
      rating: 2,
      title: 'Overhyped',
      content: 'I was really looking forward to this book based on the reviews, but found it repetitive and the message heavy-handed.',
      status: 'rejected',
      helpfulCount: 5,
      unhelpfulCount: 12,
      verifiedPurchase: true,
      createdAt: '2024-03-08T11:20:00',
      updatedAt: '2024-03-08T11:20:00',
      response: {
        adminName: 'Sarah Johnson',
        content: 'We appreciate your honest feedback. Every reader\'s experience is unique.',
        createdAt: '2024-03-09T14:30:00'
      }
    },
    {
      id: 5,
      book: {
        id: 105,
        title: 'Dune',
        author: 'Frank Herbert',
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400'
      },
      customer: {
        id: 205,
        name: 'Michael Brown',
        email: 'michael.b@example.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
      },
      rating: 5,
      title: 'Timeless Classic',
      content: 'Even after all these years, Dune remains one of the most epic sci-fi novels ever written. The world-building is unparalleled.',
      status: 'approved',
      helpfulCount: 42,
      unhelpfulCount: 2,
      verifiedPurchase: false,
      createdAt: '2024-03-05T14:10:00',
      updatedAt: '2024-03-05T14:10:00',
      response: null
    },
    {
      id: 6,
      book: {
        id: 106,
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400'
      },
      customer: {
        id: 206,
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
      },
      rating: 4,
      title: 'Charming Adventure',
      content: 'A delightful introduction to Middle-earth. Perfect for both children and adults. Bilbo\'s journey is heartwarming.',
      status: 'approved',
      helpfulCount: 31,
      unhelpfulCount: 1,
      verifiedPurchase: true,
      createdAt: '2024-03-01T10:30:00',
      updatedAt: '2024-03-01T10:30:00',
      response: null
    },
    {
      id: 7,
      book: {
        id: 107,
        title: 'Educated',
        author: 'Tara Westover',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'
      },
      customer: {
        id: 207,
        name: 'David Miller',
        email: 'david.m@example.com',
        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005-128?w=100'
      },
      rating: 5,
      title: 'Life-Changing Read',
      content: 'An incredible memoir about resilience and the power of education. Couldn\'t put it down.',
      status: 'pending',
      helpfulCount: 15,
      unhelpfulCount: 0,
      verifiedPurchase: true,
      createdAt: '2024-02-28T15:45:00',
      updatedAt: '2024-02-28T15:45:00',
      response: null
    },
    {
      id: 8,
      book: {
        id: 108,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        image: 'https://images.unsplash.com/photo-1531346688376-ab6275c4725e?w=400'
      },
      customer: {
        id: 208,
        name: 'Lisa Anderson',
        email: 'lisa.a@example.com',
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100'
      },
      rating: 3,
      title: 'Interesting but dense',
      content: 'The concepts are fascinating but the writing can be dry at times. Worth reading for the ideas.',
      status: 'approved',
      helpfulCount: 9,
      unhelpfulCount: 4,
      verifiedPurchase: true,
      createdAt: '2024-02-25T13:20:00',
      updatedAt: '2024-02-25T13:20:00',
      response: {
        adminName: 'Michael Chen',
        content: 'Thank you for your thoughtful review. We appreciate balanced feedback.',
        createdAt: '2024-02-26T09:15:00'
      }
    }
  ]);

  const filterOptions = [
    { id: 'all', label: 'All Reviews', count: reviews.length, color: 'bg-gray-500' },
    { id: 'pending', label: 'Pending', count: reviews.filter(r => r.status === 'pending').length, color: 'bg-yellow-500' },
    { id: 'approved', label: 'Approved', count: reviews.filter(r => r.status === 'approved').length, color: 'bg-green-500' },
    { id: 'rejected', label: 'Rejected', count: reviews.filter(r => r.status === 'rejected').length, color: 'bg-red-500' },
    { id: 'unanswered', label: 'Unanswered', count: reviews.filter(r => !r.response).length, color: 'bg-blue-500' }
  ];

  // Modal handlers
  const handleOpenModal = (mode, review = null) => {
    setModalMode(mode);
    setSelectedReview(review);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReview(null);
  };

  const handleSaveReview = (reviewData) => {
    if (modalMode === 'edit' && selectedReview) {
      setReviews(reviews.map(review => 
        review.id === selectedReview.id ? { ...reviewData, id: review.id } : review
      ));
    }
  };

  const handleDeleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(review => review.id !== id));
      setSelectedReviews(selectedReviews.filter(reviewId => reviewId !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReviews(reviews.map(review => review.id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelectReview = (id) => {
    if (selectedReviews.includes(id)) {
      setSelectedReviews(selectedReviews.filter(reviewId => reviewId !== id));
    } else {
      setSelectedReviews([...selectedReviews, id]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedReviews.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedReviews.length} selected review(s)?`)) {
      setReviews(reviews.filter(review => !selectedReviews.includes(review.id)));
      setSelectedReviews([]);
    }
  };

  const handleApproveReview = (id) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: 'approved' } : review
    ));
  };

  const handleRejectReview = (id) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: 'rejected' } : review
    ));
  };

  const handleToggleStatus = (id) => {
    setReviews(reviews.map(review => 
      review.id === id 
        ? { ...review, status: review.status === 'approved' ? 'rejected' : 'approved' }
        : review
    ));
  };

  // Filter reviews based on active filter and search term
  const filteredReviews = reviews.filter(review => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'pending' && review.status === 'pending') ||
      (activeFilter === 'approved' && review.status === 'approved') ||
      (activeFilter === 'rejected' && review.status === 'rejected') ||
      (activeFilter === 'unanswered' && !review.response);
    
    const matchesSearch = searchTerm === '' || 
      review.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={`${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Calculate statistics
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const reviewsWithResponse = reviews.filter(r => r.response).length;
  const helpfulReviews = reviews.reduce((sum, review) => sum + review.helpfulCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-600">Monitor and manage customer reviews</p>
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
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Reviews</p>
              <p className="text-2xl font-bold">{reviews.length}</p>
            </div>
            <MessageSquare size={32} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm">
            Avg. Rating: {averageRating.toFixed(1)}/5
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending Reviews</p>
              <p className="text-2xl font-bold">{pendingReviews}</p>
            </div>
            <AlertCircle size={32} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm">
            Requires attention
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Approved</p>
              <p className="text-2xl font-bold">
                {reviews.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <Check size={32} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm">
            {((reviews.filter(r => r.status === 'approved').length / reviews.length) * 100).toFixed(1)}% of total
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Helpful Votes</p>
              <p className="text-2xl font-bold">{helpfulReviews}</p>
            </div>
            <ThumbsUp size={32} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm">
            Community engagement
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
              placeholder="Search reviews by customer, book, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select className="border rounded-lg px-3 py-2">
                <option>All Ratings</option>
                <option>5 Stars</option>
                <option>4 Stars</option>
                <option>3 Stars</option>
                <option>2 Stars</option>
                <option>1 Star</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowUpDown size={20} className="text-gray-400" />
              <select className="border rounded-lg px-3 py-2">
                <option>Sort by: Date (Newest)</option>
                <option>Sort by: Rating (Highest)</option>
                <option>Sort by: Helpful Votes</option>
                <option>Sort by: Book Title</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-blue-700 font-medium">
              {selectedReviews.length} review{selectedReviews.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              <Check size={16} className="mr-1" />
              Approve Selected
            </button>
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              <X size={16} className="mr-1" />
              Reject Selected
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

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <React.Fragment key={review.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedReviews.includes(review.id)}
                        onChange={() => handleSelectReview(review.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{review.content}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <ThumbsUp size={14} className="mr-1" />
                            {review.helpfulCount}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <ThumbsDown size={14} className="mr-1" />
                            {review.unhelpfulCount}
                          </div>
                          {review.verifiedPurchase && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden mr-3">
                          <img 
                            src={review.book.image} 
                            alt={review.book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{review.book.title}</div>
                          <div className="text-xs text-gray-500">{review.book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                          {review.customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{review.customer.name}</div>
                          <div className="text-xs text-gray-500">{review.customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {formatDate(review.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition"
                          title={expandedReview === review.id ? "Hide Details" : "View Details"}
                        >
                          {expandedReview === review.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        <button 
                          onClick={() => handleOpenModal('view', review)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition"
                          title="View Full Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleOpenModal('edit', review)}
                          className="p-1 text-gray-400 hover:text-green-600 transition"
                          title="Edit Review"
                        >
                          <Edit size={18} />
                        </button>
                        {review.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApproveReview(review.id)}
                              className="p-1 text-gray-400 hover:text-green-600 transition"
                              title="Approve Review"
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => handleRejectReview(review.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition"
                              title="Reject Review"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row Details */}
                  {expandedReview === review.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="8" className="px-6 py-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Review Details */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Review Details</h4>
                            <div className="bg-white p-4 rounded-lg border">
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium">{review.title}</h5>
                                  {renderStars(review.rating)}
                                </div>
                                <p className="text-gray-700">{review.content}</p>
                              </div>
                              
                              <div className="border-t pt-3">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                      <ThumbsUp size={14} className="mr-1" />
                                      <span>{review.helpfulCount} helpful</span>
                                    </div>
                                    <div className="flex items-center">
                                      <ThumbsDown size={14} className="mr-1" />
                                      <span>{review.unhelpfulCount} unhelpful</span>
                                    </div>
                                  </div>
                                  <div className="text-gray-500">
                                    Posted: {formatDateTime(review.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions & Response */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                {review.status === 'pending' ? (
                                  <>
                                    <button 
                                      onClick={() => handleApproveReview(review.id)}
                                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition flex items-center justify-center"
                                    >
                                      <Check size={16} className="mr-2" />
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => handleRejectReview(review.id)}
                                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center justify-center"
                                    >
                                      <X size={16} className="mr-2" />
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <button 
                                    onClick={() => handleToggleStatus(review.id)}
                                    className="col-span-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center justify-center"
                                  >
                                    {review.status === 'approved' ? 'Mark as Rejected' : 'Mark as Approved'}
                                  </button>
                                )}
                              </div>

                              {/* Admin Response */}
                              {review.response ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <h5 className="font-medium text-blue-900 mb-2">Admin Response</h5>
                                  <p className="text-blue-800 mb-2">{review.response.content}</p>
                                  <div className="text-sm text-blue-600">
                                    By {review.response.adminName} • {formatDateTime(review.response.createdAt)}
                                  </div>
                                </div>
                              ) : (
                                <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center">
                                  <MessageSquare size={16} className="mr-2" />
                                  Add Response
                                </button>
                              )}
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

        {/* Empty State */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No reviews match "${searchTerm}"`
                : 'No reviews available for the selected filters'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredReviews.length > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredReviews.length}</span> of{' '}
              <span className="font-medium">{reviews.length}</span> reviews
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        initialData={selectedReview}
        onSave={handleSaveReview}
      />
    </div>
  );
};

export default ReviewsManagement;