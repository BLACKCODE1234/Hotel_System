import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle,
  Download,
  Calendar,
  MapPin,
  Users,
  Mail,
  Phone,
  CreditCard,
  Home,
  Plus,
  Star,
  Clock,
  Shield
} from 'lucide-react';

interface BookingConfirmation {
  bookingId: string;
  hotel: {
    name: string;
    location: string;
    address: string;
    rating: number;
    image: string;
  };
  room: {
    name: string;
    type: string;
    image: string;
    amenities: string[];
  };
  dates: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  guests: {
    adults: number;
    children: number;
    total: number;
  };
  pricing: {
    roomRate: number;
    nights: number;
    roomTotal: number;
    services: Array<{name: string; price: number}>;
    servicesTotal: number;
    subtotal: number;
    taxes: number;
    serviceFee: number;
    discount: number;
    total: number;
  };
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  payment: {
    method: string;
    last4: string;
    amount: number;
  };
  status: 'confirmed' | 'pending' | 'processing';
  confirmationDate: string;
}

const roomNames: Record<string, string> = {
  standard: 'Standard Room',
  deluxe: 'Deluxe Ocean View',
  executive: 'Executive Suite',
  presidential: 'Presidential Suite',
};

const roomTypes: Record<string, string> = {
  standard: 'Standard',
  deluxe: 'Deluxe',
  executive: 'Executive',
  presidential: 'Presidential',
};

const BookingConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const storedBookingData = localStorage.getItem('bookingData');
    const storedBookings = localStorage.getItem('userBookings');
    const paymentData = storedBookings ? JSON.parse(storedBookings) : null;
    const latestPayment = Array.isArray(paymentData) && paymentData.length > 0
      ? paymentData[paymentData.length - 1]
      : null;

    if (storedBookingData) {
      const data = JSON.parse(storedBookingData);
      const roomType = data.roomType || 'deluxe';
      const nights = data.nights || 1;
      const roomRate = data.roomRate || 229;
      const roomTotal = roomRate * nights;
      const taxes = Math.round(roomTotal * 0.12);
      const total = roomTotal + taxes;

      setBooking({
        bookingId: latestPayment?.bookingId || 'LGH-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        hotel: {
          name: 'Luxury Grand Hotel',
          location: 'Accra, Ghana',
          address: '123 Independence Avenue, Accra Central, Ghana',
          rating: 4.8,
          image: '/homepage.jpg',
        },
        room: {
          name: roomNames[roomType] || 'Deluxe Ocean View',
          type: roomTypes[roomType] || 'Deluxe',
          image: '/userdashboard.jpg',
          amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Ocean View', 'Balcony'],
        },
        dates: {
          checkIn: data.checkIn || '2024-12-15',
          checkOut: data.checkOut || '2024-12-18',
          nights,
        },
        guests: {
          adults: parseInt(data.adults) || 2,
          children: parseInt(data.children) || 0,
          total: parseInt(data.adults) + parseInt(data.children) || 2,
        },
        pricing: {
          roomRate,
          nights,
          roomTotal,
          services: [],
          servicesTotal: 0,
          subtotal: roomTotal,
          taxes,
          serviceFee: 0,
          discount: 0,
          total,
        },
        guest: {
          firstName: data.firstName || 'Guest',
          lastName: data.lastName || '',
          email: data.email || 'guest@example.com',
          phone: data.phone || '',
        },
        payment: {
          method: latestPayment?.cardType || 'Credit Card',
          last4: latestPayment?.lastFour || '****',
          amount: latestPayment?.amount || total,
        },
        status: 'confirmed',
        confirmationDate: new Date().toISOString(),
      });
    } else {
      setBooking(null);
    }
  }, []);

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Receipt downloaded successfully!');
    setIsDownloading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink-muted">Loading confirmation…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-sand-deep bg-white mb-6">
            <CheckCircle className="w-8 h-8 text-forest" />
          </div>
          <p className="section-label mb-2">Reservation confirmed</p>
          <h1 className="page-title mb-3">Booking confirmed</h1>
          <p className="text-ink-muted mb-2">
            Your reservation is confirmed. A copy has been sent to your email.
          </p>
          <p className="text-sm text-ink-muted">
            Booking ID:{' '}
            <span className="font-mono font-semibold text-ink">{booking.bookingId}</span>
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="panel">
              <h2 className="font-display text-2xl text-ink mb-6">Reservation details</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <img
                    src={booking.hotel.image}
                    alt={booking.hotel.name}
                    className="w-full h-44 object-cover mb-4 border border-sand-deep"
                  />
                  <h3 className="font-display text-xl text-ink mb-1">{booking.hotel.name}</h3>
                  <div className="flex items-center gap-2 text-ink-muted text-sm mb-2">
                    <MapPin className="w-4 h-4 text-brass" />
                    {booking.hotel.location}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-ink-muted">
                    <Star className="w-4 h-4 text-brass fill-brass" />
                    {booking.hotel.rating} guest rating
                  </div>
                </div>

                <div>
                  <img
                    src={booking.room.image}
                    alt={booking.room.name}
                    className="w-full h-44 object-cover mb-4 border border-sand-deep"
                  />
                  <h3 className="font-display text-xl text-ink mb-1">{booking.room.name}</h3>
                  <p className="text-ink-muted text-sm mb-3">{booking.room.type} room</p>
                  <ul className="space-y-1">
                    {booking.room.amenities.slice(0, 3).map((amenity, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-ink-muted">
                        <CheckCircle className="w-3 h-3 text-forest" />
                        {amenity}
                      </li>
                    ))}
                    {booking.room.amenities.length > 3 && (
                      <li className="text-xs text-brass">
                        +{booking.room.amenities.length - 3} more amenities
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 p-5 bg-sand-warm border border-sand-deep">
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-brass mx-auto mb-2" />
                  <h4 className="font-semibold text-ink text-sm mb-1">Check-in</h4>
                  <p className="text-sm text-ink-muted">{formatDate(booking.dates.checkIn)}</p>
                  <p className="text-xs text-ink-muted mt-1">After 3:00 PM</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-brass mx-auto mb-2" />
                  <h4 className="font-semibold text-ink text-sm mb-1">Check-out</h4>
                  <p className="text-sm text-ink-muted">{formatDate(booking.dates.checkOut)}</p>
                  <p className="text-xs text-ink-muted mt-1">Before 12:00 PM</p>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 text-brass mx-auto mb-2" />
                  <h4 className="font-semibold text-ink text-sm mb-1">Guests</h4>
                  <p className="text-sm text-ink-muted">
                    {booking.guests.adults} adult{booking.guests.adults !== 1 ? 's' : ''}
                    {booking.guests.children > 0 &&
                      `, ${booking.guests.children} child${booking.guests.children !== 1 ? 'ren' : ''}`}
                  </p>
                  <p className="text-xs text-ink-muted mt-1">
                    {booking.dates.nights} night{booking.dates.nights !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="panel">
              <h2 className="font-display text-2xl text-ink mb-6">Guest information</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="section-label mb-3">Primary guest</h3>
                  <p className="text-ink mb-2">
                    {booking.guest.firstName} {booking.guest.lastName}
                  </p>
                  <div className="flex items-center gap-2 text-ink-muted text-sm mb-1">
                    <Mail className="w-4 h-4" />
                    {booking.guest.email}
                  </div>
                  {booking.guest.phone && (
                    <div className="flex items-center gap-2 text-ink-muted text-sm">
                      <Phone className="w-4 h-4" />
                      {booking.guest.phone}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="section-label mb-3">Payment</h3>
                  <div className="flex items-center gap-2 text-ink-muted text-sm mb-1">
                    <CreditCard className="w-4 h-4" />
                    {booking.payment.method} ending in {booking.payment.last4}
                  </div>
                  <p className="text-sm text-ink-muted">
                    Amount charged: ${booking.payment.amount}
                  </p>
                </div>
              </div>
            </div>

            <div className="panel border-l-4 border-l-brass bg-sand-warm">
              <h3 className="font-semibold text-ink mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-brass" />
                Before you arrive
              </h3>
              <ul className="space-y-2 text-sm text-ink-muted">
                <li>Bring a valid photo ID for check-in</li>
                <li>A security deposit may be required upon arrival</li>
                <li>Free cancellation up to 24 hours before check-in</li>
                <li>Contact the front desk for special arrangements</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="panel sticky top-8">
              <h3 className="font-display text-xl text-ink mb-6">Booking summary</h3>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Room ({booking.pricing.nights} nights)</span>
                  <span className="font-medium text-ink">${booking.pricing.roomTotal}</span>
                </div>

                {booking.pricing.services.map((service, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-ink-muted">{service.name}</span>
                    <span className="font-medium text-ink">${service.price}</span>
                  </div>
                ))}

                <div className="flex justify-between">
                  <span className="text-ink-muted">Taxes & fees</span>
                  <span className="font-medium text-ink">
                    ${booking.pricing.taxes + booking.pricing.serviceFee}
                  </span>
                </div>

                {booking.pricing.discount > 0 && (
                  <div className="flex justify-between text-forest">
                    <span>Discount</span>
                    <span className="font-medium">−${booking.pricing.discount}</span>
                  </div>
                )}

                <div className="border-t border-sand-deep pt-4 flex justify-between items-baseline">
                  <span className="font-display text-lg text-ink">Total paid</span>
                  <span className="font-display text-2xl text-ink">${booking.pricing.total}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  disabled={isDownloading}
                  className="btn-primary w-full text-sm disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isDownloading ? 'Downloading…' : 'Download receipt'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/rooms')}
                  className="btn-accent w-full text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Book another room
                </button>

                <Link to="/dashboard" className="btn-secondary w-full text-sm">
                  <Home className="w-4 h-4" />
                  Return to dashboard
                </Link>
              </div>

              <div className="p-4 bg-sand-warm border border-sand-deep">
                <div className="flex items-center gap-2 mb-2">
                  <span className="status-chip status-chip--ok">Confirmed</span>
                </div>
                <p className="text-sm text-ink-muted">
                  Confirmation sent to {booking.guest.email}
                </p>
                <p className="text-xs text-ink-muted mt-1">
                  Confirmed on {new Date(booking.confirmationDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 panel">
          <h2 className="font-display text-2xl text-ink mb-6">What&apos;s next</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: 'Pre-check-in',
                copy: 'Complete online check-in 24 hours before arrival.',
              },
              {
                icon: MapPin,
                title: 'Directions',
                copy: 'Get directions and transport options to the hotel.',
              },
              {
                icon: Phone,
                title: 'Contact hotel',
                copy: 'Call the front desk for special requests.',
              },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="border-t border-sand-deep pt-5">
                <Icon className="w-5 h-5 text-brass mb-3" />
                <h3 className="font-semibold text-ink mb-2">{title}</h3>
                <p className="text-sm text-ink-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
