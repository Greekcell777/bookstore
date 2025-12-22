import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Mock cart items - In a real app, this would come from your CartContext
  const cartItems = [
    {
      id: 1,
      title: "The Midnight Library",
      type: "ebook", // This determines payment options
      price: 24.99,
      quantity: 1
    },
    {
      id: 2,
      title: "Atomic Habits",
      type: "physical",
      price: 27.99,
      quantity: 1
    }
  ];

  // Check if cart contains any ebooks
  const hasEbooks = cartItems.some(item => item.type === 'ebook');
  
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
      available: !hasEbooks, // Critical: Disable COD if ebooks exist[citation:2]
      disabledReason: hasEbooks ? 'Not available for ebook purchases' : ''
    }
  ];

  // Steps configuration
  const steps = [
    { number: 1, title: 'Shipping', icon: <MapPin size={20} /> },
    { number: 2, title: 'Payment', icon: <CreditCard size={20} /> },
    { number: 3, title: 'Review', icon: <FileText size={20} /> }
  ];

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = hasEbooks ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Handle payment method selection
  const handlePaymentSelect = (methodId) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (method.available) {
      setPaymentMethod(methodId);
    }
  };

  // Handle M-Pesa payment[citation:3][citation:9]
  const handleMpesaPayment = async () => {
    if (!mpesaPhone || mpesaPhone.length < 10) {
      alert('Please enter a valid M-Pesa phone number');
      return;
    }

    setIsProcessing(true);
    
    try {
      // In production, this would call your backend endpoint[citation:9]
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: mpesaPhone,
          amount: total,
          orderId: `ORD-${Date.now()}`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // STK Push initiated successfully[citation:3]
        setOrderSuccess(true);
        setTimeout(() => {
          navigate('/order-confirmation');
        }, 3000);
      } else {
        alert('Payment initiation failed. Please try again.');
      }
    } catch (error) {
      console.error('M-Pesa payment error:', error);
      alert('Payment service is temporarily unavailable');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Till payment[citation:4][citation:7]
  const handleTillPayment = () => {
    setIsProcessing(true);
    
    // Initialize Till Payments (simplified version)[citation:4]
    const initializeTillPayment = () => {
      // In production, you would load the Till Payments SDK[citation:4]
      console.log('Initializing Till payment...');
      
      // Mock payment processing
      setTimeout(() => {
        setOrderSuccess(true);
        setIsProcessing(false);
      }, 2000);
    };

    initializeTillPayment();
  };

  // Process payment based on selected method
  const processPayment = () => {
    switch (paymentMethod) {
      case 'mpesa':
        handleMpesaPayment();
        break;
      case 'till':
        handleTillPayment();
        break;
      case 'card':
        // Handle card payment (would integrate with Stripe/Till)
        setIsProcessing(true);
        setTimeout(() => {
          setOrderSuccess(true);
          setIsProcessing(false);
        }, 2000);
        break;
      case 'cod':
        // Cash on Delivery - just confirm order
        setOrderSuccess(true);
        break;
      default:
        alert('Please select a payment method');
    }
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3 && paymentMethod) {
      processPayment();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ShippingStep />;
      case 2:
        return (
          <PaymentStep 
            paymentMethods={paymentMethods}
            paymentMethod={paymentMethod}
            onSelect={handlePaymentSelect}
            mpesaPhone={mpesaPhone}
            onPhoneChange={setMpesaPhone}
            hasEbooks={hasEbooks}
          />
        );
      case 3:
        return (
          <ReviewStep 
            cartItems={cartItems}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            paymentMethod={paymentMethod}
            hasEbooks={hasEbooks}
          />
        );
      default:
        return null;
    }
  };

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
                Cart
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
                {renderStepContent()}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg flex items-center ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <ChevronLeft size={20} className="mr-2" />
                  Previous
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
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h3 className="font-bold text-lg mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-500">
                          {item.type === 'ebook' ? 'Ebook' : 'Paperback'} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shipping Step Component
const ShippingStep = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Doe"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123 Main Street"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nairobi"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="07XX XXX XXX"
          />
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
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  value={mpesaPhone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  placeholder="07XX XXX XXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-2 text-sm text-gray-500">
                  You'll receive an STK Push notification to complete payment[citation:3]
                </p>
              </div>
            )}

            {/* Till Payment Instructions */}
            {method.id === 'till' && paymentMethod === 'till' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    You'll be redirected to Till Payments to complete your transaction securely[citation:7]
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
const ReviewStep = ({ cartItems, subtotal, shipping, tax, total, paymentMethod, hasEbooks }) => {
  const selectedMethod = paymentMethod === 'mpesa' ? 'M-Pesa STK Push' :
                        paymentMethod === 'till' ? 'Till Number' :
                        paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery';

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>
      
      <div className="space-y-6">
        {/* Order Items */}
        <div>
          <h3 className="font-semibold mb-4">Items</h3>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-600">
                    {item.type} × {item.quantity}
                  </div>
                </div>
                <div className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="font-semibold mb-2">Payment Method</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="font-medium">{selectedMethod}</div>
              {paymentMethod === 'cod' && hasEbooks ? (
                <span className="text-sm text-red-600">Not available for ebooks</span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
            <span className="ml-3 text-sm text-gray-700">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </label>
        </div>

        {/* Final Total */}
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-green-600' : ''}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
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

export default Checkout;