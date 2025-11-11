import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  CreditCard, 
  Settings, 
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Hotel,
  Users,
  Receipt,
  MessageCircle,
  LogOut,
  Phone,
  Mail,
  Download,
  Award,
  HeadphonesIcon,
  MapPin,
  Lock,
  Camera,
  Upload,
  Save,
  Facebook,
  Chrome,
  Gift,
  Crown,
  Trophy,
  Zap,
  Sparkles,
  TrendingUp,
  Target,
  Wifi,
  Car,
  Utensils,
  Shield,
  Heart,
  Plane,
  Coffee
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

interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  date: string;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  receiptUrl?: string;
}


const UserDashboard: React.FC = () => {
  const location = useLocation();
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    memberSince: '2023',
    totalBookings: 12,
    loyaltyPoints: 2450,
    membershipTier: 'Gold',
    preferences: {
      roomType: 'Suite',
      bedType: 'King',
      smokingPreference: 'Non-smoking'
    }
  });

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    profilePicture: null as File | null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      hotelName: 'LuxuryStay Grand Hotel',
      roomType: 'Deluxe Suite',
      checkIn: '2024-12-15',
      checkOut: '2024-12-18',
      guests: 2,
      status: 'confirmed',
      totalAmount: 899,
      image: '/homepage.jpg'
    },
    {
      id: '2',
      hotelName: 'Ocean View Resort',
      roomType: 'Premium Room',
      checkIn: '2024-11-20',
      checkOut: '2024-11-23',
      guests: 1,
      status: 'pending',
      totalAmount: 650,
      image: '/homepage.jpg'
    },
    {
      id: '3',
      hotelName: 'Mountain Retreat',
      roomType: 'Standard Room',
      checkIn: '2024-10-10',
      checkOut: '2024-10-12',
      guests: 3,
      status: 'cancelled',
      totalAmount: 450,
      image: '/homepage.jpg'
    }
  ]);

  const [payments] = useState<Payment[]>([
    {
      id: 'PAY001',
      bookingId: '1',
      amount: 899,
      date: '2024-11-01',
      method: 'Credit Card (**** 4567)',
      status: 'completed',
      receiptUrl: '/receipt-001.pdf'
    },
    {
      id: 'PAY002',
      bookingId: '2',
      amount: 650,
      date: '2024-10-15',
      method: 'PayPal',
      status: 'completed',
      receiptUrl: '/receipt-002.pdf'
    },
    {
      id: 'PAY003',
      bookingId: '3',
      amount: 450,
      date: '2024-09-20',
      method: 'Credit Card (**** 8901)',
      status: 'failed'
    }
  ]);


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-emerald-900/20"></div>
      
      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-emerald-600/10 rounded-full blur-3xl animate-bounce-slow"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
            Welcome back, {user.name}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Manage your bookings, track rewards, and explore premium services
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{user.totalBookings}</h3>
            <p className="text-white/80">Total Bookings</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{user.loyaltyPoints.toLocaleString()}</h3>
            <p className="text-white/80">Loyalty Points</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{user.membershipTier}</h3>
            <p className="text-white/80">Member Since {user.memberSince}</p>
          </div>
        </div>

        {/* Main Action */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <Link 
              to="/rooms"
              className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
                  <Hotel className="h-10 w-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">
                  Book Your Next Stay
                </h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Browse our premium rooms and suites with instant confirmation
                </p>
                <div className="flex items-center justify-center text-sm text-blue-300 font-medium">
                  <span>Explore Rooms</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/history"
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 text-center group"
          >
            <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-semibold mb-1">History</h4>
            <p className="text-white/60 text-sm">View bookings</p>
          </Link>
          
          <Link 
            to="/profile"
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 text-center group"
          >
            <User className="w-8 h-8 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-semibold mb-1">Profile</h4>
            <p className="text-white/60 text-sm">Edit details</p>
          </Link>
          
          <Link 
            to="/support"
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 text-center group"
          >
            <MessageCircle className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-semibold mb-1">Support</h4>
            <p className="text-white/60 text-sm">Get help</p>
          </Link>
          
          <Link 
            to="/rewards"
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 text-center group"
          >
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-semibold mb-1">Rewards</h4>
            <p className="text-white/60 text-sm">Earn points</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
