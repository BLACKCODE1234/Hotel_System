import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Calendar,
  Star,
  Hotel,
  MessageCircle,
  Crown,
} from 'lucide-react';

interface Booking {
  id: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalAmount: number;
  image: string;
}

const UserDashboard: React.FC = () => {
  const { user: authUser } = useAuth();
  const [user] = useState({
    name: authUser ? `${authUser.first_name} ${authUser.last_name}`.trim() || authUser.email : 'Guest',
    email: authUser?.email || 'guest@example.com',
    phone: authUser?.phone || '+1 (555) 000-0000',
    memberSince: '2024',
    totalBookings: 0,
    loyaltyPoints: 0,
    membershipTier: 'Silver',
    preferences: {
      roomType: 'Suite',
      bedType: 'King',
      smokingPreference: 'Non-smoking'
    }
  });

  const [profileData, setProfileData] = useState({
    name: authUser ? `${authUser.first_name} ${authUser.last_name}`.trim() || authUser.email : '',
    email: authUser?.email || '',
    phone: authUser?.phone || '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    profilePicture: null as File | null
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.getBookingHistory();
        if (response.ok) {
          const data = await response.json();
          const mapped = (data.bookings || []).map((b: any) => ({
            id: b.id || b.booking_id || '',
            hotelName: 'LuxuryStay Grand Hotel',
            roomType: b.room_type || 'Standard',
            checkIn: b.check_in || b.checkIn || '',
            checkOut: b.check_out || b.checkOut || '',
            guests: b.guests || b.adults || 1,
            status: b.status || 'confirmed',
            totalAmount: b.total_amount || b.totalAmount || 0,
            image: '/userdashboard.jpg',
          }));
          setBookings(mapped);
        }
      } catch {
        // fallback to empty
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen py-8 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="section-label mb-2">Guest account</p>
          <h1 className="page-title mb-3">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-ink-muted text-lg max-w-xl">
            Manage your bookings, profile, and rewards in one place.
          </p>
        </header>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="panel text-center">
            <Hotel className="w-5 h-5 text-brass mx-auto mb-3" />
            <p className="font-display text-3xl text-ink mb-1">{bookings.length || user.totalBookings}</p>
            <p className="text-sm text-ink-muted">Total bookings</p>
          </div>
          <div className="panel text-center">
            <Star className="w-5 h-5 text-brass mx-auto mb-3" />
            <p className="font-display text-3xl text-ink mb-1">{user.loyaltyPoints.toLocaleString()}</p>
            <p className="text-sm text-ink-muted">Loyalty points</p>
          </div>
          <div className="panel text-center">
            <Crown className="w-5 h-5 text-brass mx-auto mb-3" />
            <p className="font-display text-3xl text-ink mb-1">{user.membershipTier}</p>
            <p className="text-sm text-ink-muted">Member since {user.memberSince}</p>
          </div>
        </div>

        <div className="panel mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="section-label mb-2">Plan your next visit</p>
            <h2 className="font-display text-2xl text-ink mb-2">Book your next stay</h2>
            <p className="text-ink-muted max-w-md">
              Browse available rooms and suites with clear rates and instant confirmation.
            </p>
          </div>
          <Link to="/rooms" className="btn-primary whitespace-nowrap">
            Browse rooms
          </Link>
        </div>

        <div>
          <p className="section-label mb-4">Quick links</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { to: '/history', icon: Calendar, label: 'History', desc: 'View past and upcoming stays' },
              { to: '/profile', icon: User, label: 'Profile', desc: 'Update your details' },
              { to: '/support', icon: MessageCircle, label: 'Support', desc: 'Get help with a booking' },
              { to: '/rewards', icon: Star, label: 'Rewards', desc: 'Points and member benefits' },
            ].map(({ to, icon: Icon, label, desc }) => (
              <Link
                key={to}
                to={to}
                className="panel hover:border-brass/40 transition-colors group"
              >
                <Icon className="w-5 h-5 text-brass mb-3" />
                <h3 className="font-semibold text-ink mb-1">{label}</h3>
                <p className="text-sm text-ink-muted">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
