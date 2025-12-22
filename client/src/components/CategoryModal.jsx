import React, { useState, useEffect } from 'react';
import { 
  X, Tag, Type, Hash, FileText, Palette, Save, Eye, 
  AlertCircle, Check, Plus, Minus
} from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, mode = 'view', initialData = null, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '📚',
    color: '#3B82F6',
    status: 'active'
  });

  // Icon options
  const iconOptions = ['📚', '🔍', '🚀', '💪', '✨', '👤', '💼', '💻', '👶', '❤️', '🎨', '🎭', '🌍', '⚡', '🌟'];

  // Color options
  const colorOptions = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899',
    '#6366F1', '#059669', '#2563EB', '#F97316', '#DC2626',
    '#7C3AED', '#0284C7', '#0D9488', '#CA8A04', '#DB2777'
  ];

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        icon: initialData.icon || '📚',
        color: initialData.color || '#3B82F6',
        status: initialData.status || 'active'
      });
    } else if (mode === 'add') {
      // Reset form for new category
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '📚',
        color: '#3B82F6',
        status: 'active'
      });
    }
  }, [initialData, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from name
    if (name === 'name' && mode === 'add') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const categoryData = {
        ...formData,
        id: initialData?.id || Math.floor(Math.random() * 1000) + 1,
        booksCount: initialData?.booksCount || 0,
        createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0]
      };

      if (onSave) {
        onSave(categoryData);
      }

      setLoading(false);
      onClose();
    }, 1000);
  };

  const getModalTitle = () => {
    if (mode === 'add') return 'Add New Category';
    if (mode === 'edit') return 'Edit Category';
    return formData.name;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="p-2 rounded-lg mr-3"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                <span style={{ color: formData.color }} className="text-xl">{formData.icon}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{getModalTitle()}</h2>
                <p className="text-sm text-gray-600">
                  {mode === 'view' ? 'Category details' : 
                   mode === 'edit' ? 'Update category information' : 
                   'Add a new category'}
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

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <div className="flex items-center p-3 border rounded-lg">
                    <Type size={20} className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={mode === 'view'}
                      className="flex-1 outline-none disabled:bg-transparent"
                      placeholder="e.g., Mystery & Thriller"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <div className="flex items-center p-3 border rounded-lg">
                    <Hash size={20} className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      disabled={mode === 'view'}
                      className="flex-1 outline-none disabled:bg-transparent"
                      placeholder="e.g., mystery-thriller"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="p-3 border rounded-lg">
                    <FileText size={20} className="text-gray-400 mb-2" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={mode === 'view'}
                      rows="3"
                      className="w-full outline-none resize-none disabled:bg-transparent"
                      placeholder="Brief description of the category..."
                    />
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => {
                          if (mode !== 'view') {
                            setFormData(prev => ({ ...prev, icon }));
                          }
                        }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl hover:scale-105 transition ${
                          formData.icon === icon 
                            ? 'ring-2 ring-blue-500' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          if (mode !== 'view') {
                            setFormData(prev => ({ ...prev, color }));
                          }
                        }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center hover:scale-105 transition ${
                          formData.color === color 
                            ? 'ring-2 ring-offset-2 ring-gray-400' 
                            : ''
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {formData.color === color && (
                          <Check size={20} className="text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                {mode !== 'view' && (
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
                    </select>
                  </div>
                )}

                {/* Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4"
                      style={{ backgroundColor: `${formData.color}20` }}
                    >
                      <span style={{ color: formData.color }}>{formData.icon}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{formData.name || 'Category Name'}</p>
                      <p className="text-sm text-gray-500">
                        {formData.slug || 'category-slug'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

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
                          {mode === 'add' ? <Plus size={16} className="mr-2" /> : <Save size={16} className="mr-2" />}
                          {mode === 'add' ? 'Add Category' : 'Save Changes'}
                        </>
                      )}
                    </button>
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Save size={16} className="inline mr-2" />
                      Edit Category
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

export default CategoryModal;