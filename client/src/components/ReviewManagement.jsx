import React, { useState} from 'react';
import { 
  Search, Filter, Check, X, Edit, Trash2, Eye, MoreVertical, 
  Star, User, Calendar, BookOpen, AlertCircle, RefreshCw,
  ChevronDown, ChevronUp, MessageSquare, ThumbsUp, ThumbsDown,
  ArrowUpDown, Download, StarHalf, Loader2
} from 'lucide-react';
import ReviewModal from './ReviewModal';
import { useBookStore } from './BookstoreContext';

const ReviewsManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedReview, setSelectedReview] = useState(null);
  const [expandedReview, setExpandedReview] = useState(null);
  const [isAddingResponse, setIsAddingResponse] = useState(null);
  const [responseContent, setResponseContent] = useState('');

  // Get context values
  const {
    reviews,
    selectedReviews,
    activeReviewFilter,
    reviewSearchTerm,
    reviewStats,
    reviewFilterOptions,
    
    fetchReviews,
    approveReview,
    rejectReview,
    updateReview,
    deleteReview,
    deleteSelectedReviews,
    addAdminResponse,
    setSelectedReviews,
    setActiveReviewFilter,
    setReviewSearchTerm,
    getFilteredReviews,
    
    isLoading,
    error,
    user
  } = useBookStore();

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

  const handleSaveReview = async (reviewData) => {
    try {
      if (modalMode === 'edit' && selectedReview) {
        await updateReview(selectedReview.id, reviewData);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save review:', err);
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(id);
      } catch (err) {
        console.error('Failed to delete review:', err);
      }
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const filtered = getFilteredReviews();
      setSelectedReviews(filtered.map(review => review.id));
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

  const handleDeleteSelected = async () => {
    if (selectedReviews.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedReviews.length} selected review(s)?`)) {
      try {
        await deleteSelectedReviews();
      } catch (err) {
        console.error('Failed to delete selected reviews:', err);
      }
    }
  };

  const handleApproveReview = async (id) => {
    try {
      await approveReview(id);
    } catch (err) {
      console.error('Failed to approve review:', err);
    }
  };

  const handleRejectReview = async (id) => {
    try {
      await rejectReview(id);
    } catch (err) {
      console.error('Failed to reject review:', err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      if (currentStatus === 'approved') {
        await rejectReview(id);
      } else {
        await approveReview(id);
      }
    } catch (err) {
      console.error('Failed to toggle review status:', err);
    }
  };

  const handleAddResponse = async (reviewId) => {
    if (!responseContent.trim()) return;
    
    try {
      await addAdminResponse(reviewId, {
        content: responseContent,
        adminName: user?.name || 'Admin'
      });
      setIsAddingResponse(null);
      setResponseContent('');
    } catch (err) {
      console.error('Failed to add response:', err);
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchReviews();
    } catch (err) {
      console.error('Failed to refresh reviews:', err);
    }
  };

  // Get filtered reviews
  const filteredReviews = getFilteredReviews();

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
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
        <span className="ml-2 text-sm font-medium">{rating?.toFixed(1) || '0.0'}</span>
      </div>
    );
  };

  // Loading and error states
  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center text-red-700">
          <AlertCircle className="mr-2" />
          Error loading reviews: {error}
        </div>
        <button 
          onClick={fetchReviews}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Access Required</h3>
        <p className="text-gray-600">You need administrator privileges to access review management.</p>
      </div>
    );
  }

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
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={20} className="mr-2 animate-spin" />
            ) : (
              <RefreshCw size={20} className="mr-2" />
            )}
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
              <p className="text-2xl font-bold">{reviewStats.totalReviews}</p>
            </div>
            <MessageSquare size={32} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm">
            Avg. Rating: {reviewStats.averageRating.toFixed(1)}/5
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending Reviews</p>
              <p className="text-2xl font-bold">{reviewStats.pendingReviews}</p>
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
                {reviewStats.approvedReviews}
              </p>
            </div>
            <Check size={32} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm">
            {reviewStats.totalReviews > 0 ? 
              ((reviewStats.approvedReviews / reviewStats.totalReviews) * 100).toFixed(1) : 0}% of total
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Helpful Votes</p>
              <p className="text-2xl font-bold">{reviewStats.helpfulVotes}</p>
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
        {reviewFilterOptions.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveReviewFilter(filter.id)}
            className={`px-4 py-2 rounded-full flex items-center ${activeReviewFilter === filter.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
          >
            <span className={`w-2 h-2 rounded-full ${filter.color} mr-2`}></span>
            {filter.label}
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeReviewFilter === filter.id ? 'bg-white/20' : 'bg-gray-100'}`}>
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
              value={reviewSearchTerm}
              onChange={(e) => setReviewSearchTerm(e.target.value)}
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
            <button 
              onClick={async () => {
                for (const id of selectedReviews) {
                  await approveReview(id);
                }
              }}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              <Check size={16} className="mr-1" />
              Approve Selected
            </button>
            <button 
              onClick={async () => {
                for (const id of selectedReviews) {
                  await rejectReview(id);
                }
              }}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
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
                        <h4 className="font-medium text-gray-900 mb-1">{review.title || 'No Title'}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{review.content}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <ThumbsUp size={14} className="mr-1" />
                            {review.helpfulCount || 0}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <ThumbsDown size={14} className="mr-1" />
                            {review.unhelpfulCount || 0}
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
                          {review.book?.image ? (
                            <img 
                              src={review.book.image} 
                              alt={review.book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              <BookOpen size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{review.book?.title || 'Unknown Book'}</div>
                          <div className="text-xs text-gray-500">{review.book?.author || 'Unknown Author'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                          {review.user?.second_name}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{review.user?.second_name|| 'Anonymous'}</div>
                          <div className="text-xs text-gray-500">{ review.user?.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                        {review.status?.charAt(0).toUpperCase() + review.status?.slice(1) || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {formatDate(review.created_at)}
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
                                  <h5 className="font-medium">{review.title || 'No Title'}</h5>
                                  {renderStars(review.rating)}
                                </div>
                                <p className="text-gray-700">{review.content}</p>
                              </div>
                              
                              <div className="border-t pt-3">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                      <ThumbsUp size={14} className="mr-1" />
                                      <span>{review.helpfulCount || 0} helpful</span>
                                    </div>
                                    <div className="flex items-center">
                                      <ThumbsDown size={14} className="mr-1" />
                                      <span>{review.unhelpfulCount || 0} unhelpful</span>
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
                                    onClick={() => handleToggleStatus(review.id, review.status)}
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
                              ) : isAddingResponse === review.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={responseContent}
                                    onChange={(e) => setResponseContent(e.target.value)}
                                    placeholder="Type your response here..."
                                    className="w-full p-3 border rounded-lg"
                                    rows="3"
                                  />
                                  <div className="flex space-x-2">
                                    <button 
                                      onClick={() => handleAddResponse(review.id)}
                                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                      Send Response
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setIsAddingResponse(null);
                                        setResponseContent('');
                                      }}
                                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setIsAddingResponse(review.id)}
                                  className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center"
                                >
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
              {reviewSearchTerm 
                ? `No reviews match "${reviewSearchTerm}"`
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