import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Package,
  CreditCard,
  Smartphone,
  Truck,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  MapPin,
  Phone,
  FileText,
  Loader,
  ShoppingBag,
  Globe,
  Building,
  Mailbox,
  Check
} from 'lucide-react';
import { useBookStore } from '../components/BookstoreContext';

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    secondName: '',
    address: '',
    city: '',
    country: 'Kenya',
    postalCode: '',
    phone: '',
    email: ''
  });

  // Use BookStore context
  const {
    cart,
    user,
    isLoading: contextLoading,
    error: contextError,
    cartTotal,
    cartItemCount,
    createOrder: contextCreateOrder,
    clearCart: contextClearCart,
    fetchOrders,
    fetchCart
  } = useBookStore();

  // Initialize shipping address with user data if available
  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.firstName || '',
        secondName: user.secondName || '',
        phone: user.phone || '',
        // If user has saved addresses, you could set them here
      }));
    }
  }, [user]);

  // Check if cart contains any ebooks
  const hasEbooks = cart?.some(item => item.format?.toLowerCase() === 'ebook' || item.format?.toLowerCase() === 'digital') || false;
  
  // Calculate shipping cost - free for ebooks only, otherwise fixed rate
  const shippingCost = hasEbooks ? 0 : 5.99;
  
  // Calculate tax
  const tax = cartTotal * 0.08;
  
  // Calculate total
  const total = cartTotal + shippingCost + tax;

  // Payment methods configuration
  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: <Smartphone size={24} />,
      description: 'Pay via STK Push to your phone',
      available: true,
      instructions: 'Enter your M-Pesa registered phone number'
    },
    {
      id: 'till',
      name: 'Till Number',
      icon: <CreditCard size={24} />,
      description: 'Pay via Till Number',
      available: true,
      instructions: 'You will be redirected to complete payment'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard size={24} />,
      description: 'Pay securely with your card',
      available: true
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Truck size={24} />,
      description: 'Pay when your order arrives',
      available: !hasEbooks, // Critical: Disable COD if ebooks exist
      disabledReason: hasEbooks ? 'Not available for ebook purchases' : ''
    }
  ];

  // Steps configuration
  const steps = [
    { number: 1, title: 'Shipping', icon: <MapPin size={20} /> },
    { number: 2, title: 'Payment', icon: <CreditCard size={20} /> },
    { number: 3, title: 'Review', icon: <FileText size={20} /> }
  ];

  // Handle payment method selection
  const handlePaymentSelect = (methodId) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (method.available) {
      setPaymentMethod(methodId);
    }
  };

  // Handle address input change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate shipping address
  const validateShippingAddress = () => {
    const requiredFields = ['firstName', 'secondName', 'address', 'city', 'phone', 'email'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    if (shippingAddress.phone && shippingAddress.phone.length < 10) {
      alert('Please enter a valid phone number');
      return false;
    }
    
    return true;
  };

  // Handle M-Pesa payment
  const handleMpesaPayment = async (orderData) => {
    if (!mpesaPhone || mpesaPhone.length < 10) {
      alert('Please enter a valid M-Pesa phone number');
      return false;
    }

    try {
      // In a real app, you would call your backend M-Pesa endpoint
      // For now, we'll simulate the payment
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({ success: true, transactionId: `MPESA-${Date.now()}` });
        }, 2000);
      });

      if (response.success) {
        // STK Push initiated successfully
        return true;
      } else {
        alert('Payment initiation failed. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('M-Pesa payment error:', error);
      alert('Payment service is temporarily unavailable');
      return false;
    }
  };

  // Handle Till payment
  const handleTillPayment = async () => {
    // Initialize Till Payments (simplified version)
    try {
      // In production, you would load the Till Payments SDK
      console.log('Initializing Till payment...');
      
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      });
    } catch (error) {
      console.error('Till payment error:', error);
      return false;
    }
  };

  // Create order using context
  const createOrderWithContext = async () => {
    if (!validateShippingAddress()) {
      return false;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return false;
    }

    setIsProcessing(true);
    
    try {
      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          book_id: item.id,
          quantity: item.quantity || 1,
          price: item.sale_price || item.list_price || 0,
          format: item.format
        })),
        shipping_address:{address_line1: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.country}`,
        street: `${shippingAddress.address}`,
        payment_method: paymentMethod,
        total_amount: total,
        shipping_cost: shippingCost,
        tax_amount: tax,
        notes: '',
        city: shippingAddress.city,
        county: shippingAddress.country,
        country:shippingAddress.country,
        full_name: `${shippingAddress.firstName} ${shippingAddress.secondName}`,
        email: shippingAddress.email,
        phone: shippingAddress.phone}
      };

      // Process payment based on selected method
      let paymentSuccess = false;
      
      switch (paymentMethod) {
        case 'mpesa':
          paymentSuccess = await handleMpesaPayment(orderData);
          break;
        case 'till':
          paymentSuccess = await handleTillPayment();
          break;
        case 'card':
        case 'cod':
          // For card and COD, we'll simulate success
          paymentSuccess = true;
          break;
        default:
          alert('Invalid payment method');
          return false;
      }

      if (!paymentSuccess) {
        throw new Error('Payment failed');
      }

      // Create order using context
      await contextCreateOrder(orderData);
      
      // Clear cart
      await contextClearCart();
      
      // Refresh orders and cart
      await Promise.all([fetchOrders(), fetchCart()]);
      
      return true;
    } catch (error) {
      console.error('Order creation error:', error);
      alert(`Failed to create order: ${error.message}`);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Navigation
  const nextStep = async () => {
    if (currentStep < 3) {
      // Validate current step before proceeding
      if (currentStep === 1 && !validateShippingAddress()) {
        return;
      }
      
      if (currentStep === 2 && !paymentMethod) {
        alert('Please select a payment method');
        return;
      }
      
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      const success = await createOrderWithContext();
      if (success) {
        setOrderSuccess(true);
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/cart');
    }
  };

  // Loading state
  if (contextLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Check if cart is empty
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some books to your cart before checking out.</p>
          <Link
            to="/catalog"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been successfully placed. 
            {paymentMethod === 'mpesa' ? ' Check your phone to complete the M-Pesa payment.' : ''}
            {paymentMethod === 'cod' ? ' Please have cash ready for delivery.' : ''}
          </p>
          <div className="space-y-3">
            <Link
              to="/orders"
              className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Order Details
            </Link>
            <Link
              to="/catalog"
              className="block w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                <Home size={20} />
              </Link>
              <span>/</span>
              <Link to="/cart" className="text-gray-600 hover:text-blue-600">
                Cart ({cartItemCount})
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Checkout</span>
            </div>
            <div className="flex items-center">
              <Shield className="text-green-600 mr-2" size={20} />
              <span className="text-sm text-gray-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {contextError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {contextError}
          </div>
        )}

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    step.number === currentStep
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : step.number < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step.number < currentStep ? <CheckCircle size={24} /> : step.icon}
                  </div>
                  <span className={`text-sm font-medium ${
                    step.number <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                {currentStep === 1 && (
                  <ShippingStep 
                    shippingAddress={shippingAddress}
                    onAddressChange={handleAddressChange}
                    user={user}
                  />
                )}
                {currentStep === 2 && (
                  <PaymentStep 
                    paymentMethods={paymentMethods}
                    paymentMethod={paymentMethod}
                    onSelect={handlePaymentSelect}
                    mpesaPhone={mpesaPhone}
                    onPhoneChange={setMpesaPhone}
                    hasEbooks={hasEbooks}
                  />
                )}
                {currentStep === 3 && (
                  <ReviewStep 
                    cart={cart}
                    cartTotal={cartTotal}
                    shippingCost={shippingCost}
                    tax={tax}
                    total={total}
                    paymentMethod={paymentMethod}
                    hasEbooks={hasEbooks}
                    shippingAddress={shippingAddress}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={isProcessing}
                  className={`px-6 py-3 rounded-lg flex items-center ${
                    isProcessing
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <ChevronLeft size={20} className="mr-2" />
                  {currentStep === 1 ? 'Back to Cart' : 'Previous'}
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={isProcessing || (currentStep === 2 && !paymentMethod)}
                  className={`px-8 py-3 rounded-lg flex items-center ${
                    isProcessing || (currentStep === 2 && !paymentMethod)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : currentStep === 3 ? (
                    <>
                      <Lock size={20} className="mr-2" />
                      Complete Order
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight size={20} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-1/3">
              <OrderSummary 
                cart={cart}
                cartTotal={cartTotal}
                shippingCost={shippingCost}
                tax={tax}
                total={total}
                hasEbooks={hasEbooks}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shipping Step Component
const ShippingStep = ({ shippingAddress, onAddressChange, user }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
      
      {user && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-center">
          <User className="text-blue-600 mr-3" size={20} />
          <div>
            <p className="font-medium">Logged in as {user.email}</p>
            <p className="text-sm text-blue-700">Your information is pre-filled below</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={shippingAddress.firstName}
            onChange={onAddressChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="secondName"
            value={shippingAddress.secondName}
            onChange={onAddressChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Doe"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={shippingAddress.address_line1}
            onChange={onAddressChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123 Main Street"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={shippingAddress.town}
            onChange={onAddressChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nairobi"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              name="country"
              value={shippingAddress.country}
              onChange={onAddressChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Kenya</option>
              <option>Uganda</option>
              <option>Tanzania</option>
              <option>Rwanda</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            value={shippingAddress.postalCode}
            onChange={onAddressChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="00100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              name="phone"
              value={shippingAddress.phone}
              onChange={onAddressChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="07XX XXX XXX"
              required
            />
            {console.log(shippingAddress)}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              value={shippingAddress.email}
              onChange={onAddressChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Step Component
const PaymentStep = ({ paymentMethods, paymentMethod, onSelect, mpesaPhone, onPhoneChange, hasEbooks }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
      
      {hasEbooks && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="text-blue-600 mr-3" size={20} />
            <p className="text-sm text-blue-800">
              Your cart contains ebooks. Cash on Delivery is not available for digital purchases.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {paymentMethods.map(method => (
          <div
            key={method.id}
            onClick={() => method.available && onSelect(method.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              paymentMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : method.available
                ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-4 ${
                  paymentMethod === method.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {method.icon}
                </div>
                <div>
                  <div className="font-semibold">{method.name}</div>
                  <div className="text-sm text-gray-600">{method.description}</div>
                </div>
              </div>
              
              {paymentMethod === method.id && (
                <CheckCircle className="text-blue-600" size={20} />
              )}
            </div>

            {!method.available && method.disabledReason && (
              <div className="mt-2 text-sm text-red-600">
                {method.disabledReason}
              </div>
            )}

            {/* M-Pesa Phone Input */}
            {method.id === 'mpesa' && paymentMethod === 'mpesa' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Phone Number *
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={mpesaPhone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  You'll receive an STK Push notification to complete payment
                </p>
              </div>
            )}

            {/* Till Payment Instructions */}
            {method.id === 'till' && paymentMethod === 'till' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    You'll be redirected to Till Payments to complete your transaction securely
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Review Step Component
const ReviewStep = ({ cart, cartTotal, shippingCost, tax, total, paymentMethod, hasEbooks, shippingAddress }) => {
  const selectedMethod = paymentMethod === 'mpesa' ? 'M-Pesa STK Push' :
                        paymentMethod === 'till' ? 'Till Number' :
                        paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery';

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>
      
      <div className="space-y-6">
        {/* Shipping Information */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center">
            <MapPin size={18} className="mr-2" />
            Shipping Address
          </h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">{shippingAddress.firstName} {shippingAddress.secondName}</p>
            <p className="text-gray-600">{shippingAddress.address}</p>
            <p className="text-gray-600">{shippingAddress.city}, {shippingAddress.country}</p>
            <p className="text-gray-600">{shippingAddress.postalCode}</p>
            <p className="text-gray-600">Phone: {shippingAddress.phone}</p>
            <p className="text-gray-600">Email: {shippingAddress.email}</p>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="font-semibold mb-4">Items ({cart.length})</h3>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded overflow-hidden">
                    <img 
                      src={item.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200'} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-600">
                      by {item.author} • {item.format || 'Paperback'} × {item.quantity || 1}
                    </div>
                  </div>
                </div>
                <div className="font-medium">
                  ${((item.sale_price || item.list_price || 0) * (item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center">
            <CreditCard size={18} className="mr-2" />
            Payment Method
          </h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="font-medium">{selectedMethod}</div>
              {paymentMethod === 'cod' && hasEbooks ? (
                <span className="text-sm text-red-600">Not available for ebooks</span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Final Total */}
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3">
              <span>Total Amount</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({ cart, cartTotal, shippingCost, tax, total, hasEbooks }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
      <h3 className="font-bold text-lg mb-6">Order Summary</h3>
      
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-medium text-sm">{item.title}</div>
              <div className="text-xs text-gray-500">
                {item.format === 'ebook' ? 'Ebook' : 'Paperback'} × {item.quantity || 1}
              </div>
            </div>
            <div className="font-medium text-sm">
              ${((item.sale_price || item.list_price || 0) * (item.quantity || 1)).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className={shippingCost === 0 ? 'text-green-600' : ''}>
            {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping Info */}
      {hasEbooks && (
        <div className="mt-6 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            ✓ Ebook purchases include free shipping
          </p>
        </div>
      )}

      {/* Security Badges */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6">
          <div className="text-center">
            <Lock className="text-green-600 mx-auto mb-2" size={20} />
            <div className="text-xs text-gray-600">256-bit SSL</div>
          </div>
          <div className="text-center">
            <Shield className="text-blue-600 mx-auto mb-2" size={20} />
            <div className="text-xs text-gray-600">Secure Payment</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;