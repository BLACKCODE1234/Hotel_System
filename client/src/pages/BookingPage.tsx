import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, User, Mail, Phone, MapPin, ArrowRight, Clock, Info, CheckCircle, AlertCircle, Utensils, Car, Heart, Shield } from 'lucide-react';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    adults: '2',
    children: '0',
    roomQuantity: '1',
    roomType: 'deluxe',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    specialRequests: '',
    promoCode: '',
    additionalGuests: [] as Array<{firstName: string; lastName: string; age: string}>,
    loyaltyPoints: 2450,
    usePoints: false,
    instantBooking: true
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [nights, setNights] = useState(0);
  const [isWeekend, setIsWeekend] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [availableRooms] = useState(5);
  const [upsells, setUpsells] = useState({
    spa: false,
    airportPickup: false,
    lateCheckout: false,
    breakfast: false
  });
  
  const currentStep = 1; // Static for now, can be made dynamic later

  // Calculate nights and weekend pricing
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      setNights(daysDiff > 0 ? daysDiff : 0);
      
      // Check if any night falls on weekend (Friday or Saturday)
      let hasWeekend = false;
      for (let i = 0; i < daysDiff; i++) {
        const currentDate = new Date(checkInDate);
        currentDate.setDate(currentDate.getDate() + i);
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday or Saturday
          hasWeekend = true;
          break;
        }
      }
      setIsWeekend(hasWeekend);
    }
  }, [formData.checkIn, formData.checkOut]);

  // Set minimum dates
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minCheckOut = tomorrow.toISOString().split('T')[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePromoCode = () => {
    const validPromoCodes = {
      'SAVE10': 10,
      'WELCOME15': 15,
      'WEEKEND20': 20,
      'LOYALTY25': 25
    };
    
    const discount = validPromoCodes[formData.promoCode.toUpperCase() as keyof typeof validPromoCodes] || 0;
    setPromoDiscount(discount);
    
    if (discount > 0) {
      alert(`Promo code applied! ${discount}% discount`);
    } else if (formData.promoCode) {
      alert('Invalid promo code');
    }
  };

  const addAdditionalGuest = () => {
    const totalGuests = parseInt(formData.adults) + parseInt(formData.children);
    if (formData.additionalGuests.length < totalGuests - 1) {
      setFormData(prev => ({
        ...prev,
        additionalGuests: [...prev.additionalGuests, { firstName: '', lastName: '', age: '' }]
      }));
    }
  };

  const removeAdditionalGuest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalGuests: prev.additionalGuests.filter((_, i) => i !== index)
    }));
  };

  const updateAdditionalGuest = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalGuests: prev.additionalGuests.map((guest, i) => 
        i === index ? { ...guest, [field]: value } : guest
      )
    }));
  };

  const handleServiceToggle = (service: string) => {
    setUpsells(prev => ({
      ...prev,
      [service]: !prev[service as keyof typeof prev]
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Required field validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
    if (!formData.country) newErrors.country = 'Country is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Date validation
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkInDate < today) {
        newErrors.checkIn = 'Check-in date cannot be in the past';
      }
      
      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = 'Check-out date must be after check-in date';
      }
      
      if (nights > 30) {
        newErrors.checkOut = 'Maximum stay is 30 nights';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Store booking data in localStorage for payment page
    localStorage.setItem('bookingData', JSON.stringify({ ...formData, nights, isWeekend }));
    
    // Navigate to payment page
    navigate('/payment');
  };

  const roomPrices = {
    standard: { base: 149, weekend: 189 },
    deluxe: { base: 229, weekend: 279 },
    executive: { base: 389, weekend: 459 },
    presidential: { base: 749, weekend: 899 }
  };

  const selectedRoomPrice = roomPrices[formData.roomType as keyof typeof roomPrices];
  const basePrice = isWeekend ? selectedRoomPrice.weekend : selectedRoomPrice.base;
  const roomSubtotal = basePrice * nights * parseInt(formData.roomQuantity);
  
  // Upsell pricing
  const upsellPrices = {
    spa: 150,
    airportPickup: 45,
    lateCheckout: 50,
    breakfast: 25
  };
  
  const upsellTotal = Object.entries(upsells).reduce((total, [key, selected]) => {
    return total + (selected ? upsellPrices[key as keyof typeof upsellPrices] : 0);
  }, 0);
  
  const subtotal = roomSubtotal + upsellTotal;
  const promoDiscountAmount = Math.round(subtotal * (promoDiscount / 100));
  const loyaltyPointsDiscount = formData.usePoints ? Math.min(formData.loyaltyPoints * 0.01, subtotal * 0.1) : 0;
  const discountedSubtotal = subtotal - promoDiscountAmount - loyaltyPointsDiscount;
  
  const taxRate = 0.12; // 12% tax
  const serviceFee = 25; // Flat service fee
  const taxes = Math.round(discountedSubtotal * taxRate);
  const totalPrice = discountedSubtotal + taxes + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Your Booking</h1>
          <p className="text-lg text-gray-600 mb-8">
            Just a few more details and you'll be all set for your luxury stay
          </p>
          
          {/* Progress Steps */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className={`ml-3 font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                  Dates & Guests
                </span>
              </div>
              
              <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`ml-3 font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                  Guest Info
                </span>
              </div>
              
              <div className={`flex-1 h-1 mx-4 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <span className={`ml-3 font-medium ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
                  Payment
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Guest Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <User className="h-6 w-6 mr-3 text-blue-600" />
              Guest Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white ${
                    errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  required
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">Street Address *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street, Apartment 4B"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Country *</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  required
                >
                  <option value="">Select your country</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Calendar className="h-6 w-6 mr-3 text-blue-600" />
              Booking Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Check-in Date *</label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  min={today}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white ${
                    errors.checkIn ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  required
                />
                {errors.checkIn && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.checkIn}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Check-in: 3:00 PM onwards
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Check-out Date</label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Adults</label>
                <select
                  name="adults"
                  value={formData.adults}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Children</label>
                <select
                  name="children"
                  value={formData.children}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="0">0 Children</option>
                  <option value="1">1 Child</option>
                  <option value="2">2 Children</option>
                  <option value="3">3 Children</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Room Quantity</label>
                <select
                  name="roomQuantity"
                  value={formData.roomQuantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="1">1 Room</option>
                  <option value="2">2 Rooms</option>
                  <option value="3">3 Rooms</option>
                  <option value="4">4 Rooms</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Room Type</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="standard">Standard Room - From $149/night</option>
                  <option value="deluxe">Deluxe Room - From $229/night</option>
                  <option value="executive">Executive Suite - From $389/night</option>
                  <option value="presidential">Presidential Suite - From $749/night</option>
                </select>
              </div>
            </div>
            
            
            {/* Special Requests */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-800 mb-3">Special Requests</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special requests or requirements? (e.g., wheelchair accessibility, dietary restrictions, room preferences)"
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
              />
              <p className="mt-1 text-xs text-gray-500">Optional - We'll do our best to accommodate your requests</p>
            </div>
          </div>

          {/* Recommended Services */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="h-6 w-6 mr-3 text-purple-600" />
              Recommended Services
            </h2>
            <p className="text-gray-600 mb-6">Enhance your stay with our premium services</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Spa Package */}
              <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                upsells.spa ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
              }`} onClick={() => handleServiceToggle('spa')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${upsells.spa ? 'bg-purple-500' : 'bg-purple-100'}`}>
                      <Heart className={`w-6 h-6 ${upsells.spa ? 'text-white' : 'text-purple-600'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Spa & Wellness Package</h3>
                      <p className="text-purple-600 font-semibold">$150</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    upsells.spa ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                  }`}>
                    {upsells.spa && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">90-minute premium spa treatment including massage, facial, and access to wellness facilities</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Includes sauna and steam room access</span>
                </div>
              </div>

              {/* Airport Pickup */}
              <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                upsells.airportPickup ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              }`} onClick={() => handleServiceToggle('airportPickup')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${upsells.airportPickup ? 'bg-blue-500' : 'bg-blue-100'}`}>
                      <Car className={`w-6 h-6 ${upsells.airportPickup ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Airport Transfer</h3>
                      <p className="text-blue-600 font-semibold">$45</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    upsells.airportPickup ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {upsells.airportPickup && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">Comfortable round-trip airport transfer in a luxury vehicle with professional driver</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Meet & greet service included</span>
                </div>
              </div>

              {/* Late Checkout */}
              <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                upsells.lateCheckout ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
              }`} onClick={() => handleServiceToggle('lateCheckout')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${upsells.lateCheckout ? 'bg-green-500' : 'bg-green-100'}`}>
                      <Clock className={`w-6 h-6 ${upsells.lateCheckout ? 'text-white' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Late Checkout</h3>
                      <p className="text-green-600 font-semibold">$50</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    upsells.lateCheckout ? 'border-green-500 bg-green-500' : 'border-gray-300'
                  }`}>
                    {upsells.lateCheckout && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">Extend your checkout time until 6:00 PM instead of standard 12:00 PM</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Subject to availability</span>
                </div>
              </div>

              {/* Breakfast Package */}
              <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                upsells.breakfast ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
              }`} onClick={() => handleServiceToggle('breakfast')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${upsells.breakfast ? 'bg-orange-500' : 'bg-orange-100'}`}>
                      <Utensils className={`w-6 h-6 ${upsells.breakfast ? 'text-white' : 'text-orange-600'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Daily Breakfast</h3>
                      <p className="text-orange-600 font-semibold">$25 <span className="text-sm text-gray-500">per day</span></p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    upsells.breakfast ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                  }`}>
                    {upsells.breakfast && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">Continental breakfast buffet with fresh local and international cuisine</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Served 6:30 AM - 10:30 AM daily</span>
                </div>
              </div>
            </div>

            {/* Service Summary */}
            {Object.values(upsells).some(selected => selected) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3">Selected Services:</h4>
                <div className="space-y-2">
                  {upsells.spa && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Spa & Wellness Package</span>
                      <span className="font-semibold">$150</span>
                    </div>
                  )}
                  {upsells.airportPickup && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Airport Transfer</span>
                      <span className="font-semibold">$45</span>
                    </div>
                  )}
                  {upsells.lateCheckout && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Late Checkout</span>
                      <span className="font-semibold">$50</span>
                    </div>
                  )}
                  {upsells.breakfast && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Daily Breakfast ({nights} days)</span>
                      <span className="font-semibold">${25 * nights}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Services Total:</span>
                      <span className="text-purple-600">${upsellTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Promo Code & Loyalty Points */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
              Discounts & Loyalty Points
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Promo Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handlePromoCode}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoDiscount > 0 && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {promoDiscount}% discount applied!
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Try: SAVE10, WELCOME15, WEEKEND20, LOYALTY25
                </p>
              </div>

              {/* Loyalty Points */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Loyalty Points</label>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-yellow-800 font-medium">Available Points</span>
                    <span className="text-2xl font-bold text-yellow-600">{formData.loyaltyPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.usePoints}
                      onChange={(e) => setFormData(prev => ({ ...prev, usePoints: e.target.checked }))}
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm text-yellow-800">
                      Use points (Save up to ${Math.min(formData.loyaltyPoints * 0.01, subtotal * 0.1).toFixed(0)})
                    </span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-2">
                    1 point = $0.01 • Max 10% of booking total
                  </p>
                </div>
              </div>
            </div>

            {/* Instant vs Request Booking */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-3">Booking Type</h3>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bookingType"
                    checked={formData.instantBooking}
                    onChange={() => setFormData(prev => ({ ...prev, instantBooking: true }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-blue-800 font-medium">Instant Booking</span>
                  <span className="text-xs text-blue-600">(Immediate confirmation)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bookingType"
                    checked={!formData.instantBooking}
                    onChange={() => setFormData(prev => ({ ...prev, instantBooking: false }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-blue-800 font-medium">Request Booking</span>
                  <span className="text-xs text-blue-600">(Subject to availability)</span>
                </label>
              </div>
            </div>

            {/* Live Availability */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-800">Live Availability</span>
                </div>
                <span className="text-green-600 font-bold">
                  {availableRooms} room{availableRooms !== 1 ? 's' : ''} left
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {availableRooms <= 3 ? 'Limited availability - book now!' : 'Good availability for your dates'}
              </p>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Users className="h-6 w-6 mr-3 text-blue-600" />
              Booking Summary
            </h2>
            {nights > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="text-gray-700 font-medium">Room Type</span>
                  <span className="font-bold text-gray-900 capitalize">{formData.roomType} Room</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="text-gray-700 font-medium">Check-in / Check-out</span>
                  <span className="font-bold text-gray-900">
                    {formData.checkIn && new Date(formData.checkIn).toLocaleDateString()} - {formData.checkOut && new Date(formData.checkOut).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="text-gray-700 font-medium">Duration</span>
                  <span className="font-bold text-gray-900">{nights} night{nights !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="text-gray-700 font-medium">Guests</span>
                  <span className="font-bold text-gray-900">
                    {formData.adults} Adult{formData.adults !== '1' ? 's' : ''}
                    {parseInt(formData.children) > 0 && `, ${formData.children} Child${formData.children !== '1' ? 'ren' : ''}`}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="text-gray-700 font-medium">Room Quantity</span>
                  <span className="font-bold text-gray-900">{formData.roomQuantity} Room{formData.roomQuantity !== '1' ? 's' : ''}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="text-gray-700 font-medium">
                    Rate per Night {isWeekend && <span className="text-orange-600 text-xs">(Weekend Rate)</span>}
                  </span>
                  <span className="font-bold text-gray-900">${basePrice}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="text-gray-700 font-medium">Room Subtotal</span>
                  <span className="font-bold text-gray-900">${subtotal}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="text-gray-700 font-medium">Taxes (12%)</span>
                  <span className="font-bold text-gray-900">${taxes}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="text-gray-700 font-medium">Service Fee</span>
                  <span className="font-bold text-gray-900">${serviceFee}</span>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">${totalPrice}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">All taxes and fees included</p>
                  {isWeekend && (
                    <div className="mt-2 flex items-center gap-1 text-orange-600 text-sm">
                      <Info className="w-4 h-4" />
                      Weekend rates apply
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Please select your check-in and check-out dates to see pricing</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-lg text-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
            >
              Proceed to Payment
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Review your booking details before proceeding to payment
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
