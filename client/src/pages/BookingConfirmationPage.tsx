import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Download, 
  Calendar, 
  MapPin, 
  Users, 
  Bed, 
  Mail, 
  Phone,
  CreditCard,
  ArrowRight,
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

const BookingConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // In a real app, this would come from the booking process or API
    // For demo purposes, we'll create mock confirmation data
    const mockBooking: BookingConfirmation = {
      bookingId: 'LGH-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      hotel: {
        name: 'Luxury Grand Hotel',
        location: 'Accra, Ghana',
        address: '123 Independence Avenue, Accra Central, Ghana',
        rating: 4.8,
        image: '/hotel-exterior.jpg'
      },
      room: {
        name: 'Deluxe Ocean View',
        type: 'Deluxe',
        image: '/room-deluxe-1.jpg',
        amenities: ['Ocean View', 'Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Balcony']
      },
      dates: {
        checkIn: '2024-12-15',
        checkOut: '2024-12-18',
        nights: 3
      },
      guests: {
        adults: 2,
        children: 0,
        total: 2
      },
      pricing: {
        roomRate: 279,
        nights: 3,
        roomTotal: 837,
        services: [
          { name: 'Airport Transfer', price: 45 },
          { name: 'Daily Breakfast', price: 75 }
        ],
        servicesTotal: 120,
        subtotal: 957,
        taxes: 115,
        serviceFee: 25,
        discount: 96, // 10% promo discount
        total: 1001
      },
      guest: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567'
      },
      payment: {
        method: 'Visa',
        last4: '4242',
        amount: 1001
      },
      status: 'confirmed',
      confirmationDate: new Date().toISOString()
    };

    setBooking(mockBooking);
  }, []);

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would generate and download a PDF receipt
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Your reservation has been successfully confirmed
          </p>
          <p className="text-lg text-gray-500">
            Booking ID: <span className="font-mono font-semibold text-blue-600">{booking.bookingId}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Booking Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel & Room Information */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reservation Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <img 
                    src={booking.hotel.image} 
                    alt={booking.hotel.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.hotel.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{booking.hotel.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-gray-600">{booking.hotel.rating} rating</span>
                  </div>
                </div>
                
                <div>
                  <img 
                    src={booking.room.image} 
                    alt={booking.room.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.room.name}</h3>
                  <p className="text-gray-600 mb-3">{booking.room.type} Room</p>
                  <div className="space-y-1">
                    {booking.room.amenities.slice(0, 3).map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                    {booking.room.amenities.length > 3 && (
                      <p className="text-xs text-blue-600">+{booking.room.amenities.length - 3} more amenities</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div className="grid md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Check-in</h4>
                  <p className="text-sm text-gray-600">{formatDate(booking.dates.checkIn)}</p>
                  <p className="text-xs text-gray-500">After 3:00 PM</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Check-out</h4>
                  <p className="text-sm text-gray-600">{formatDate(booking.dates.checkOut)}</p>
                  <p className="text-xs text-gray-500">Before 12:00 PM</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Guests</h4>
                  <p className="text-sm text-gray-600">
                    {booking.guests.adults} Adult{booking.guests.adults !== 1 ? 's' : ''}
                    {booking.guests.children > 0 && `, ${booking.guests.children} Child${booking.guests.children !== 1 ? 'ren' : ''}`}
                  </p>
                  <p className="text-xs text-gray-500">{booking.dates.nights} night{booking.dates.nights !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Primary Guest</h3>
                  <p className="text-gray-700 mb-1">{booking.guest.firstName} {booking.guest.lastName}</p>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{booking.guest.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{booking.guest.phone}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">{booking.payment.method} ending in {booking.payment.last4}</span>
                  </div>
                  <p className="text-sm text-gray-600">Amount charged: ${booking.payment.amount}</p>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Important Information
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Please bring a valid photo ID for check-in</li>
                <li>• A security deposit may be required upon arrival</li>
                <li>• Free cancellation up to 24 hours before check-in</li>
                <li>• Contact the hotel directly for any special arrangements</li>
              </ul>
            </div>
          </div>

          {/* Sidebar - Price Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>
              
              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Room ({booking.pricing.nights} nights)</span>
                  <span className="font-semibold">${booking.pricing.roomTotal}</span>
                </div>
                
                {booking.pricing.services.map((service, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{service.name}</span>
                    <span className="font-semibold">${service.price}</span>
                  </div>
                ))}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-semibold">${booking.pricing.taxes + booking.pricing.serviceFee}</span>
                </div>
                
                {booking.pricing.discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount Applied</span>
                    <span className="font-semibold">-${booking.pricing.discount}</span>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total Paid</span>
                    <span className="text-2xl font-bold text-blue-600">${booking.pricing.total}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleDownloadReceipt}
                  disabled={isDownloading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isDownloading ? 'Downloading...' : 'Download Receipt'}
                </button>
                
                <button
                  onClick={() => navigate('/rooms')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Book Another Room
                </button>
                
                <Link
                  to="/dashboard"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Return to Dashboard
                </Link>
              </div>

              {/* Confirmation Status */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Confirmed</span>
                </div>
                <p className="text-sm text-green-700">
                  Confirmation sent to {booking.guest.email}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Confirmed on {new Date(booking.confirmationDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Pre-Check-in</h3>
              <p className="text-sm text-gray-600">Complete online check-in 24 hours before arrival to save time</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Directions</h3>
              <p className="text-sm text-gray-600">Get directions and transportation options to the hotel</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Contact Hotel</h3>
              <p className="text-sm text-gray-600">Call the hotel directly for special requests or questions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
