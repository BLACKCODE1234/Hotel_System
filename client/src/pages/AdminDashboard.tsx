import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Hotel, 
  Settings,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  User,
  Bell,
  LogOut,
  ChevronDown,
  Shield,
  Mail,
  Phone
} from 'lucide-react';

interface Booking {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in' | 'checked-out';
  paymentMethod: string;
  bookingDate: string;
}

interface Room {
  id: string;
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  price: number;
  floor: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showRoomStatusModal, setShowRoomStatusModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileDropdown) {
        const target = event.target as Element;
        if (!target.closest('.profile-dropdown-container')) {
          setShowProfileDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

  // Mock data
  useEffect(() => {
    const mockBookings: Booking[] = [
      {
        id: 'LGH-001',
        guestName: 'John Smith',
        email: 'john@example.com',
        phone: '+1234567890',
        roomType: 'Deluxe',
        checkIn: '2024-11-10',
        checkOut: '2024-11-13',
        guests: 2,
        totalAmount: 899,
        status: 'confirmed',
        paymentMethod: 'Credit Card',
        bookingDate: '2024-11-08'
      },
      {
        id: 'LGH-002',
        guestName: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1234567891',
        roomType: 'Executive',
        checkIn: '2024-11-12',
        checkOut: '2024-11-15',
        guests: 1,
        totalAmount: 1299,
        status: 'pending',
        paymentMethod: 'PayPal',
        bookingDate: '2024-11-08'
      }
    ];

    const mockRooms: Room[] = [
      { id: '101', number: '101', type: 'Standard', status: 'available', price: 149, floor: 1 },
      { id: '102', number: '102', type: 'Deluxe', status: 'occupied', price: 229, floor: 1 },
      { id: '201', number: '201', type: 'Executive', status: 'maintenance', price: 389, floor: 2 },
      { id: '301', number: '301', type: 'Presidential', status: 'available', price: 749, floor: 3 }
    ];

    setBookings(mockBookings);
    setRooms(mockRooms);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'checked-in': return 'bg-blue-100 text-blue-800';
      case 'checked-out': return 'bg-gray-100 text-gray-800';
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'cleaning': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowStatusModal(true);
  };

  const updateBookingStatus = (newStatus: Booking['status']) => {
    if (selectedBooking) {
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === selectedBooking.id
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      setShowStatusModal(false);
      setSelectedBooking(null);
      
      // Show success message
      alert(`Booking ${selectedBooking.id} status updated to ${newStatus}`);
    }
  };

  const getStatusOptions = (currentStatus: string) => {
    const allStatuses = ['pending', 'confirmed', 'cancelled', 'checked-in', 'checked-out'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  const handleRoomStatusChange = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomStatusModal(true);
  };

  const updateRoomStatus = (newStatus: Room['status']) => {
    if (selectedRoom) {
      setRooms(prevRooms =>
        prevRooms.map(room =>
          room.id === selectedRoom.id
            ? { ...room, status: newStatus }
            : room
        )
      );
      setShowRoomStatusModal(false);
      setSelectedRoom(null);
      
      // Show success message
      alert(`Room ${selectedRoom.number} status updated to ${newStatus}`);
    }
  };

  const getRoomStatusOptions = (currentStatus: string) => {
    const allRoomStatuses = ['available', 'occupied', 'maintenance', 'cleaning'];
    return allRoomStatuses.filter(status => status !== currentStatus);
  };

  // Chart data for different periods
  const getChartData = () => {
    const dailyData = [
      { room: 65, service: 20, total: 85, day: 'Mon', label: 'Mon' },
      { room: 78, service: 15, total: 93, day: 'Tue', label: 'Tue' },
      { room: 82, service: 18, total: 100, day: 'Wed', label: 'Wed' },
      { room: 95, service: 25, total: 120, day: 'Thu', label: 'Thu' },
      { room: 88, service: 22, total: 110, day: 'Fri', label: 'Fri' },
      { room: 92, service: 28, total: 120, day: 'Sat', label: 'Sat' },
      { room: 105, service: 35, total: 140, day: 'Sun', label: 'Sun' },
      { room: 98, service: 30, total: 128, day: 'Mon', label: 'Mon' },
      { room: 87, service: 20, total: 107, day: 'Tue', label: 'Tue' },
      { room: 93, service: 25, total: 118, day: 'Wed', label: 'Wed' },
      { room: 89, service: 22, total: 111, day: 'Thu', label: 'Thu' },
      { room: 96, service: 28, total: 124, day: 'Fri', label: 'Fri' },
      { room: 102, service: 32, total: 134, day: 'Sat', label: 'Sat' },
      { room: 88, service: 24, total: 112, day: 'Sun', label: 'Sun' }
    ];

    const weeklyData = [
      { room: 450, service: 120, total: 570, day: 'Week 1', label: 'W1' },
      { room: 520, service: 145, total: 665, day: 'Week 2', label: 'W2' },
      { room: 480, service: 135, total: 615, day: 'Week 3', label: 'W3' },
      { room: 590, service: 160, total: 750, day: 'Week 4', label: 'W4' },
      { room: 510, service: 140, total: 650, day: 'Week 5', label: 'W5' },
      { room: 470, service: 125, total: 595, day: 'Week 6', label: 'W6' },
      { room: 530, service: 150, total: 680, day: 'Week 7', label: 'W7' },
      { room: 495, service: 130, total: 625, day: 'Week 8', label: 'W8' },
      { room: 545, service: 155, total: 700, day: 'Week 9', label: 'W9' },
      { room: 485, service: 135, total: 620, day: 'Week 10', label: 'W10' },
      { room: 525, service: 145, total: 670, day: 'Week 11', label: 'W11' },
      { room: 505, service: 140, total: 645, day: 'Week 12', label: 'W12' }
    ];

    const monthlyData = [
      { room: 1850, service: 480, total: 2330, day: 'Jan', label: 'Jan' },
      { room: 1920, service: 510, total: 2430, day: 'Feb', label: 'Feb' },
      { room: 2100, service: 580, total: 2680, day: 'Mar', label: 'Mar' },
      { room: 2250, service: 620, total: 2870, day: 'Apr', label: 'Apr' },
      { room: 2180, service: 590, total: 2770, day: 'May', label: 'May' },
      { room: 2350, service: 650, total: 3000, day: 'Jun', label: 'Jun' },
      { room: 2420, service: 680, total: 3100, day: 'Jul', label: 'Jul' },
      { room: 2380, service: 670, total: 3050, day: 'Aug', label: 'Aug' },
      { room: 2200, service: 600, total: 2800, day: 'Sep', label: 'Sep' },
      { room: 2150, service: 580, total: 2730, day: 'Oct', label: 'Oct' },
      { room: 2050, service: 550, total: 2600, day: 'Nov', label: 'Nov' },
      { room: 2300, service: 630, total: 2930, day: 'Dec', label: 'Dec' }
    ];

    switch (chartPeriod) {
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return dailyData;
    }
  };

  const getChartScale = () => {
    switch (chartPeriod) {
      case 'weekly':
        return { max: 800, multiplier: 10 };
      case 'monthly':
        return { max: 3200, multiplier: 1 };
      default:
        return { max: 140, multiplier: 50 };
    }
  };

  const getYAxisLabels = () => {
    switch (chartPeriod) {
      case 'weekly':
        return ['$8k', '$6k', '$4k', '$2k', '$0'];
      case 'monthly':
        return ['$32k', '$24k', '$16k', '$8k', '$0'];
      default:
        return ['$8k', '$6k', '$4k', '$2k', '$0'];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Trade Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 sm:px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm gap-2 sm:gap-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="whitespace-nowrap">System Online</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">Revenue: $89,247</span>
              <span className="text-green-300 hidden sm:inline">+12%</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Hotel className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">Occupancy: 78%</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap hidden sm:inline">Active Guests: 156</span>
              <span className="whitespace-nowrap sm:hidden">Guests: 156</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Live Updates</span>
            </div>
            
            {/* Admin Avatar in Trade Bar */}
            <div className="relative profile-dropdown-container">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 hover:bg-white/10 rounded-lg p-1 transition-colors"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold border border-white/30">
                    A
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                    3
                  </div>
                </div>
                <ChevronDown className={`w-3 h-3 text-white/80 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                  {/* Admin Profile Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        A
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Admin User</h3>
                        <p className="text-sm text-gray-600">Hotel Administrator</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notification Center */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Notifications
                      </h4>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-blue-50 rounded-lg text-sm">
                        <p className="font-medium text-blue-900">New booking received</p>
                        <p className="text-blue-700">Room 205 - John Smith</p>
                      </div>
                      <div className="p-2 bg-yellow-50 rounded-lg text-sm">
                        <p className="font-medium text-yellow-900">Maintenance required</p>
                        <p className="text-yellow-700">Room 301 - AC unit</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded-lg text-sm">
                        <p className="font-medium text-green-900">Payment confirmed</p>
                        <p className="text-green-700">Booking #LGH-002</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="p-2">
                    <Link to="/admin/profile" className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <User className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Admin Preferences</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <Shield className="w-4 h-4" />
                      <span>Security Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <Bell className="w-4 h-4" />
                      <span>Notification Center</span>
                    </button>
                  </div>

                  {/* Contact Info */}
                  <div className="p-4 border-t border-gray-100">
                    <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span>admin@luxurygrandhotel.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="p-2 border-t border-gray-100">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Luxury Grand Hotel Management</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="whitespace-nowrap">All Systems Operational</span>
              </div>
              <button className="bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center">
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Export Data</span>
                <span className="xs:hidden">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap gap-2 sm:gap-0 sm:space-x-4 lg:space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'bookings', label: 'Bookings', icon: Calendar },
                { id: 'rooms', label: 'Rooms', icon: Hotel },
                { id: 'guests', label: 'Guests', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: PieChart },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline sm:hidden lg:inline">{tab.label}</span>
                  <span className="xs:hidden sm:inline lg:hidden">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">247</p>
                    <p className="text-xs sm:text-sm text-green-600">+12% from last month</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenue</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">$89,247</p>
                    <p className="text-xs sm:text-sm text-green-600">+8% from last month</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Occupancy Rate</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">78%</p>
                    <p className="text-xs sm:text-sm text-red-600">-3% from last month</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Hotel className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Active Guests</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">156</p>
                    <p className="text-xs sm:text-sm text-green-600">+5% from last month</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Activity</h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { action: 'New booking received', guest: 'John Smith', time: '2 minutes ago', type: 'booking' },
                  { action: 'Payment confirmed', guest: 'Sarah Johnson', time: '15 minutes ago', type: 'payment' },
                  { action: 'Guest checked in', guest: 'Mike Wilson', time: '1 hour ago', type: 'checkin' },
                  { action: 'Room maintenance completed', guest: 'Room 301', time: '2 hours ago', type: 'maintenance' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                      <p className="text-xs text-gray-600 truncate">{activity.guest} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="checked-in">Checked In</option>
                    <option value="checked-out">Checked Out</option>
                  </select>
                  <button className="bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm sm:text-base justify-center">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">New Booking</span>
                    <span className="xs:hidden">New</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Room</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Dates</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{booking.id}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900">{booking.guestName}</div>
                            <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">{booking.email}</div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">{booking.roomType}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                          <div className="text-xs">
                            <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
                            <div>{new Date(booking.checkOut).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">${booking.totalAmount}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleStatusChange(booking)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full hover:opacity-80 transition-opacity ${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </button>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-1 sm:gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Room Management</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Room
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rooms.map((room) => (
                  <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">Room {room.number}</h4>
                        <p className="text-sm text-gray-600">{room.type}</p>
                        <p className="text-sm text-gray-600">Floor {room.floor}</p>
                      </div>
                      <button
                        onClick={() => handleRoomStatusChange(room)}
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full hover:opacity-80 transition-opacity ${getStatusColor(room.status)}`}
                      >
                        {room.status}
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">${room.price}/night</span>
                      <div className="flex gap-1">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Guest Management Tab */}
        {activeTab === 'guests' && (
          <div className="space-y-6">
            {/* Guest Management Header */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Guest Management</h3>
                  <p className="text-gray-600">Manage guest profiles, preferences, and history</p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Guest
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Guests
                  </button>
                </div>
              </div>
            </div>

            {/* Guest Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Guests</p>
                    <p className="text-3xl font-bold text-gray-900">1,247</p>
                    <p className="text-sm text-green-600">+23 this month</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">VIP Guests</p>
                    <p className="text-3xl font-bold text-gray-900">89</p>
                    <p className="text-sm text-purple-600">Premium members</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Repeat Guests</p>
                    <p className="text-3xl font-bold text-gray-900">456</p>
                    <p className="text-sm text-green-600">37% return rate</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Rating</p>
                    <p className="text-3xl font-bold text-gray-900">4.8</p>
                    <p className="text-sm text-yellow-600">Guest satisfaction</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search guests by name, email, or phone..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>All Guests</option>
                    <option>VIP Guests</option>
                    <option>Regular Guests</option>
                    <option>New Guests</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Checked In</option>
                    <option>Checked Out</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Guest List */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      {
                        id: 'G001',
                        name: 'John Smith',
                        email: 'john.smith@email.com',
                        phone: '+1 (555) 123-4567',
                        status: 'checked-in',
                        type: 'VIP',
                        bookings: 12,
                        totalSpent: 15420,
                        lastVisit: '2024-11-08',
                        avatar: 'JS'
                      },
                      {
                        id: 'G002',
                        name: 'Sarah Johnson',
                        email: 'sarah.j@email.com',
                        phone: '+1 (555) 234-5678',
                        status: 'active',
                        type: 'Regular',
                        bookings: 3,
                        totalSpent: 2890,
                        lastVisit: '2024-10-15',
                        avatar: 'SJ'
                      },
                      {
                        id: 'G003',
                        name: 'Michael Brown',
                        email: 'mike.brown@email.com',
                        phone: '+1 (555) 345-6789',
                        status: 'checked-out',
                        type: 'VIP',
                        bookings: 8,
                        totalSpent: 9650,
                        lastVisit: '2024-11-05',
                        avatar: 'MB'
                      },
                      {
                        id: 'G004',
                        name: 'Emily Davis',
                        email: 'emily.davis@email.com',
                        phone: '+1 (555) 456-7890',
                        status: 'active',
                        type: 'Regular',
                        bookings: 1,
                        totalSpent: 450,
                        lastVisit: '2024-09-20',
                        avatar: 'ED'
                      },
                      {
                        id: 'G005',
                        name: 'Robert Wilson',
                        email: 'robert.w@email.com',
                        phone: '+1 (555) 567-8901',
                        status: 'checked-in',
                        type: 'VIP',
                        bookings: 15,
                        totalSpent: 22100,
                        lastVisit: '2024-11-07',
                        avatar: 'RW'
                      }
                    ].map((guest) => (
                      <tr key={guest.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {guest.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                                {guest.type === 'VIP' && (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                    VIP
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">ID: {guest.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{guest.email}</div>
                          <div className="text-sm text-gray-500">{guest.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(guest.status)}`}>
                            {guest.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {guest.bookings} bookings
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${guest.totalSpent.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(guest.lastVisit).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-purple-600 hover:text-purple-800">
                              <Mail className="w-4 h-4" />
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-800">
                              <Phone className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Guest Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Guest Preferences */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Popular Preferences</h4>
                <div className="space-y-4">
                  {[
                    { preference: 'Sea View Rooms', percentage: 68, count: 847 },
                    { preference: 'Late Checkout', percentage: 45, count: 561 },
                    { preference: 'Airport Transfer', percentage: 38, count: 474 },
                    { preference: 'Spa Services', percentage: 32, count: 399 },
                    { preference: 'Room Service', percentage: 28, count: 349 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{item.preference}</span>
                        <span className="text-sm text-gray-600">{item.count} guests</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-500">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Guest Activity */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                <div className="space-y-4">
                  {[
                    { guest: 'John Smith', action: 'Checked in', room: 'Room 205', time: '2 hours ago', type: 'checkin' },
                    { guest: 'Sarah Johnson', action: 'Made reservation', room: 'Room 301', time: '4 hours ago', type: 'booking' },
                    { guest: 'Michael Brown', action: 'Checked out', room: 'Room 150', time: '6 hours ago', type: 'checkout' },
                    { guest: 'Emily Davis', action: 'Updated profile', room: '', time: '8 hours ago', type: 'profile' },
                    { guest: 'Robert Wilson', action: 'Requested service', room: 'Room 405', time: '12 hours ago', type: 'service' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'checkin' ? 'bg-green-100 text-green-600' :
                        activity.type === 'checkout' ? 'bg-red-100 text-red-600' :
                        activity.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'profile' ? 'bg-purple-100 text-purple-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.guest}</p>
                        <p className="text-xs text-gray-600">{activity.action} {activity.room}</p>
                      </div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Analytics Header */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Analytics & Reports</h3>
                  <p className="text-gray-600">Comprehensive insights and performance metrics</p>
                </div>
                <div className="flex gap-3">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last year</option>
                  </select>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Daily Rate</p>
                    <p className="text-3xl font-bold text-gray-900">$287</p>
                    <p className="text-sm text-green-600">+15% vs last month</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue per Room</p>
                    <p className="text-3xl font-bold text-gray-900">$224</p>
                    <p className="text-sm text-green-600">+8% vs last month</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Guest Satisfaction</p>
                    <p className="text-3xl font-bold text-gray-900">4.8/5</p>
                    <p className="text-sm text-green-600">+0.2 vs last month</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Repeat Guests</p>
                    <p className="text-3xl font-bold text-gray-900">34%</p>
                    <p className="text-sm text-red-600">-2% vs last month</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Bar Chart */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Revenue Analytics</h4>
                    <p className="text-sm text-gray-600">Daily revenue breakdown with trends</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setChartPeriod('daily')}
                      className={`text-sm px-3 py-1 rounded-lg font-medium transition-colors ${
                        chartPeriod === 'daily' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Daily
                    </button>
                    <button 
                      onClick={() => setChartPeriod('weekly')}
                      className={`text-sm px-3 py-1 rounded-lg font-medium transition-colors ${
                        chartPeriod === 'weekly' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Weekly
                    </button>
                    <button 
                      onClick={() => setChartPeriod('monthly')}
                      className={`text-sm px-3 py-1 rounded-lg font-medium transition-colors ${
                        chartPeriod === 'monthly' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
                
                {/* Chart Legend */}
                <div className="flex items-center gap-6 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-t from-blue-600 to-blue-400 rounded"></div>
                    <span className="text-gray-600">Room Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-t from-green-600 to-green-400 rounded"></div>
                    <span className="text-gray-600">Service Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-t from-purple-600 to-purple-400 rounded"></div>
                    <span className="text-gray-600">Total Revenue</span>
                  </div>
                </div>

                {/* Enhanced Bar Chart */}
                <div className="relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-500 -ml-8">
                    {getYAxisLabels().map((label, index) => (
                      <span key={index}>{label}</span>
                    ))}
                  </div>
                  
                  {/* Grid lines */}
                  <div className="absolute inset-0 h-64">
                    {[0, 25, 50, 75, 100].map((position) => (
                      <div 
                        key={position}
                        className="absolute w-full border-t border-gray-100"
                        style={{ top: `${100 - position}%` }}
                      ></div>
                    ))}
                  </div>

                  {/* Bar Chart */}
                  <div className="h-64 flex items-end justify-between gap-1 relative z-10">
                    {getChartData().map((data, index) => {
                      const scale = getChartScale();
                      return (
                      <div key={index} className="flex-1 flex flex-col items-center group relative">
                        {/* Stacked Bars */}
                        <div className="w-full flex flex-col items-end relative">
                          {/* Room Revenue Bar */}
                          <div 
                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-300 hover:from-blue-700 hover:to-blue-500 relative"
                            style={{ height: `${(data.room / scale.max) * 240}px` }}
                          ></div>
                          {/* Service Revenue Bar */}
                          <div 
                            className="w-full bg-gradient-to-t from-green-600 to-green-400 transition-all duration-300 hover:from-green-700 hover:to-green-500"
                            style={{ height: `${(data.service / scale.max) * 240}px` }}
                          ></div>
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                          <div className="text-center">
                            <div className="font-semibold">{data.day}</div>
                            <div className="text-blue-300">Room: ${(data.room * scale.multiplier).toLocaleString()}</div>
                            <div className="text-green-300">Service: ${(data.service * scale.multiplier).toLocaleString()}</div>
                            <div className="text-purple-300 font-semibold">Total: ${(data.total * scale.multiplier).toLocaleString()}</div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>

                        {/* Peak Indicator */}
                        {data.total >= (scale.max * 0.9) && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                      );
                    })}
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between text-xs text-gray-500 mt-4 px-1">
                  {getChartData().map((data, index) => (
                    <span key={index} className="text-center">{data.label}</span>
                  ))}
                </div>

                {/* Chart Summary */}
                <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">$89,247</div>
                    <div className="text-xs text-gray-600">Room Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">$23,156</div>
                    <div className="text-xs text-gray-600">Service Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">$112,403</div>
                    <div className="text-xs text-gray-600">Total Revenue</div>
                  </div>
                </div>
              </div>

              {/* Occupancy Chart */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Room Occupancy</h4>
                <div className="relative h-64">
                  {/* Pie Chart Simulation */}
                  <div className="w-48 h-48 mx-auto relative">
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-green-400 via-blue-400 via-yellow-400 to-red-400 relative">
                      <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">78%</div>
                          <div className="text-sm text-gray-600">Occupied</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span>Available (22%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span>Occupied (78%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span>Cleaning (8%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span>Maintenance (2%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Performing Rooms */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Rooms</h4>
                <div className="space-y-4">
                  {[
                    { room: '301', type: 'Presidential', revenue: '$12,450', occupancy: '95%' },
                    { room: '201', type: 'Executive', revenue: '$8,920', occupancy: '89%' },
                    { room: '102', type: 'Deluxe', revenue: '$6,780', occupancy: '85%' },
                    { room: '205', type: 'Executive', revenue: '$6,340', occupancy: '82%' },
                    { room: '101', type: 'Standard', revenue: '$4,560', occupancy: '78%' }
                  ].map((room, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Room {room.room}</p>
                          <p className="text-sm text-gray-600">{room.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{room.revenue}</p>
                        <p className="text-sm text-green-600">{room.occupancy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings Analytics */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Booking Sources</h4>
                <div className="space-y-4">
                  {[
                    { source: 'Direct Website', bookings: 145, percentage: 45, color: 'bg-blue-500' },
                    { source: 'Booking.com', bookings: 89, percentage: 28, color: 'bg-green-500' },
                    { source: 'Expedia', bookings: 52, percentage: 16, color: 'bg-yellow-500' },
                    { source: 'Walk-in', bookings: 35, percentage: 11, color: 'bg-purple-500' }
                  ].map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{source.source}</span>
                        <span className="text-sm text-gray-600">{source.bookings} bookings</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${source.color}`}
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-500">{source.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Financial Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">$89,247</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <div className="text-xs text-green-600 mt-1">+12% from last month</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">$23,456</div>
                  <div className="text-sm text-gray-600">Operating Costs</div>
                  <div className="text-xs text-blue-600 mt-1">-3% from last month</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">$65,791</div>
                  <div className="text-sm text-gray-600">Net Profit</div>
                  <div className="text-xs text-purple-600 mt-1">+18% from last month</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Settings Header */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">System Settings</h3>
                  <p className="text-gray-600">Configure hotel management system preferences</p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Config
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hotel Information */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Hotel className="w-5 h-5" />
                  Hotel Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
                    <input
                      type="text"
                      defaultValue="Luxury Grand Hotel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      defaultValue="123 Ocean Drive, Miami Beach, FL 33139"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="info@luxurygrandhotel.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Settings */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Booking Settings
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>2:00 PM</option>
                      <option>3:00 PM</option>
                      <option>4:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>11:00 AM</option>
                      <option>12:00 PM</option>
                      <option>1:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Advance Booking Days</label>
                    <input
                      type="number"
                      defaultValue="365"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <label className="text-sm text-gray-700">Allow same-day bookings</label>
                  </div>
                </div>
              </div>

              {/* Payment Settings */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment Settings
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      defaultValue="12"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Fee ($)</label>
                    <input
                      type="number"
                      defaultValue="25"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Accepted Payment Methods</label>
                    <div className="space-y-2">
                      {['Credit Card', 'PayPal', 'Mobile Money', 'Cash at Front Desk'].map((method) => (
                        <div key={method} className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <label className="text-sm text-gray-700">{method}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </h4>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
                    {[
                      'New bookings',
                      'Cancellations',
                      'Payment confirmations',
                      'Guest check-ins',
                      'Maintenance requests'
                    ].map((notification) => (
                      <div key={notification} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <label className="text-sm text-gray-700">{notification}</label>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                    <input
                      type="email"
                      defaultValue="admin@luxurygrandhotel.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>30</option>
                      <option>60</option>
                      <option>120</option>
                      <option>240</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Security Features</label>
                    {[
                      'Two-factor authentication',
                      'Login attempt logging',
                      'IP address restrictions',
                      'Password complexity requirements'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <label className="text-sm text-gray-700">{feature}</label>
                      </div>
                    ))}
                  </div>
                  <div>
                    <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Reset Admin Password
                    </button>
                  </div>
                </div>
              </div>

              {/* System Preferences */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Preferences
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC-6 (Central Time)</option>
                      <option>UTC-7 (Mountain Time)</option>
                      <option>UTC-8 (Pacific Time)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm text-gray-700">Enable dark mode</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm text-gray-700">Show system notifications</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <label className="text-sm text-gray-700">Enable maintenance mode</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                System Status & Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <div className="text-sm text-gray-600">System Uptime</div>
                  <div className="text-xs text-green-600 mt-1">Last 30 days</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">v2.1.4</div>
                  <div className="text-sm text-gray-600">Current Version</div>
                  <div className="text-xs text-blue-600 mt-1">Latest available</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">2.4GB</div>
                  <div className="text-sm text-gray-600">Database Size</div>
                  <div className="text-xs text-purple-600 mt-1">15% of limit</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Backup Database
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4" />
                  Check for Updates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Change Modal */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Change Booking Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">Booking ID</p>
                <p className="font-semibold text-gray-900">{selectedBooking.id}</p>
                <p className="text-sm text-gray-600 mt-2">Guest</p>
                <p className="font-semibold text-gray-900">{selectedBooking.guestName}</p>
                <p className="text-sm text-gray-600 mt-2">Current Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Select New Status:</p>
                <div className="space-y-2">
                  {getStatusOptions(selectedBooking.status).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateBookingStatus(status as Booking['status'])}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 hover:border-blue-500 transition-colors ${getStatusColor(status)} border-transparent`}
                    >
                      <span className="font-medium capitalize">{status}</span>
                      <p className="text-xs mt-1 opacity-75">
                        {status === 'pending' && 'Awaiting confirmation'}
                        {status === 'confirmed' && 'Booking confirmed'}
                        {status === 'cancelled' && 'Booking cancelled'}
                        {status === 'checked-in' && 'Guest has checked in'}
                        {status === 'checked-out' && 'Guest has checked out'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Status Change Modal */}
      {showRoomStatusModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Change Room Status</h3>
              <button
                onClick={() => setShowRoomStatusModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">Room Number</p>
                <p className="font-semibold text-gray-900">Room {selectedRoom.number}</p>
                <p className="text-sm text-gray-600 mt-2">Room Type</p>
                <p className="font-semibold text-gray-900">{selectedRoom.type}</p>
                <p className="text-sm text-gray-600 mt-2">Floor</p>
                <p className="font-semibold text-gray-900">Floor {selectedRoom.floor}</p>
                <p className="text-sm text-gray-600 mt-2">Price</p>
                <p className="font-semibold text-gray-900">${selectedRoom.price}/night</p>
                <p className="text-sm text-gray-600 mt-2">Current Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRoom.status)}`}>
                  {selectedRoom.status}
                </span>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Select New Status:</p>
                <div className="space-y-2">
                  {getRoomStatusOptions(selectedRoom.status).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateRoomStatus(status as Room['status'])}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 hover:border-blue-500 transition-colors ${getStatusColor(status)} border-transparent`}
                    >
                      <span className="font-medium capitalize">{status}</span>
                      <p className="text-xs mt-1 opacity-75">
                        {status === 'available' && 'Room is ready for new guests'}
                        {status === 'occupied' && 'Room is currently occupied'}
                        {status === 'maintenance' && 'Room needs maintenance or repairs'}
                        {status === 'cleaning' && 'Room is being cleaned'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRoomStatusModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
