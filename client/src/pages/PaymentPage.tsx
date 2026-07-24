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
  User,
  Eye,
  EyeOff,
} from 'lucide-react';

const inputClass =
  'w-full border border-sand-deep bg-white px-3 py-3 text-ink focus:outline-none focus:border-brass transition-colors';
const labelClass = 'block text-xs uppercase tracking-wider text-ink-muted mb-2';

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
      const backendBookingData = {
        first_name: bookingData.firstName,
        last_name: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.phone,
        street: bookingData.address,
        city: bookingData.city,
        country: bookingData.country,
        in_date: bookingData.checkIn,
        out_date: bookingData.checkOut,
        adult: Number(bookingData.adults),
        children: Number(bookingData.children),
        rooms: Number(bookingData.roomQuantity),
        room_type: bookingData.roomType,
        special_request: bookingData.specialRequests,
      };

      const cardNumber = paymentData.cardNumber.replace(/\s/g, '');
      const safePaymentPayload = {
        cardName: paymentData.cardName,
        cardLast4: cardNumber.slice(-4),
        paypalEmail: paymentData.paypalEmail,
        phoneNumber: paymentData.phoneNumber,
        mobileCarrier: paymentData.mobileCarrier,
        billingAddress: paymentData.billingAddress,
        billingCity: paymentData.billingCity,
        billingCountry: paymentData.billingCountry,
        billingZip: paymentData.billingZip,
      };

      const response = await api.processPayment({
        booking_data: backendBookingData,
        payment_data: safePaymentPayload,
        payment_method: paymentMethod,
        total_amount: totalAmount,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.detail?.message || errorData?.message || 'Payment failed. Please try again.');
        return;
      }

      const result = await response.json();
      const bookingIdFromServer = result && result.booking && result.booking.booking_id;
      const bookingStatusFromServer = result && result.booking && result.booking.status;

      localStorage.removeItem('bookingData');
      localStorage.removeItem('selectedBooking');
      localStorage.removeItem('userBookings');

      alert('Booking confirmed successfully! Redirecting to your dashboard...');
      navigate('/dashboard', {
        state: {
          bookingId: bookingIdFromServer,
          status: bookingStatusFromServer || 'confirmed',
        },
      });
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-2 border-sand-deep border-t-brass" />
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

  const methodBtnClass = (active: boolean) =>
    `p-4 border flex items-center gap-3 transition-colors text-left ${
      active
        ? 'border-brass bg-sand text-ink'
        : 'border-sand-deep bg-white text-ink-muted hover:border-brass/50'
    }`;

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/booking"
          className="inline-flex items-center gap-2 text-ink-muted hover:text-ink mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to booking details
        </Link>

        <div className="mb-10 md:mb-12">
          <p className="section-label mb-2">Checkout</p>
          <h1 className="page-title mb-3">Secure payment</h1>
          <p className="text-ink-muted text-lg max-w-xl">
            Complete your reservation with our encrypted payment system.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="panel">
                <p className="section-label mb-2">Step 1</p>
                <h2 className="font-display text-2xl text-ink mb-6 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-brass" />
                  Payment method
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit-card')}
                    className={methodBtnClass(paymentMethod === 'credit-card')}
                  >
                    <CreditCard className="w-5 h-5 shrink-0" />
                    <span className="font-medium text-sm">Credit card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={methodBtnClass(paymentMethod === 'paypal')}
                  >
                    <Mail className="w-5 h-5 shrink-0" />
                    <span className="font-medium text-sm">PayPal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile-money')}
                    className={methodBtnClass(paymentMethod === 'mobile-money')}
                  >
                    <Phone className="w-5 h-5 shrink-0" />
                    <span className="font-medium text-sm">Mobile money</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash-front-desk')}
                    className={methodBtnClass(paymentMethod === 'cash-front-desk')}
                  >
                    <MapPin className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-medium text-sm block">Cash at desk</span>
                      <span className="text-xs text-brass">+$20 fee</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="panel">
                <p className="section-label mb-2">Step 2</p>
                <h2 className="font-display text-2xl text-ink mb-6 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-forest" />
                  Payment details
                </h2>

                {paymentMethod === 'credit-card' && (
                  <div className="space-y-5">
                    <div>
                      <label className={labelClass}>Card number *</label>
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
                          className={`${inputClass} pr-24 ${errors.cardNumber ? 'border-[#E8C9C3]' : ''}`}
                          required
                        />
                        {paymentData.cardNumber && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 status-chip status-chip--neutral text-[10px]">
                            {getCardType(paymentData.cardNumber)}
                          </span>
                        )}
                      </div>
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-[#8B3A32]">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Cardholder name *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`${inputClass} ${errors.cardName ? 'border-[#E8C9C3]' : ''}`}
                        required
                      />
                      {errors.cardName && (
                        <p className="mt-1 text-sm text-[#8B3A32]">{errors.cardName}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>CVV / CVC *</label>
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
                          className={`${inputClass} pr-12 ${errors.cvv ? 'border-[#E8C9C3]' : ''}`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCVV(!showCVV)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                          aria-label={showCVV ? 'Hide CVV' : 'Show CVV'}
                        >
                          {showCVV ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-[#8B3A32]">{errors.cvv}</p>
                      )}
                      <p className="mt-1 text-xs text-ink-muted">3–4 digit security code on back of card</p>
                    </div>

                    <div className="flex items-center justify-between border border-sand-deep bg-sand px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-forest" />
                        <span className="text-sm text-ink">Save card for future bookings</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaymentData(prev => ({ ...prev, saveCard: !prev.saveCard }))}
                        className={paymentData.saveCard ? 'btn-primary py-2 px-4 text-sm' : 'btn-secondary py-2 px-4 text-sm'}
                      >
                        {paymentData.saveCard ? 'Saved' : 'Save card'}
                      </button>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="space-y-5">
                    <div>
                      <label className={labelClass}>PayPal email *</label>
                      <input
                        type="email"
                        name="paypalEmail"
                        value={paymentData.paypalEmail}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className={`${inputClass} ${errors.paypalEmail ? 'border-[#E8C9C3]' : ''}`}
                        required
                      />
                      {errors.paypalEmail && (
                        <p className="mt-1 text-sm text-[#8B3A32]">{errors.paypalEmail}</p>
                      )}
                    </div>
                    <div className="border border-sand-deep bg-sand px-4 py-3 text-sm text-ink-muted">
                      You will be redirected to PayPal to complete your payment securely.
                    </div>
                  </div>
                )}

                {paymentMethod === 'mobile-money' && (
                  <div className="space-y-5">
                    <div>
                      <label className={labelClass}>Mobile carrier *</label>
                      <select
                        name="mobileCarrier"
                        value={paymentData.mobileCarrier || ''}
                        onChange={handleInputChange}
                        className={`${inputClass} ${errors.mobileCarrier ? 'border-[#E8C9C3]' : ''}`}
                        required
                      >
                        <option value="">Select your mobile carrier</option>
                        <option value="mtn">MTN Mobile Money</option>
                        <option value="airteltigo">AirtelTigo Money</option>
                        <option value="vodafone">Vodafone Cash</option>
                        <option value="telecel">Telecel Cash</option>
                      </select>
                      {errors.mobileCarrier && (
                        <p className="mt-1 text-sm text-[#8B3A32]">{errors.mobileCarrier}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Phone number *</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={paymentData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+233 XX XXX XXXX"
                        className={`${inputClass} ${errors.phoneNumber ? 'border-[#E8C9C3]' : ''}`}
                        required
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-[#8B3A32]">{errors.phoneNumber}</p>
                      )}
                      <p className="mt-1 text-xs text-ink-muted">
                        Enter the phone number registered with your mobile money account
                      </p>
                    </div>

                    <div className="border border-[#C5DED6] bg-[#E8F2EF] px-4 py-3">
                      <h4 className="font-medium text-forest mb-2 text-sm">How it works</h4>
                      <ul className="text-forest/90 text-sm space-y-1 list-disc list-inside">
                        <li>Select your mobile carrier above</li>
                        <li>Enter your registered mobile money number</li>
                        <li>You will receive a payment prompt on your phone</li>
                        <li>Enter your mobile money PIN to complete payment</li>
                      </ul>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cash-front-desk' && (
                  <div className="border border-sand-deep bg-sand px-5 py-4">
                    <h4 className="font-medium text-ink mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-brass" />
                      Cash payment at front desk
                    </h4>
                    <div className="space-y-3 text-ink-muted text-sm">
                      <p>
                        <strong className="text-ink">Additional fee:</strong> $20 will be added to your total for cash payment processing.
                      </p>
                      <div>
                        <p className="font-medium text-ink mb-2">Payment instructions</p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>Complete this booking to reserve your room</li>
                          <li>Pay the full amount in cash at the front desk during check-in</li>
                          <li>Bring a valid ID and this booking confirmation</li>
                          <li>Payment must be made in USD or local currency equivalent</li>
                        </ul>
                      </div>
                      <div className="border border-[#EDE0C8] bg-[#F7F1E4] px-3 py-2 status-chip--warn">
                        <p className="text-sm font-medium">
                          Your room will be held for 24 hours. Payment must be completed during check-in or your reservation may be cancelled.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="panel">
                <h2 className="font-display text-2xl text-ink mb-6">Terms & conditions</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-4 h-4 mt-1 accent-brass border-sand-deep"
                      required
                    />
                    <label className="text-ink-muted text-sm leading-relaxed">
                      I agree to the{' '}
                      <a href="#" className="text-brass hover:text-brass-deep underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-brass hover:text-brass-deep underline">
                        Privacy Policy
                      </a>
                      . I understand that my booking is subject to availability and the hotel&apos;s cancellation policy.
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-[#8B3A32]">{errors.terms}</p>
                  )}

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={acceptMarketing}
                      onChange={(e) => setAcceptMarketing(e.target.checked)}
                      className="w-4 h-4 mt-1 accent-brass border-sand-deep"
                    />
                    <label className="text-ink-muted text-sm leading-relaxed">
                      I would like to receive promotional emails about special offers and new services (optional).
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isProcessing || !acceptTerms}
                  className={`btn-primary text-lg py-4 px-10 mx-auto ${
                    isProcessing || !acceptTerms ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-3">
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent" />
                      Processing payment…
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <Lock className="w-5 h-5" />
                      Confirm & pay ${totalAmount}
                    </span>
                  )}
                </button>

                <div className="mt-6 space-y-1">
                  <p className="flex items-center justify-center gap-2 text-ink-muted text-sm">
                    <Shield className="w-4 h-4" />
                    Secured by 256-bit SSL encryption
                  </p>
                  <p className="text-xs text-ink-muted/70">
                    Your payment information is protected and encrypted
                  </p>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="panel sticky top-8">
              <p className="section-label mb-2">Summary</p>
              <h2 className="font-display text-2xl text-ink mb-6">Booking summary</h2>

              <div className="mb-6 border border-sand-deep bg-sand px-4 py-3">
                <h3 className="text-xs uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-brass" />
                  Guest details
                </h3>
                <div className="space-y-2 text-sm text-ink-muted">
                  <p>
                    <span className="text-ink font-medium">Name:</span> {bookingData.firstName} {bookingData.lastName}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brass" />
                    {bookingData.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brass" />
                    {bookingData.phone}
                  </p>
                </div>
              </div>

              <div className="mb-6 border border-sand-deep bg-sand px-4 py-3">
                <h3 className="text-xs uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brass" />
                  Stay details
                </h3>
                <div className="space-y-2 text-sm text-ink-muted">
                  <p>
                    <span className="text-ink font-medium">Check-in:</span>{' '}
                    {new Date(bookingData.checkIn).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="text-ink font-medium">Check-out:</span>{' '}
                    {new Date(bookingData.checkOut).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brass" />
                    {totalGuests} Guest{totalGuests !== 1 ? 's' : ''}
                  </p>
                  <p>
                    <span className="text-ink font-medium">Room:</span>{' '}
                    {bookingData.roomType.charAt(0).toUpperCase() + bookingData.roomType.slice(1)} Room
                  </p>
                  <p>
                    <span className="text-ink font-medium">Nights:</span> {bookingData.nights}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider text-ink-muted">Price summary</h4>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center text-ink-muted">
                    <span>Room rate</span>
                    <span className="text-ink">${basePrice}/night</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-sand-deep text-ink-muted">
                    <span>
                      {bookingData.nights} nights × ${basePrice}
                    </span>
                    <span className="text-ink font-medium">${roomSubtotal}</span>
                  </div>
                </div>

                {(bookingData.specialRequests || roomSubtotal > basePrice * bookingData.nights) && (
                  <div className="space-y-2 text-sm">
                    <h5 className="text-xs uppercase tracking-wider text-ink-muted">Add-ons & services</h5>
                    <div className="flex justify-between text-ink-muted">
                      <span>Spa & wellness package</span>
                      <span className="text-ink">$150</span>
                    </div>
                    <div className="flex justify-between text-ink-muted">
                      <span>Daily breakfast ({bookingData.nights} days)</span>
                      <span className="text-ink">${25 * bookingData.nights}</span>
                    </div>
                    <div className="flex justify-between text-ink-muted">
                      <span>Airport transfer</span>
                      <span className="text-ink">$45</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-sand-deep text-ink-muted">
                      <span>Late checkout</span>
                      <span className="text-ink">$50</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm text-ink-muted">
                  <div className="flex justify-between">
                    <span>Taxes (12%)</span>
                    <span className="text-ink">${taxes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span className="text-ink">${serviceFee}</span>
                  </div>
                  {cashFee > 0 && (
                    <div className="flex justify-between">
                      <span>Cash payment fee</span>
                      <span className="text-ink">${cashFee}</span>
                    </div>
                  )}
                </div>

                {promoDiscount > 0 && (
                  <div className="space-y-2 py-2 border-t border-sand-deep text-sm">
                    <h5 className="text-xs uppercase tracking-wider text-forest">Discounts applied</h5>
                    <div className="flex justify-between text-forest">
                      <span>Promo code ({promoDiscount}%)</span>
                      <span>-${promoDiscountAmount}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t-2 border-sand-deep">
                  <div className="flex justify-between items-center py-2">
                    <span className="font-display text-xl text-ink">Total payable</span>
                    <span className="font-display text-2xl text-brass">${totalAmount}</span>
                  </div>
                  <p className="text-xs text-ink-muted text-center mt-1">All taxes and fees included</p>
                </div>
              </div>

              <div className="mt-6 border border-[#C5DED6] bg-[#E8F2EF] px-4 py-3">
                <div className="flex items-center gap-3 text-forest">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-sm">Secure payment</span>
                </div>
                <p className="text-forest/80 text-sm mt-1">
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
