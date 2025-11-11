import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  Download,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react';

interface Booking {
  id: string;
  reservationId: string;
  hotelName: string;
  hotelBranch: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'completed' | 'cancelled' | 'upcoming';
  bookingDate: string;
  paymentMethod: string;
  paymentDate: string;
  receiptUrl?: string;
  invoiceUrl?: string;
}

const HistoryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'cancelled' | 'upcoming'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock booking data
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      reservationId: 'HTL-2024-001',
      hotelName: 'Grand Palace Hotel',
      hotelBranch: 'Downtown Manhattan',
      roomType: 'Deluxe Suite',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      guests: 2,
      totalAmount: 1250.00,
      status: 'completed',
      bookingDate: '2024-01-10',
      paymentMethod: 'Visa **** 4532',
      paymentDate: '2024-01-10',
      receiptUrl: '/receipts/HTL-2024-001.pdf',
      invoiceUrl: '/invoices/HTL-2024-001.pdf'
    },
    {
      id: '2',
      reservationId: 'HTL-2024-002',
      hotelName: 'Ocean View Resort',
      hotelBranch: 'Miami Beach',
      roomType: 'Premium Ocean Suite',
      checkIn: '2024-03-22',
      checkOut: '2024-03-25',
      guests: 4,
      totalAmount: 2100.00,
      status: 'completed',
      bookingDate: '2024-03-15',
      paymentMethod: 'Mastercard **** 8765',
      paymentDate: '2024-03-15',
      receiptUrl: '/receipts/HTL-2024-002.pdf',
      invoiceUrl: '/invoices/HTL-2024-002.pdf'
    },
    {
      id: '3',
      reservationId: 'HTL-2024-003',
      hotelName: 'Mountain Lodge',
      hotelBranch: 'Aspen Colorado',
      roomType: 'Standard Room',
      checkIn: '2024-06-10',
      checkOut: '2024-06-12',
      guests: 2,
      totalAmount: 850.00,
      status: 'cancelled',
      bookingDate: '2024-06-05',
      paymentMethod: 'PayPal',
      paymentDate: '2024-06-05',
      receiptUrl: '/receipts/HTL-2024-003.pdf'
    },
    {
      id: '4',
      reservationId: 'HTL-2024-004',
      hotelName: 'City Center Hotel',
      hotelBranch: 'Los Angeles',
      roomType: 'Executive Suite',
      checkIn: '2024-12-20',
      checkOut: '2024-12-23',
      guests: 3,
      totalAmount: 1680.00,
      status: 'upcoming',
      bookingDate: '2024-11-01',
      paymentMethod: 'Visa **** 4532',
      paymentDate: '2024-11-01',
      receiptUrl: '/receipts/HTL-2024-004.pdf',
      invoiceUrl: '/invoices/HTL-2024-004.pdf'
    }
  ]);

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = activeFilter === 'all' || booking.status === activeFilter;
    const matchesSearch = booking.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.hotelBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.reservationId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'upcoming':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('/userdashboard.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 font-medium rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          {/* Header */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                  <h1 className="text-4xl font-bold text-gray-900">Booking History</h1>
                </div>
                <div className="text-sm text-gray-600">
                  {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by hotel name, location, or reservation ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  {(['all', 'completed', 'upcoming', 'cancelled'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        activeFilter === filter
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="p-8">
                  {/* Booking Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="flex items-center mb-4 lg:mb-0">
                      {getStatusIcon(booking.status)}
                      <div className="ml-3">
                        <h3 className="text-2xl font-bold text-gray-900">{booking.hotelName}</h3>
                        <p className="text-gray-600 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.hotelBranch}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        ${booking.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {/* 🏠 Stay Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        🏠 Stay Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-in:</span>
                          <span className="font-medium">{formatDate(booking.checkIn)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-out:</span>
                          <span className="font-medium">{formatDate(booking.checkOut)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nights:</span>
                          <span className="font-medium">{calculateNights(booking.checkIn, booking.checkOut)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Room Type:</span>
                          <span className="font-medium">{booking.roomType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Guests:</span>
                          <span className="font-medium">{booking.guests}</span>
                        </div>
                      </div>
                    </div>

                    {/* 💳 Payment Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                        💳 Payment Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">${booking.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Method:</span>
                          <span className="font-medium">{booking.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Date:</span>
                          <span className="font-medium">{formatDate(booking.paymentDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booking Date:</span>
                          <span className="font-medium">{formatDate(booking.bookingDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* 🧾 Booking Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        🧾 Booking Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reservation ID:</span>
                          <span className="font-medium font-mono">{booking.reservationId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${
                            booking.status === 'completed' ? 'text-green-600' :
                            booking.status === 'cancelled' ? 'text-red-600' :
                            'text-blue-600'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 📄 Download Options */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Download className="h-5 w-5 mr-2 text-blue-600" />
                      📄 Download Documents
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {booking.receiptUrl && (
                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                          <Download className="h-4 w-4 mr-2" />
                          Receipt
                        </button>
                      )}
                      {booking.invoiceUrl && (
                        <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                          <Download className="h-4 w-4 mr-2" />
                          Invoice
                        </button>
                      )}
                      <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                        <FileText className="h-4 w-4 mr-2" />
                        Booking Confirmation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredBookings.length === 0 && (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || activeFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'You haven\'t made any bookings yet.'}
                </p>
                <Link 
                  to="/rooms"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Browse Rooms
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
