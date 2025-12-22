import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  CreditCard, 
  Lock, 
  ArrowLeft, 
  CheckCircle, 
  Calendar,
  Users,
  MapPin,
  Mail,
  Phone,
  Shield,
  User
} from 'lucide-react';

interface BookingData {
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  roomQuantity: string;
  roomType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  specialRequests: string;
  promoCode: string;
  loyaltyPoints: number;
  usePoints: boolean;
  instantBooking: boolean;
  nights: number;
  isWeekend: boolean;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    saveCard: false,
    billingAddress: '',
    billingCity: '',
    billingCountry: '',
    billingZip: '',
    paypalEmail: '',
    phoneNumber: '',
    mobileCarrier: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [showCVV, setShowCVV] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [step, setStep] = useState(1); // 1: Payment Method, 2: Details, 3: Confirmation

  const roomPrices = {
    standard: { base: 149, weekend: 189 },
    deluxe: { base: 229, weekend: 279 },
    executive: { base: 389, weekend: 459 },
    presidential: { base: 749, weekend: 899 }
  };

  // Upsell pricing
  const upsellPrices = {
    spa: 150,
    airportPickup: 45,
    lateCheckout: 50,
    breakfast: 25
  };

  useEffect(() => {
    // Get booking data from localStorage
    const storedBookingData = localStorage.getItem('bookingData');
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData));
    } else {
      // If no booking data, redirect to booking page
      navigate('/booking');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setPaymentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validatePayment = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (paymentMethod === 'credit-card') {
      if (!paymentData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!paymentData.cvv.trim()) newErrors.cvv = 'CVV is required';
      if (!paymentData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
      
      // Card number validation (basic)
      const cardNumber = paymentData.cardNumber.replace(/\s/g, '');
      if (cardNumber && (cardNumber.length < 13 || cardNumber.length > 19)) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      // CVV validation
      if (paymentData.cvv && (paymentData.cvv.length < 3 || paymentData.cvv.length > 4)) {
        newErrors.cvv = 'Invalid CVV';
      }
    } else if (paymentMethod === 'paypal') {
      if (!paymentData.paypalEmail.trim()) newErrors.paypalEmail = 'PayPal email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (paymentData.paypalEmail && !emailRegex.test(paymentData.paypalEmail)) {
        newErrors.paypalEmail = 'Invalid email address';
      }
    } else if (paymentMethod === 'mobile-money') {
      if (!paymentData.mobileCarrier) newErrors.mobileCarrier = 'Please select a mobile carrier';
      if (!paymentData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
      
      // Phone number validation for Ghana
      const phoneRegex = /^(\+233|0)[2-9][0-9]{8}$/;
      if (paymentData.phoneNumber && !phoneRegex.test(paymentData.phoneNumber.replace(/\s/g, ''))) {
        newErrors.phoneNumber = 'Please enter a valid Ghana phone number';
      }
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (/^4/.test(number)) return 'Visa';
    if (/^5[1-5]/.test(number)) return 'Mastercard';
    if (/^3[47]/.test(number)) return 'American Express';
    if (/^6/.test(number)) return 'Discover';
    return 'Unknown';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePayment()) {
      return;
    }

    if (!bookingData) {
      alert('Booking data is missing. Please start your booking again.');
      navigate('/booking');
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await api.processPayment({
        bookingData,
        paymentData,
        paymentMethod,
        totalAmount,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || 'Payment failed. Please try again.');
        return;
      }

      const result = await response.json();
      const bookingIdFromServer = result && result.booking && result.booking.booking_id;
      const bookingStatusFromServer = result && result.booking && result.booking.status;
      
      // Store confirmation data for dashboard display
      const confirmationData = {
        bookingId: bookingIdFromServer || 'LGH-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        bookingData,
        paymentData,
        paymentMethod,
        timestamp: new Date().toISOString(),
        status: bookingStatusFromServer || 'confirmed'
      };
      
      // Store booking in user's booking history
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      existingBookings.unshift(confirmationData); // Add to beginning of array
      localStorage.setItem('userBookings', JSON.stringify(existingBookings));
      
      // Clear temporary booking data
      localStorage.removeItem('bookingData');
      
      // Show success message
      alert('🎉 Booking confirmed successfully! Redirecting to your dashboard...');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate pricing
  const selectedRoomPrice = roomPrices[bookingData.roomType as keyof typeof roomPrices];
  const basePrice = bookingData.isWeekend ? selectedRoomPrice.weekend : selectedRoomPrice.base;
  const roomSubtotal = basePrice * bookingData.nights * parseInt(bookingData.roomQuantity);
  
  // Mock add-ons for price display (in real app, this would come from booking data)
  const addOnsTotal = 150 + (25 * bookingData.nights) + 45 + 50; // Spa + Breakfast + Transfer + Late Checkout
  const subtotalWithAddons = roomSubtotal + addOnsTotal;
  
  // Calculate discounts (mock promo discount for display)
  const promoDiscount = 0; // This would come from booking data if promo was applied
  const promoDiscountAmount = Math.round(subtotalWithAddons * (promoDiscount / 100));
  
  const taxRate = 0.12;
  const serviceFee = 25;
  const cashFee = paymentMethod === 'cash-front-desk' ? 20 : 0;
  const taxes = Math.round((subtotalWithAddons - promoDiscountAmount) * taxRate);
  const totalAmount = subtotalWithAddons - promoDiscountAmount + taxes + serviceFee + cashFee;
  
  const totalGuests = parseInt(bookingData.adults) + parseInt(bookingData.children);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/booking" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Booking Details
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Secure Payment</h1>
          <p className="text-lg text-gray-600">Complete your booking with our secure payment system</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Payment Method Selection */}
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  Payment Method
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit-card')}
                    className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                      paymentMethod === 'credit-card' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                      paymentMethod === 'paypal' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">PayPal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile-money')}
                    className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                      paymentMethod === 'mobile-money' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">Mobile Money</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash-front-desk')}
                    className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'cash-front-desk' 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    <div className="text-center">
                      <span className="font-medium text-sm">Cash at Front Desk</span>
                      <p className="text-xs text-orange-600 font-medium">+$20 fee</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-green-600" />
                  Payment Details
                </h2>
                
                {paymentMethod === 'credit-card' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Card Number *</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          value={formatCardNumber(paymentData.cardNumber)}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 16) {
                              setPaymentData(prev => ({ ...prev, cardNumber: value }));
                            }
                          }}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                            errors.cardNumber ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                          }`}
                          required
                        />
                        {paymentData.cardNumber && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {getCardType(paymentData.cardNumber)}
                            </span>
                          </div>
                        )}
                      </div>
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Cardholder Name *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.cardName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        required
                      />
                      {errors.cardName && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">CVV/CVC *</label>
                      <div className="relative">
                        <input
                          type={showCVV ? 'text' : 'password'}
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                              setPaymentData(prev => ({ ...prev, cvv: value }));
                            }
                          }}
                          placeholder="123"
                          maxLength={4}
                          className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                            errors.cvv ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                          }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCVV(!showCVV)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCVV ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">3-4 digit security code on back of card</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-800 font-medium">Save card for future bookings</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaymentData(prev => ({ ...prev, saveCard: !prev.saveCard }))}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          paymentData.saveCard
                            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                            : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        {paymentData.saveCard ? 'Saved' : 'Save Card'}
                      </button>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">PayPal Email *</label>
                      <input
                        type="email"
                        name="paypalEmail"
                        value={paymentData.paypalEmail}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.paypalEmail ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        required
                      />
                      {errors.paypalEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.paypalEmail}</p>
                      )}
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="text-blue-800 text-sm">
                        You will be redirected to PayPal to complete your payment securely.
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'mobile-money' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Mobile Carrier *</label>
                      <select
                        name="mobileCarrier"
                        value={paymentData.mobileCarrier || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.mobileCarrier ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        required
                      >
                        <option value="">Select your mobile carrier</option>
                        <option value="mtn">MTN Mobile Money</option>
                        <option value="airteltigo">AirtelTigo Money</option>
                        <option value="vodafone">Vodafone Cash</option>
                        <option value="telecel">Telecel Cash</option>
                      </select>
                      {errors.mobileCarrier && (
                        <p className="mt-1 text-sm text-red-600">{errors.mobileCarrier}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Phone Number *</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={paymentData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+233 XX XXX XXXX"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.phoneNumber ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        required
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Enter the phone number registered with your mobile money account
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <h4 className="font-medium text-green-800 mb-2">How it works:</h4>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Select your mobile carrier above</li>
                        <li>• Enter your registered mobile money number</li>
                        <li>• You'll receive a payment prompt on your phone</li>
                        <li>• Enter your mobile money PIN to complete payment</li>
                      </ul>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cash-front-desk' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-orange-50 border border-orange-200 rounded-xl">
                      <h4 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Cash Payment at Front Desk
                      </h4>
                      <div className="space-y-3 text-orange-700">
                        <p className="text-sm">
                          <strong>Additional Fee:</strong> $20 will be added to your total for cash payment processing.
                        </p>
                        <div className="text-sm">
                          <p className="font-medium mb-2">Payment Instructions:</p>
                          <ul className="space-y-1 ml-4">
                            <li>• Complete this booking to reserve your room</li>
                            <li>• Pay the full amount in cash at the front desk during check-in</li>
                            <li>• Bring a valid ID and this booking confirmation</li>
                            <li>• Payment must be made in USD or local currency equivalent</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <p className="text-sm font-medium text-orange-800">
                            ⚠️ Note: Your room will be held for 24 hours. Payment must be completed during check-in or your reservation may be cancelled.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms & Conditions</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                      required
                    />
                    <label className="text-gray-700 text-sm">
                      I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>. I understand that my booking is subject to availability and the hotel's cancellation policy.
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-red-600">{errors.terms}</p>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={acceptMarketing}
                      onChange={(e) => setAcceptMarketing(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label className="text-gray-700 text-sm">
                      I would like to receive promotional emails about special offers and new services (optional).
                    </label>
                  </div>
                </div>
              </div>

              {/* Confirm Pay Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isProcessing || !acceptTerms}
                  className={`font-bold py-5 px-16 rounded-xl text-xl transition-all duration-300 flex items-center gap-3 mx-auto shadow-xl ${
                    isProcessing || !acceptTerms
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 hover:from-green-600 hover:via-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-2xl'
                  } text-white`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-6 h-6" />
                      <span>Confirm & Pay ${totalAmount}</span>
                      <CheckCircle className="w-6 h-6" />
                    </>
                  )}
                </button>
                
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Secured by 256-bit SSL encryption</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Your payment information is protected and encrypted
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h2>
              
              {/* Guest Information */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Guest Details
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Name:</strong> {bookingData.firstName} {bookingData.lastName}</p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {bookingData.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {bookingData.phone}
                  </p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Stay Details
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Check-in:</strong> {new Date(bookingData.checkIn).toLocaleDateString()}</p>
                  <p><strong>Check-out:</strong> {new Date(bookingData.checkOut).toLocaleDateString()}</p>
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {totalGuests} Guest{totalGuests !== 1 ? 's' : ''}
                  </p>
                  <p><strong>Room:</strong> {bookingData.roomType.charAt(0).toUpperCase() + bookingData.roomType.slice(1)} Room</p>
                  <p><strong>Nights:</strong> {bookingData.nights}</p>
                </div>
              </div>

              {/* Price Summary */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 mb-4">Price Summary</h4>
                
                {/* Room Cost */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Room Rate</span>
                    <span className="text-gray-900">${basePrice}/night</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">{bookingData.nights} nights × ${basePrice}</span>
                    <span className="text-gray-900 font-medium">${roomSubtotal}</span>
                  </div>
                </div>

                {/* Add-ons Section */}
                {(bookingData.specialRequests || roomSubtotal > basePrice * bookingData.nights) && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-800">Add-ons & Services</h5>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">• Spa & Wellness Package</span>
                      <span className="text-gray-900">$150</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">• Daily Breakfast ({bookingData.nights} days)</span>
                      <span className="text-gray-900">${25 * bookingData.nights}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">• Airport Transfer</span>
                      <span className="text-gray-900">$45</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-gray-200">
                      <span className="text-gray-600">• Late Checkout</span>
                      <span className="text-gray-900">$50</span>
                    </div>
                  </div>
                )}

                {/* Fees & Taxes */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taxes (12%)</span>
                    <span className="text-gray-900">${taxes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="text-gray-900">${serviceFee}</span>
                  </div>
                  {cashFee > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cash Payment Fee</span>
                      <span className="text-gray-900">${cashFee}</span>
                    </div>
                  )}
                </div>

                {/* Discounts */}
                {promoDiscount > 0 && (
                  <div className="space-y-2 py-2 border-t border-gray-200">
                    <h5 className="font-medium text-green-800">Discounts Applied</h5>
                    <div className="flex justify-between items-center text-green-600">
                      <span>• Promo Code Discount ({promoDiscount}%)</span>
                      <span>-${promoDiscountAmount}</span>
                    </div>
                  </div>
                )}

                {/* Total Payable */}
                <div className="pt-4 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center py-3 text-xl font-bold bg-gradient-to-r from-blue-50 to-green-50 px-4 rounded-lg border">
                    <span className="text-gray-900">Total Payable</span>
                    <span className="text-blue-600">${totalAmount}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">All taxes and fees included</p>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
