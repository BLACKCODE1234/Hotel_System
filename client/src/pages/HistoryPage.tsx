import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  Download,
  MapPin,
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

const inputClass =
  'w-full border border-sand-deep bg-white px-3 py-3 text-ink focus:outline-none focus:border-brass pl-10';

const HistoryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'cancelled' | 'upcoming'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      setError('');
      try {
        const response = await api.getBookingHistory();
        if (!response.ok) {
          setError('Unable to load booking history.');
          return;
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          setBookings([]);
          return;
        }

        const mapped = data.map((item: Record<string, any>, index: number) => ({
          id: String(item.booking_id || index),
          reservationId: String(item.booking_id || `BK-${index + 1}`),
          hotelName: 'Luxury Grand Hotel',
          hotelBranch: 'Accra Central',
          roomType: item.room_type || 'Standard Room',
          checkIn: item.in_date || '',
          checkOut: item.out_date || '',
          guests: Number(item.guests || 1),
          totalAmount: Number(item.total_amount || 0),
          status: (item.status === 'cancelled'
            ? 'cancelled'
            : item.status === 'confirmed' || item.status === 'pending'
            ? 'upcoming'
            : 'completed') as Booking['status'],
          bookingDate: item.created_at || '',
          paymentMethod: item.payment_method || 'N/A',
          paymentDate: item.created_at || '',
        }));

        setBookings(mapped);
      } catch {
        setError('Unable to load booking history.');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const displayBookings = bookings;

  const filteredBookings = displayBookings.filter(booking => {
    const matchesFilter = activeFilter === 'all' || booking.status === activeFilter;
    const matchesSearch = booking.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.hotelBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.reservationId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusChipClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-chip status-chip--ok';
      case 'cancelled':
        return 'status-chip status-chip--danger';
      case 'upcoming':
        return 'status-chip status-chip--warn';
      default:
        return 'status-chip status-chip--neutral';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
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
    <div className="min-h-screen py-8 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="btn-ghost inline-flex items-center gap-2 mb-8 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <header className="mb-8">
          <p className="section-label mb-2">Your stays</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <h1 className="page-title">Booking history</h1>
            <p className="text-ink-muted text-sm">
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
            </p>
          </div>
        </header>

        <div className="panel mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <input
                type="text"
                placeholder="Search by hotel, location, or reservation ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(['all', 'completed', 'upcoming', 'cancelled'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-sm font-semibold tracking-wide border transition-colors ${
                    activeFilter === filter
                      ? 'bg-ink text-white border-ink'
                      : 'bg-white text-ink-muted border-sand-deep hover:border-ink hover:text-ink'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="panel mb-6 border-l-4 border-l-red-800/40 bg-red-50/50 text-red-900">
            {error}
          </div>
        )}

        {loading && (
          <div className="panel mb-6 text-ink-muted">
            Loading booking history…
          </div>
        )}

        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <article key={booking.id} className="panel">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 pb-6 border-b border-sand-deep">
                <div>
                  <h3 className="font-display text-2xl text-ink mb-1">{booking.hotelName}</h3>
                  <p className="text-ink-muted flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-brass" />
                    {booking.hotelBranch}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={getStatusChipClass(booking.status)}>
                    {booking.status}
                  </span>
                  <span className="font-display text-2xl text-ink">
                    ${booking.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                <div>
                  <h4 className="section-label mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Stay details
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Check-in</dt>
                      <dd className="font-medium text-ink">{formatDate(booking.checkIn)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Check-out</dt>
                      <dd className="font-medium text-ink">{formatDate(booking.checkOut)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Nights</dt>
                      <dd className="font-medium text-ink">{calculateNights(booking.checkIn, booking.checkOut)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Room</dt>
                      <dd className="font-medium text-ink">{booking.roomType}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Guests</dt>
                      <dd className="font-medium text-ink">{booking.guests}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="section-label mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Amount</dt>
                      <dd className="font-medium text-ink">${booking.totalAmount.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Method</dt>
                      <dd className="font-medium text-ink">{booking.paymentMethod}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Paid on</dt>
                      <dd className="font-medium text-ink">{formatDate(booking.paymentDate)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Booked on</dt>
                      <dd className="font-medium text-ink">{formatDate(booking.bookingDate)}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="section-label mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Reservation
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">ID</dt>
                      <dd className="font-medium font-mono text-ink">{booking.reservationId}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Status</dt>
                      <dd>
                        <span className={getStatusChipClass(booking.status)}>
                          {booking.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="border-t border-sand-deep pt-6">
                <h4 className="section-label mb-4 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Documents
                </h4>
                <div className="flex flex-wrap gap-3">
                  {booking.receiptUrl && (
                    <button className="btn-secondary text-sm py-2 px-4">
                      <Download className="h-4 w-4" />
                      Receipt
                    </button>
                  )}
                  {booking.invoiceUrl && (
                    <button className="btn-secondary text-sm py-2 px-4">
                      <Download className="h-4 w-4" />
                      Invoice
                    </button>
                  )}
                  <button className="btn-secondary text-sm py-2 px-4">
                    <FileText className="h-4 w-4" />
                    Confirmation
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && filteredBookings.length === 0 && (
          <div className="panel text-center py-16">
            <Calendar className="h-10 w-10 text-ink-muted/50 mx-auto mb-4" />
            <h3 className="font-display text-2xl text-ink mb-2">No bookings found</h3>
            <p className="text-ink-muted mb-8 max-w-sm mx-auto">
              {searchTerm || activeFilter !== 'all'
                ? 'Try adjusting your search or filter.'
                : 'You have not made any reservations yet.'}
            </p>
            <Link to="/rooms" className="btn-primary">
              Browse rooms
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
