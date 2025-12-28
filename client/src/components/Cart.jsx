import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronLeft,
  Package,
  Truck,
  Shield,
  Heart,
  X,
  AlertCircle,
  Tag,
  Lock,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useBookStore } from '../components/BookstoreContext'; // Add this import

const Cart = () => {
  const navigate = useNavigate();
  
  // Use SimpleBookStore context
  const { 
    cart, 
    cartTotal,
    cartItemCount,
    removeFromCart, 
    clearCart,
    addToCart,
    updateCartItem,
    isLoading,
    error,
    user
  } = useBookStore();
  
  console.log(cartTotal)
  
  const [suggestedItems, setSuggestedItems] = useState([
    {
      id: 4,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      price: 26.99,
      image: "https://images.unsplash.com/photo-1531346688376-ab6275c4725e?w-300&h=400&fit=crop",
      category: "Fiction"
    },
    {
      id: 5,
      title: "The Four Winds",
      author: "Kristin Hannah",
      price: 23.99,
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
      category: "Historical Fiction"
    }
  ]);

  // Calculate totals from context cart
  const calculateTotals = () => {
    // Use cartTotal from context for subtotal
    const subtotal = cartTotal || cart.reduce((sum, item) => {
      const price = item.price || item.book?.sale_price || item.book?.list_price || 0;
      return sum + (price * (item.quantity || 1));
    }, 0);
    
    const shipping = subtotal > 35 ? 0 : 5.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();
  const itemCount = cartItemCount || cart.reduce((count, item) => count + (item.quantity || 1), 0);

  // Update quantity using context
  const updateQuantity = async (itemId, bookId, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(itemId, bookId);
      return;
    }
    
    // Check if item exists and validate max quantity
    const item = cart.find(item => item.id === itemId || item.bookId === bookId);
    if (item && newQuantity > (item.maxQuantity || 10)) {
      alert(`Maximum quantity is ${item.maxQuantity || 10}`);
      return;
    }
    
    try {
      // Use context function to update cart item
      if (updateCartItem) {
        await updateCartItem(itemId, newQuantity);
      } else {
        // Fallback to addToCart if updateCartItem doesn't exist
        console.warn('updateCartItem not available in context');
        // You might need to implement this function in your context
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity');
    }
  };

  // Remove item using context
  const removeItem = async (itemId, bookId) => {
    try {
      await removeFromCart(itemId || bookId);
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item');
    }
  };

  // Move to wishlist
  const moveToWishlist = async (item) => {
    if (!user) {
      alert('Please login to save items to wishlist');
      navigate('/login', { 
        state: { redirectTo: '/cart' }
      });
      return;
    }
    
    try {
      // First add to wishlist
      await addToWishlist(item.bookId || item.book?.id);
      // Then remove from cart
      await removeFromCart(item.id);
    } catch (err) {
      console.error('Error moving to wishlist:', err);
      alert('Failed to move item to wishlist');
    }
  };

  // Add suggested item
  const addSuggestedItem = async (item) => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login', { 
        state: { redirectTo: '/cart' }
      });
      return;
    }
    
    try {
      await addToCart(item.id, 1);
    } catch (err) {
      console.error('Error adding suggested item:', err);
      alert('Failed to add item to cart');
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!user) {
      alert('Please login to checkout');
      navigate('/login', { 
        state: { 
          redirectTo: '/checkout',
          message: 'Please login to complete your purchase'
        }
      });
      return;
    }
    
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    navigate('/checkout');
  };

  // Continue shopping
  const handleContinueShopping = () => {
    navigate('/catalog');
  };

  // Loading state
  if (isLoading && cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center hover:text-blue-600 transition-colors"
              >
                <ChevronLeft size={16} className="mr-1" />
                Back
              </button>
              <span>/</span>
              <span className="text-gray-900">Shopping Cart</span>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <ShoppingCart size={48} className="text-blue-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any books to your cart yet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/catalog"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Browse Books
              </Link>
              <Link
                to="/bestsellers"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                View Bestsellers
              </Link>
            </div>

            {/* Suggested Items */}
            <div className="mt-16">
              <h2 className="text-xl font-semibold mb-6">You might like these</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {suggestedItems.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.author}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                          <button
                            onClick={() => addSuggestedItem(item)}
                            disabled={!user}
                            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                              user 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {user ? 'Add to Cart' : 'Login to Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center hover:text-blue-600 transition-colors"
              >
                <ChevronLeft size={16} className="mr-1" />
                Back
              </button>
              <span>/</span>
              <span className="text-gray-900 font-medium">Shopping Cart ({itemCount} items)</span>
            </div>
            
            <button
              onClick={clearCart}
              disabled={isLoading}
              className="flex items-center text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin mr-1" />
              ) : (
                <Trash2 size={16} className="mr-1" />
              )}
              {isLoading ? 'Clearing...' : 'Clear Cart'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600 mt-1">{itemCount} items in your cart</p>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-100">
                {cart.map(item => {
                  // Extract book data from cart item
                  const book = item.book || item;
                  const bookId = book.id || item.bookId;
                  const cartItemId = item.id || bookId;
                  const title = book.title || item.title;
                  const author = book.author || item.author;
                  const price = book.sale_price || book.list_price || item.price || 0;
                  const image = book.cover_image_url || book.image || item.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop';
                  const category = book.categories?.[0]?.name || item.category || 'Uncategorized';
                  const inStock = item.inStock !== undefined ? item.inStock : true;
                  const quantity = item.quantity || 1;
                  
                  return (
                    <div key={cartItemId} className="p-6 hover:bg-gray-50/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                        {/* Book Image */}
                        <div className="w-24 h-32 flex-shrink-0">
                          <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Book Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900 mb-1">
                                    <Link to={`/book/${bookId}`} className="hover:text-blue-600 transition-colors">
                                      {title}
                                    </Link>
                                  </h3>
                                  <p className="text-gray-600 text-sm mb-2">{author}</p>
                                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mb-3">
                                    {category}
                                  </span>
                                </div>
                                
                                {/* Price */}
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-gray-900 mb-2">
                                    ${(price * quantity).toFixed(2)}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    ${price.toFixed(2)} each
                                  </div>
                                </div>
                              </div>

                              {/* Stock Status */}
                              <div className="flex items-center mt-4">
                                {inStock ? (
                                  <div className="flex items-center text-green-600">
                                    <Package size={16} className="mr-2" />
                                    <span className="text-sm">In Stock</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-red-600">
                                    <AlertCircle size={16} className="mr-2" />
                                    <span className="text-sm">Out of Stock</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-100">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(cartItemId, bookId, quantity - 1)}
                                  disabled={quantity <= 1 || isLoading}
                                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-4 py-2 min-w-[50px] text-center font-medium">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(cartItemId, bookId, quantity + 1)}
                                  disabled={!inStock || isLoading}
                                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => moveToWishlist(item)}
                                disabled={isLoading}
                                className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                              >
                                <Heart size={16} className="mr-1" />
                                Save for later
                              </button>
                              <button
                                onClick={() => removeItem(cartItemId, bookId)}
                                disabled={isLoading}
                                className="flex items-center text-sm text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                              >
                                <Trash2 size={16} className="mr-1" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                <Truck className="text-blue-600" size={24} />
              </div>
              <p className="text-gray-600 mb-4">
                {subtotal >= 35 
                  ? '🎉 Congrats! You qualify for free shipping!'
                  : `Add $${(35 - subtotal).toFixed(2)} more to your order to qualify for free shipping!`
                }
              </p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / 35) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>${subtotal.toFixed(2)}</span>
                <span>$35.00 needed</span>
              </div>
            </div>

            {/* Suggested Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-6">Frequently bought together</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestedItems.map(item => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{item.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{item.author}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                        <button
                          onClick={() => addSuggestedItem(item)}
                          disabled={!user}
                          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                            user 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {user ? 'Add to Cart' : 'Login to Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Order Summary Header */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    
                    {/* Promo Code */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Promo code"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="py-4 border-t border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">or ${(total / 3).toFixed(2)}/month for 3 months</div>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="mt-6 space-y-4">
                    <button
                      onClick={handleCheckout}
                      disabled={isLoading || cart.length === 0}
                      className={`w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center ${
                        cart.length === 0 || isLoading 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:opacity-90'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={20} className="animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock size={20} className="mr-2" />
                          Proceed to Checkout
                          <ArrowRight size={20} className="ml-2" />
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleContinueShopping}
                      className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>

                  {/* Security Badges */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-6">
                      <div className="text-center">
                        <Shield className="text-green-600 mx-auto mb-2" size={24} />
                        <div className="text-xs text-gray-600">Secure Payment</div>
                      </div>
                      <div className="text-center">
                        <Truck className="text-blue-600 mx-auto mb-2" size={24} />
                        <div className="text-xs text-gray-600">Free Shipping</div>
                      </div>
                      <div className="text-center">
                        <Package className="text-purple-600 mx-auto mb-2" size={24} />
                        <div className="text-xs text-gray-600">Easy Returns</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help Section */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Need help with your order?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Our customer support team is available 24/7 to assist you.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-medium mr-2">Phone:</span>
                    <span>1-800-BOOK-NOW</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-medium mr-2">Email:</span>
                    <span>support@booknook.com</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-medium mr-2">Live Chat:</span>
                    <span>Available 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;