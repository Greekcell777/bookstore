import React, { useState, useEffect } from 'react';
import { 
  X, Star, User, BookOpen, Calendar, MessageSquare, 
  ThumbsUp, ThumbsDown, CheckCircle, Edit, Save,
  AlertCircle, Mail, Check, X as XIcon, Download
} from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, mode = 'view', initialData = null, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    adminResponse: ''
  });

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        status: initialData.status || '',
        adminResponse: initialData.response?.content || ''
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
        status: formData.status,
        response: formData.adminResponse ? {
          adminName: 'Admin User',
          content: formData.adminResponse,
          createdAt: new Date().toISOString()
        } : initialData.response
      };

      if (onSave) {
        onSave(updatedData);
      }

      setLoading(false);
      onClose();
    }, 1500);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={20}
            className={`${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-lg font-bold">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
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
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                <MessageSquare size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Review Details</h2>
                <p className="text-sm text-gray-600">Review #{initialData.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Review Header */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                        {initialData.customer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{initialData.customer.name}</h3>
                        <p className="text-sm text-gray-600">{initialData.customer.email}</p>
                        {initialData.verifiedPurchase && (
                          <div className="flex items-center mt-1">
                            <CheckCircle size={14} className="text-green-500 mr-1" />
                            <span className="text-xs text-green-600">Verified Purchase</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {renderStars(initialData.rating)}
                      <div className="mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(initialData.status)}`}>
                          {initialData.status.charAt(0).toUpperCase() + initialData.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Book Information */}
                <div className="border rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen size={20} className="mr-2" />
                    Book Information
                  </h3>
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4">
                      <img 
                        src={initialData.book.image} 
                        alt={initialData.book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{initialData.book.title}</h4>
                      <p className="text-gray-600">by {initialData.book.author}</p>
                      <p className="text-sm text-gray-500 mt-1">Book ID: {initialData.book.id}</p>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="border rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Review Content</h3>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{initialData.title}</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{initialData.content}</p>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <ThumbsUp size={16} className="text-gray-400 mr-2" />
                          <span className="font-medium">{initialData.helpfulCount}</span>
                          <span className="text-sm text-gray-600 ml-1">helpful</span>
                        </div>
                        <div className="flex items-center">
                          <ThumbsDown size={16} className="text-gray-400 mr-2" />
                          <span className="font-medium">{initialData.unhelpfulCount}</span>
                          <span className="text-sm text-gray-600 ml-1">unhelpful</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <Calendar size={14} className="inline mr-1" />
                        {formatDateTime(initialData.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Response */}
                {initialData.response && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">Admin Response</h3>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3 mt-1">
                        {initialData.response.adminName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-blue-800 mb-2">{initialData.response.content}</p>
                        <div className="text-sm text-blue-600">
                          By {initialData.response.adminName} • {formatDateTime(initialData.response.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Form */}
                {mode === 'edit' && (
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Moderate Review</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Review Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Response
                        </label>
                        <textarea
                          name="adminResponse"
                          value={formData.adminResponse}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full p-3 border rounded-lg outline-none resize-none"
                          placeholder="Add a response to this review..."
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Your response will be visible to the customer and other readers.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              {mode === 'edit' && (
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
                        type="button"
                        onClick={() => {
                          // Quick approve
                          const updatedData = {
                            ...initialData,
                            status: 'approved'
                          };
                          if (onSave) onSave(updatedData);
                          onClose();
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
                      >
                        <Check size={16} className="mr-2" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // Quick reject
                          const updatedData = {
                            ...initialData,
                            status: 'rejected'
                          };
                          if (onSave) onSave(updatedData);
                          onClose();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
                      >
                        <XIcon size={16} className="mr-2" />
                        Reject
                      </button>
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
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Review
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

export default ReviewModal;