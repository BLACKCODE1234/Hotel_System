import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, User, Mail, Phone, MapPin, ArrowRight, Clock, Info, CheckCircle, AlertCircle, Utensils, Car, Heart, Shield } from 'lucide-react';

const inputClass =
  'w-full border border-sand-deep bg-white px-3 py-3 text-ink focus:outline-none focus:border-brass transition-colors';
const labelClass = 'block text-xs uppercase tracking-wider text-ink-muted mb-2';

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
  
  const [currentStep, setCurrentStep] = useState(1); // Static for now, can be made dynamic later

  useEffect(() => {
    const storedSelection = localStorage.getItem('selectedBooking');
    if (!storedSelection) {
      return;
    }

    try {
      const selection = JSON.parse(storedSelection);
      setFormData(prev => ({
        ...prev,
        checkIn: selection.checkIn || prev.checkIn,
        checkOut: selection.checkOut || prev.checkOut,
        adults: selection.guests || prev.adults,
        roomType: (selection.room?.id || selection.room?.type || prev.roomType).toString().toLowerCase(),
      }));
    } catch (error) {
      localStorage.removeItem('selectedBooking');
    }
  }, []);

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
    
    const paymentData = {
      ...formData,
      nights,
      isWeekend,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    };
    localStorage.setItem('bookingData', JSON.stringify(paymentData));
    localStorage.removeItem('selectedBooking');
    
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

  const upsellCardClass = (selected: boolean) =>
    `border p-5 cursor-pointer transition-colors ${
      selected ? 'border-brass bg-sand' : 'border-sand-deep bg-white hover:border-brass/50'
    }`;

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-rise">
        <div className="mb-10 md:mb-12">
          <p className="section-label mb-2">Reservation</p>
          <h1 className="page-title mb-3">Complete your booking</h1>
          <p className="text-ink-muted text-lg max-w-xl">
            A few more details and you will be ready for your stay.
          </p>

          <div className="max-w-2xl mt-8">
            <div className="flex items-center justify-between gap-2">
              {[
                { step: 1, label: 'Dates & guests' },
                { step: 2, label: 'Guest info' },
                { step: 3, label: 'Payment' },
              ].map(({ step, label }, i) => (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-8 h-8 shrink-0 flex items-center justify-center text-sm font-semibold border ${
                        currentStep >= step
                          ? 'bg-brass text-white border-brass-deep'
                          : 'bg-sand text-ink-muted border-sand-deep'
                      }`}
                    >
                      {step}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium truncate hidden sm:inline ${
                        currentStep >= step ? 'text-ink' : 'text-ink-muted'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`flex-1 h-px ${currentStep > step ? 'bg-brass' : 'bg-sand-deep'}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="panel">
            <p className="section-label mb-2">Guest</p>
            <h2 className="font-display text-2xl text-ink mb-6 flex items-center gap-3">
              <User className="h-5 w-5 text-brass" />
              Guest information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>First name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className={`${inputClass} ${errors.firstName ? 'border-[#E8C9C3]' : ''}`}
                  required
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-[#8B3A32] flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Last name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-ink-muted" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Phone number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-ink-muted" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Street address *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-ink-muted" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street, Apartment 4B"
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Country *</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={inputClass}
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

          <div className="panel">
            <p className="section-label mb-2">Stay</p>
            <h2 className="font-display text-2xl text-ink mb-6 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-brass" />
              Booking details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className={labelClass}>Check-in date *</label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  min={today}
                  className={`${inputClass} ${errors.checkIn ? 'border-[#E8C9C3]' : ''}`}
                  required
                />
                {errors.checkIn && (
                  <p className="mt-2 text-sm text-[#8B3A32] flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.checkIn}
                  </p>
                )}
                <p className="mt-1 text-xs text-ink-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Check-in: 3:00 PM onwards
                </p>
              </div>
              <div>
                <label className={labelClass}>Check-out date</label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Adults</label>
                <select name="adults" value={formData.adults} onChange={handleInputChange} className={inputClass}>
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Children</label>
                <select name="children" value={formData.children} onChange={handleInputChange} className={inputClass}>
                  <option value="0">0 Children</option>
                  <option value="1">1 Child</option>
                  <option value="2">2 Children</option>
                  <option value="3">3 Children</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Room quantity</label>
                <select name="roomQuantity" value={formData.roomQuantity} onChange={handleInputChange} className={inputClass}>
                  <option value="1">1 Room</option>
                  <option value="2">2 Rooms</option>
                  <option value="3">3 Rooms</option>
                  <option value="4">4 Rooms</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Room type</label>
                <select name="roomType" value={formData.roomType} onChange={handleInputChange} className={inputClass}>
                  <option value="standard">Standard Room — From $149/night</option>
                  <option value="deluxe">Deluxe Room — From $229/night</option>
                  <option value="executive">Executive Suite — From $389/night</option>
                  <option value="presidential">Presidential Suite — From $749/night</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className={labelClass}>Special requests</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special requests or requirements? (e.g., wheelchair accessibility, dietary restrictions, room preferences)"
                rows={4}
                className={`${inputClass} resize-none`}
              />
              <p className="mt-1 text-xs text-ink-muted">Optional — we will do our best to accommodate your requests</p>
            </div>
          </div>

          <div className="panel">
            <p className="section-label mb-2">Enhancements</p>
            <h2 className="font-display text-2xl text-ink mb-2 flex items-center gap-3">
              <Shield className="h-5 w-5 text-brass" />
              Recommended services
            </h2>
            <p className="text-ink-muted mb-6">Enhance your stay with our premium services</p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: 'spa' as const, icon: Heart, title: 'Spa & wellness package', price: '$150', desc: '90-minute premium spa treatment including massage, facial, and access to wellness facilities', note: 'Includes sauna and steam room access' },
                { key: 'airportPickup' as const, icon: Car, title: 'Airport transfer', price: '$45', desc: 'Comfortable round-trip airport transfer in a luxury vehicle with professional driver', note: 'Meet & greet service included' },
                { key: 'lateCheckout' as const, icon: Clock, title: 'Late checkout', price: '$50', desc: 'Extend your checkout time until 6:00 PM instead of standard 12:00 PM', note: 'Subject to availability' },
                { key: 'breakfast' as const, icon: Utensils, title: 'Daily breakfast', price: '$25', priceNote: 'per day', desc: 'Continental breakfast buffet with fresh local and international cuisine', note: 'Served 6:30 AM – 10:30 AM daily' },
              ].map(({ key, icon: Icon, title, price, priceNote, desc, note }) => (
                <div
                  key={key}
                  className={upsellCardClass(upsells[key])}
                  onClick={() => handleServiceToggle(key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleServiceToggle(key)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 border ${upsells[key] ? 'bg-brass border-brass-deep' : 'bg-sand border-sand-deep'}`}>
                        <Icon className={`w-5 h-5 ${upsells[key] ? 'text-white' : 'text-brass'}`} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg text-ink">{title}</h3>
                        <p className="text-brass font-semibold text-sm">
                          {price}
                          {priceNote && <span className="text-ink-muted font-normal ml-1">{priceNote}</span>}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 border flex items-center justify-center shrink-0 ${
                        upsells[key] ? 'border-brass bg-brass' : 'border-sand-deep'
                      }`}
                    >
                      {upsells[key] && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                  <p className="text-ink-muted text-sm mb-2">{desc}</p>
                  <p className="flex items-center gap-2 text-xs text-ink-muted">
                    <CheckCircle className="w-3 h-3 text-forest shrink-0" />
                    {note}
                  </p>
                </div>
              ))}
            </div>

            {Object.values(upsells).some((selected) => selected) && (
              <div className="mt-6 border border-sand-deep bg-sand px-4 py-3">
                <h4 className="text-xs uppercase tracking-wider text-ink-muted mb-3">Selected services</h4>
                <div className="space-y-2 text-sm">
                  {upsells.spa && (
                    <div className="flex justify-between text-ink-muted">
                      <span>Spa & wellness package</span>
                      <span className="text-ink font-medium">$150</span>
                    </div>
                  )}
                  {upsells.airportPickup && (
                    <div className="flex justify-between text-ink-muted">
                      <span>Airport transfer</span>
                      <span className="text-ink font-medium">$45</span>
                    </div>
                  )}
                  {upsells.lateCheckout && (
                    <div className="flex justify-between text-ink-muted">
                      <span>Late checkout</span>
                      <span className="text-ink font-medium">$50</span>
                    </div>
                  )}
                  {upsells.breakfast && (
                    <div className="flex justify-between text-ink-muted">
                      <span>Daily breakfast ({nights} days)</span>
                      <span className="text-ink font-medium">${25 * nights}</span>
                    </div>
                  )}
                  <div className="border-t border-sand-deep pt-2 mt-2 flex justify-between font-medium text-ink">
                    <span>Services total</span>
                    <span className="text-brass">${upsellTotal}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="panel">
            <p className="section-label mb-2">Savings</p>
            <h2 className="font-display text-2xl text-ink mb-6 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-forest" />
              Discounts & loyalty points
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Promo code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    placeholder="Enter promo code"
                    className={`${inputClass} flex-1`}
                  />
                  <button type="button" onClick={handlePromoCode} className="btn-secondary py-3 px-5 shrink-0">
                    Apply
                  </button>
                </div>
                {promoDiscount > 0 && (
                  <p className="mt-2 text-sm text-forest flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {promoDiscount}% discount applied
                  </p>
                )}
                <p className="mt-1 text-xs text-ink-muted">Try: SAVE10, WELCOME15, WEEKEND20, LOYALTY25</p>
              </div>

              <div>
                <label className={labelClass}>Loyalty points</label>
                <div className="border border-sand-deep bg-sand px-4 py-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-ink-muted">Available points</span>
                    <span className="font-display text-2xl text-brass">{formData.loyaltyPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.usePoints}
                      onChange={(e) => setFormData((prev) => ({ ...prev, usePoints: e.target.checked }))}
                      className="w-4 h-4 accent-brass"
                    />
                    <span className="text-sm text-ink-muted">
                      Use points (save up to ${Math.min(formData.loyaltyPoints * 0.01, subtotal * 0.1).toFixed(0)})
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted mt-2">1 point = $0.01 · Max 10% of booking total</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border border-sand-deep bg-sand px-4 py-3">
              <h3 className="text-xs uppercase tracking-wider text-ink-muted mb-3">Booking type</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bookingType"
                    checked={formData.instantBooking}
                    onChange={() => setFormData((prev) => ({ ...prev, instantBooking: true }))}
                    className="w-4 h-4 accent-brass"
                  />
                  <span className="text-ink text-sm font-medium">Instant booking</span>
                  <span className="text-xs text-ink-muted">(immediate confirmation)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bookingType"
                    checked={!formData.instantBooking}
                    onChange={() => setFormData((prev) => ({ ...prev, instantBooking: false }))}
                    className="w-4 h-4 accent-brass"
                  />
                  <span className="text-ink text-sm font-medium">Request booking</span>
                  <span className="text-xs text-ink-muted">(subject to availability)</span>
                </label>
              </div>
            </div>

            <div className="mt-6 border border-[#C5DED6] bg-[#E8F2EF] px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="status-chip status-chip--ok">Live</span>
                  <span className="font-medium text-forest text-sm">Availability</span>
                </div>
                <span className="text-forest font-semibold">
                  {availableRooms} room{availableRooms !== 1 ? 's' : ''} left
                </span>
              </div>
              <p className="text-sm text-forest/80 mt-1">
                {availableRooms <= 3 ? 'Limited availability — book now' : 'Good availability for your dates'}
              </p>
            </div>
          </div>

          <div className="panel border-brass/30">
            <p className="section-label mb-2">Summary</p>
            <h2 className="font-display text-2xl text-ink mb-6 flex items-center gap-3">
              <Users className="h-5 w-5 text-brass" />
              Booking summary
            </h2>
            {nights > 0 ? (
              <div className="space-y-0 text-sm">
                {[
                  ['Room type', `${formData.roomType.charAt(0).toUpperCase() + formData.roomType.slice(1)} room`],
                  ['Check-in / check-out', `${formData.checkIn && new Date(formData.checkIn).toLocaleDateString()} – ${formData.checkOut && new Date(formData.checkOut).toLocaleDateString()}`],
                  ['Duration', `${nights} night${nights !== 1 ? 's' : ''}`],
                  ['Guests', `${formData.adults} adult${formData.adults !== '1' ? 's' : ''}${parseInt(formData.children) > 0 ? `, ${formData.children} child${formData.children !== '1' ? 'ren' : ''}` : ''}`],
                  ['Room quantity', `${formData.roomQuantity} room${formData.roomQuantity !== '1' ? 's' : ''}`],
                  ['Rate per night', `$${basePrice}${isWeekend ? ' (weekend)' : ''}`],
                  ['Room subtotal', `$${subtotal}`],
                  ['Taxes (12%)', `$${taxes}`],
                  ['Service fee', `$${serviceFee}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-3 border-b border-sand-deep text-ink-muted">
                    <span>{label}</span>
                    <span className="text-ink font-medium">{value}</span>
                  </div>
                ))}
                <div className="mt-4 border border-sand-deep bg-sand px-4 py-4">
                  <div className="flex justify-between items-center">
                    <span className="font-display text-xl text-ink">Total amount</span>
                    <span className="font-display text-2xl text-brass">${totalPrice}</span>
                  </div>
                  <p className="text-sm text-ink-muted mt-2">All taxes and fees included</p>
                  {isWeekend && (
                    <p className="mt-2 flex items-center gap-1 text-brass text-sm">
                      <Info className="w-4 h-4" />
                      Weekend rates apply
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-10 h-10 text-ink-muted/40 mx-auto mb-4" />
                <p className="text-ink-muted">Select check-in and check-out dates to see pricing</p>
              </div>
            )}
          </div>

          <div className="text-center pb-4">
            <button type="submit" className="btn-primary text-lg py-4 px-10 mx-auto">
              Proceed to payment
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-ink-muted mt-4">
              Review your booking details before proceeding to payment
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
