import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
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
  Phone,
  Crown
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
  total_amount: number;
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

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  occupiedRooms: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    occupiedRooms: 0,
  });
  const [dataError, setDataError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showRoomStatusModal, setShowRoomStatusModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setDataError('');
    try {
      const [statsResponse, bookingsResponse, roomsResponse] = await Promise.all([
        api.getAdminDashboardStats(),
        api.getAdminBookings(),
        api.getAdminRooms(),
      ]);

      if (!statsResponse.ok || !bookingsResponse.ok || !roomsResponse.ok) {
        throw new Error('Failed to load dashboard data');
      }

      const [statsData, bookingsData, roomsData] = await Promise.all([
        statsResponse.json(),
        bookingsResponse.json(),
        roomsResponse.json(),
      ]);

      setStats({
        totalBookings: Number(statsData.totalBookings || 0),
        totalRevenue: Number(statsData.totalRevenue || 0),
        occupancyRate: Number(statsData.occupancyRate || 0),
        occupiedRooms: Number(statsData.occupiedRooms || 0),
      });
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setRooms(
        Array.isArray(roomsData)
          ? roomsData.map((room: any) => ({
              id: String(room.id),
              number: room.room_number || String(room.id),
              type: room.type || room.name || 'Room',
              status: room.status || 'available',
              price: Number(room.price || 0),
              floor: Number(room.floor || 1),
            }))
          : [],
      );
    } catch (error) {
      setDataError('Unable to load live admin data. Please check the backend connection.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'status-chip status-chip--ok';
      case 'pending': return 'status-chip status-chip--warn';
      case 'cancelled': return 'status-chip status-chip--danger';
      case 'checked-in': return 'status-chip status-chip--neutral';
      case 'checked-out': return 'status-chip status-chip--neutral';
      case 'available': return 'status-chip status-chip--ok';
      case 'occupied': return 'status-chip status-chip--danger';
      case 'maintenance': return 'status-chip status-chip--warn';
      case 'cleaning': return 'status-chip status-chip--neutral';
      default: return 'status-chip status-chip--neutral';
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

  const updateBookingStatus = async (newStatus: Booking['status']) => {
    if (selectedBooking) {
      const response = await api.updateBookingStatus(selectedBooking.id, newStatus);
      if (response.ok) {
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking.id === selectedBooking.id
              ? { ...booking, status: newStatus }
              : booking
          )
        );
        setShowStatusModal(false);
        setSelectedBooking(null);
      } else {
        alert('Failed to update booking status');
      }
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

  const updateRoomStatus = async (newStatus: Room['status']) => {
    if (selectedRoom) {
      const response = await api.updateRoomStatus(Number(selectedRoom.id), newStatus);
      if (response.ok) {
        setRooms(prevRooms =>
          prevRooms.map(room =>
            room.id === selectedRoom.id
              ? { ...room, status: newStatus }
              : room
          )
        );
        setShowRoomStatusModal(false);
        setSelectedRoom(null);
      } else {
        alert('Failed to update room status');
      }
    }
  };

  const getRoomStatusOptions = (currentStatus: string) => {
    const allRoomStatuses = ['available', 'occupied', 'maintenance', 'cleaning'];
    return allRoomStatuses.filter(status => status !== currentStatus);
  };

  
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
    <div className="ops-shell">
      <header className="ops-topbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <p className="section-label text-brass/90">Operations</p>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">Admin Dashboard</h1>
              <p className="text-sm text-white/70 mt-1">LuxuryStay property management</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/75">
              <span className="hidden md:inline">Revenue ${stats.totalRevenue.toLocaleString()}</span>
              <span className="hidden md:inline">Occupancy {stats.occupancyRate}%</span>
              <span className="hidden lg:inline">{new Date().toLocaleDateString()}</span>
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="relative profile-dropdown-container">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 hover:bg-white/10 rounded-sm p-1 transition-colors"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-white/15 flex items-center justify-center text-white font-semibold border border-white/25 rounded-sm">
                    A
                  </div>
                  <span className="absolute -top-1 -right-1 status-chip status-chip--danger text-[10px] px-1 min-w-[1rem] justify-center">3</span>
                </div>
                <ChevronDown className={`w-3 h-3 text-white/80 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-sand-deep z-50 rounded-sm">
                  {/* Admin Profile Header */}
                  <div className="p-4 border-b border-sand-deep">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-brass flex items-center justify-center text-white font-semibold text-lg rounded-sm">
                        A
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink">Admin User</h3>
                        <p className="text-sm text-ink-muted">Hotel Administrator</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-forest rounded-full"></div>
                          <span className="text-xs text-forest">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notification Center */}
                  <div className="p-4 border-b border-sand-deep">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-ink flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Notifications
                      </h4>
                      <span className="status-chip status-chip--danger">3</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-sand-warm rounded-sm text-sm border border-sand-deep">
                        <p className="font-medium text-ink">New booking received</p>
                        <p className="text-ink-muted">Room 205 — John Smith</p>
                      </div>
                      <div className="p-2 bg-sand-warm rounded-sm text-sm border border-sand-deep">
                        <p className="font-medium text-ink">Maintenance required</p>
                        <p className="text-ink-muted">Room 301 — AC unit</p>
                      </div>
                      <div className="p-2 bg-accent-50 rounded-sm text-sm border border-accent-100">
                        <p className="font-medium text-ink">Payment confirmed</p>
                        <p className="text-ink-muted">Booking #LGH-002</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="p-2">
                    <Link to="/admin/profile" className="w-full flex items-center gap-3 px-3 py-2 text-ink-soft hover:bg-sand-warm rounded-sm transition-colors">
                      <User className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-ink-soft hover:bg-sand-warm rounded-sm transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Admin Preferences</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-ink-soft hover:bg-sand-warm rounded-sm transition-colors">
                      <Shield className="w-4 h-4" />
                      <span>Security Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-ink-soft hover:bg-sand-warm rounded-sm transition-colors">
                      <Bell className="w-4 h-4" />
                      <span>Notification Center</span>
                    </button>
                  </div>

                  {/* Contact Info */}
                  <div className="p-4 border-t border-sand-deep">
                    <h5 className="font-medium text-ink mb-2">Contact Information</h5>
                    <div className="space-y-1 text-sm text-ink-muted">
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
                  <div className="p-2 border-t border-sand-deep">
                    <button
                      onClick={async () => {
                        await api.logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-brass-deep hover:bg-red-50 rounded-sm transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 pt-4 border-t border-white/10">
            <span className="status-chip status-chip--ok bg-accent-50/10 text-white border-accent-100/30">All systems operational</span>
            <button type="button" className="btn-primary text-sm py-2 px-4 flex items-center gap-2 w-full sm:w-auto justify-center">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dataError && (
          <div className="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {dataError}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-sand-deep">
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
                      ? 'border-brass text-brass'
                      : 'border-transparent text-ink-muted hover:text-ink-soft hover:border-sand-deep'
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
              <div className="panel p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-ink-muted">Total Bookings</p>
                    <p className="text-2xl sm:text-3xl font-bold text-ink">{stats.totalBookings}</p>
                    <p className="text-xs sm:text-sm text-forest">Live backend count</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-brass" />
                  </div>
                </div>
              </div>

              <div className="panel p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-ink-muted">Revenue</p>
                    <p className="text-2xl sm:text-3xl font-bold text-ink">${stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs sm:text-sm text-forest">From completed payments</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-50 border border-accent-100 rounded-sm flex items-center justify-center">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-forest" />
                  </div>
                </div>
              </div>

              <div className="panel p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-ink-muted">Occupancy Rate</p>
                    <p className="text-2xl sm:text-3xl font-bold text-ink">{stats.occupancyRate}%</p>
                    <p className="text-xs sm:text-sm text-ink-muted">Based on room status</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <Hotel className="w-5 h-5 sm:w-6 sm:h-6 text-brass" />
                  </div>
                </div>
              </div>

              <div className="panel p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-ink-muted">Occupied Rooms</p>
                    <p className="text-2xl sm:text-3xl font-bold text-ink">{stats.occupiedRooms}</p>
                    <p className="text-xs sm:text-sm text-forest">Live room state</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-brass" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="panel p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-ink mb-3 sm:mb-4">Recent Activity</h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { action: 'New booking received', guest: 'John Smith', time: '2 minutes ago', type: 'booking' },
                  { action: 'Payment confirmed', guest: 'Sarah Johnson', time: '15 minutes ago', type: 'payment' },
                  { action: 'Guest checked in', guest: 'Mike Wilson', time: '1 hour ago', type: 'checkin' },
                  { action: 'Room maintenance completed', guest: 'Room 301', time: '2 hours ago', type: 'maintenance' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-sand-warm rounded-sm">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-sand border border-sand-deep rounded-sm flex items-center justify-center flex-shrink-0">
                      <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-brass" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-ink truncate">{activity.action}</p>
                      <p className="text-xs text-ink-muted truncate">{activity.guest} • {activity.time}</p>
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
            <div className="panel p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-muted w-3 h-3 sm:w-4 sm:h-4" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 sm:px-4 text-sm sm:text-base border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="checked-in">Checked In</option>
                    <option value="checked-out">Checked Out</option>
                  </select>
                  <button className="btn-primary text-sm py-2 px-3 sm:px-4 flex items-center gap-2 text-sm sm:text-base justify-center">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">New Booking</span>
                    <span className="xs:hidden">New</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="panel overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-sand-warm">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Booking ID</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Guest</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider hidden sm:table-cell">Room</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider hidden md:table-cell">Dates</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Amount</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Status</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-sand-deep">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-sand-warm">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-ink">{booking.id}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-ink">{booking.guestName}</div>
                            <div className="text-xs sm:text-sm text-ink-muted hidden sm:block">{booking.email}</div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-ink hidden sm:table-cell">{booking.roomType}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-ink hidden md:table-cell">
                          <div className="text-xs">
                            <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
                            <div>{new Date(booking.checkOut).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-ink">${booking.total_amount}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleStatusChange(booking)}
                            className={`${getStatusColor(booking.status)} hover:opacity-80 transition-opacity cursor-pointer`}
                          >
                            {booking.status}
                          </button>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-ink-muted">
                          <div className="flex gap-1 sm:gap-2">
                            <button className="text-brass hover:text-brass-deep">
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button className="text-forest hover:text-brass-deep">
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button className="text-ink-muted hover:text-brass-deep">
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
            <div className="panel p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-ink">Room Management</h3>
                <button className="btn-primary py-2 px-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Room
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rooms.map((room) => (
                  <div key={room.id} className="border border-sand-deep rounded-sm p-4 hover:border-brass/40 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-ink">Room {room.number}</h4>
                        <p className="text-sm text-ink-muted">{room.type}</p>
                        <p className="text-sm text-ink-muted">Floor {room.floor}</p>
                      </div>
                      <button
                        onClick={() => handleRoomStatusChange(room)}
                        className={`${getStatusColor(room.status)} hover:opacity-80 transition-opacity cursor-pointer`}
                      >
                        {room.status}
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-ink">${room.price}/night</span>
                      <div className="flex gap-1">
                        <button className="text-brass hover:text-brass-deep">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-forest hover:text-brass-deep">
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
            <div className="panel p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-ink">Guest Management</h3>
                  <p className="text-ink-muted">Manage guest profiles, preferences, and history</p>
                </div>
                <div className="flex gap-3">
                  <button className="btn-accent py-2 px-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Guest
                  </button>
                  <button className="btn-primary py-2 px-4 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Guests
                  </button>
                </div>
              </div>
            </div>

            {/* Guest Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="panel p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink-muted">Total Guests</p>
                    <p className="text-3xl font-bold text-ink">1,247</p>
                    <p className="text-sm text-forest">+23 this month</p>
                  </div>
                  <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <Users className="w-6 h-6 text-brass" />
                  </div>
                </div>
              </div>

              <div className="panel p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink-muted">VIP Guests</p>
                    <p className="text-3xl font-bold text-ink">89</p>
                    <p className="text-sm text-brass">Premium members</p>
                  </div>
                  <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <User className="w-6 h-6 text-brass" />
                  </div>
                </div>
              </div>

              <div className="panel p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink-muted">Repeat Guests</p>
                    <p className="text-3xl font-bold text-ink">456</p>
                    <p className="text-sm text-forest">37% return rate</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-50 border border-accent-100 rounded-sm flex items-center justify-center">
                    <Activity className="w-6 h-6 text-forest" />
                  </div>
                </div>
              </div>

              <div className="panel p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink-muted">Avg. Rating</p>
                    <p className="text-3xl font-bold text-ink">4.8</p>
                    <p className="text-sm text-brass-deep">Guest satisfaction</p>
                  </div>
                  <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <Users className="w-6 h-6 text-brass-deep" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="panel p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-muted w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search guests by name, email, or phone..."
                      className="w-full pl-10 pr-4 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select className="px-4 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass">
                    <option>All Guests</option>
                    <option>VIP Guests</option>
                    <option>Regular Guests</option>
                    <option>New Guests</option>
                  </select>
                  <select className="px-4 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Checked In</option>
                    <option>Checked Out</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Guest List */}
            <div className="panel overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sand-warm">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Guest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Bookings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Total Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Last Visit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-sand-deep">
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
                      <tr key={guest.id} className="hover:bg-sand-warm">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brass flex items-center justify-center text-white font-semibold text-sm rounded-sm">
                              {guest.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium text-ink">{guest.name}</div>
                                {guest.type === 'VIP' && (
                                  <span className="status-chip status-chip--warn">VIP</span>
                                )}
                              </div>
                              <div className="text-sm text-ink-muted">ID: {guest.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-ink">{guest.email}</div>
                          <div className="text-sm text-ink-muted">{guest.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusColor(guest.status)}>
                            {guest.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">
                          {guest.bookings} bookings
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ink">
                          ${guest.totalSpent.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">
                          {new Date(guest.lastVisit).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                          <div className="flex gap-2">
                            <button className="text-brass hover:text-brass-deep">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-forest hover:text-brass-deep">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-brass hover:text-brass-deep">
                              <Mail className="w-4 h-4" />
                            </button>
                            <button className="text-brass-deep hover:text-brass-deep">
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
              <div className="panel p-6">
                <h4 className="text-lg font-semibold text-ink mb-4">Popular Preferences</h4>
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
                        <span className="text-sm font-medium text-ink">{item.preference}</span>
                        <span className="text-sm text-ink-muted">{item.count} guests</span>
                      </div>
                      <div className="w-full bg-sand-deep rounded-sm h-2">
                        <div 
                          className="h-2 rounded-sm bg-brass"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-ink-muted">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Guest Activity */}
              <div className="panel p-6">
                <h4 className="text-lg font-semibold text-ink mb-4">Recent Activity</h4>
                <div className="space-y-4">
                  {[
                    { guest: 'John Smith', action: 'Checked in', room: 'Room 205', time: '2 hours ago', type: 'checkin' },
                    { guest: 'Sarah Johnson', action: 'Made reservation', room: 'Room 301', time: '4 hours ago', type: 'booking' },
                    { guest: 'Michael Brown', action: 'Checked out', room: 'Room 150', time: '6 hours ago', type: 'checkout' },
                    { guest: 'Emily Davis', action: 'Updated profile', room: '', time: '8 hours ago', type: 'profile' },
                    { guest: 'Robert Wilson', action: 'Requested service', room: 'Room 405', time: '12 hours ago', type: 'service' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-sand-warm rounded-sm">
                      <div className={`w-8 h-8 rounded-sm flex items-center justify-center border border-sand-deep ${
                        activity.type === 'checkin' ? 'bg-accent-50 text-forest' :
                        activity.type === 'checkout' ? 'bg-sand-warm text-ink-muted' :
                        activity.type === 'booking' ? 'bg-sand text-brass' :
                        activity.type === 'profile' ? 'bg-sand text-ink-muted' :
                        'bg-sand-warm text-brass-deep'
                      }`}>
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink">{activity.guest}</p>
                        <p className="text-xs text-ink-muted">{activity.action} {activity.room}</p>
                      </div>
                      <div className="text-xs text-ink-muted">{activity.time}</div>
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
            <div className="panel p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-ink">Analytics & Reports</h3>
                  <p className="text-ink-muted">Comprehensive insights and performance metrics</p>
                </div>
                <div className="flex gap-3">
                  <select className="px-4 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last year</option>
                  </select>
                  <button className="btn-primary py-2 px-4 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="panel p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink-muted">Average Daily Rate</p>
                    <p className="text-3xl font-bold text-ink">$287</p>
                    <p className="text-sm text-forest">+15% vs last month</p>
                  </div>
                  <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-brass" />
                  </div>
                </div>
              </div>

              <div className="panel p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink-muted">Revenue per Room</p>
                    <p className="text-3xl font-bold text-ink">$224</p>
                    <p className="text-sm text-forest">+8% vs last month</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-50 border border-accent-100 rounded-sm flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-forest" />
                  </div>
                </div>
              </div>

              <div className="panel p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink-muted">Guest Satisfaction</p>
                    <p className="text-3xl font-bold text-ink">4.8/5</p>
                    <p className="text-sm text-forest">+0.2 vs last month</p>
                  </div>
                  <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <Users className="w-6 h-6 text-brass-deep" />
                  </div>
                </div>
              </div>

              <div className="panel p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink-muted">Repeat Guests</p>
                    <p className="text-3xl font-bold text-ink">34%</p>
                    <p className="text-sm text-brass-deep">-2% vs last month</p>
                  </div>
                  <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <Activity className="w-6 h-6 text-brass" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Bar Chart */}
              <div className="panel p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-ink">Revenue Analytics</h4>
                    <p className="text-sm text-ink-muted">Daily revenue breakdown with trends</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setChartPeriod('daily')}
                      className={`text-sm px-3 py-1 rounded-sm font-medium transition-colors ${
                        chartPeriod === 'daily' 
                          ? 'bg-sand text-brass border border-brass'
                          : 'text-ink-muted hover:bg-sand-warm'
                      }`}
                    >
                      Daily
                    </button>
                    <button 
                      onClick={() => setChartPeriod('weekly')}
                      className={`text-sm px-3 py-1 rounded-sm font-medium transition-colors ${
                        chartPeriod === 'weekly' 
                          ? 'bg-sand text-brass border border-brass'
                          : 'text-ink-muted hover:bg-sand-warm'
                      }`}
                    >
                      Weekly
                    </button>
                    <button 
                      onClick={() => setChartPeriod('monthly')}
                      className={`text-sm px-3 py-1 rounded-sm font-medium transition-colors ${
                        chartPeriod === 'monthly' 
                          ? 'bg-sand text-brass border border-brass'
                          : 'text-ink-muted hover:bg-sand-warm'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
                
                {/* Chart Legend */}
                <div className="flex items-center gap-6 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-ink rounded"></div>
                    <span className="text-ink-muted">Room Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-forest rounded"></div>
                    <span className="text-ink-muted">Service Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-brass rounded-sm"></div>
                    <span className="text-ink-muted">Total Revenue</span>
                  </div>
                </div>

                {/* Enhanced Bar Chart */}
                <div className="relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-ink-muted -ml-8">
                    {getYAxisLabels().map((label, index) => (
                      <span key={index}>{label}</span>
                    ))}
                  </div>
                  
                  {/* Grid lines */}
                  <div className="absolute inset-0 h-64">
                    {[0, 25, 50, 75, 100].map((position) => (
                      <div 
                        key={position}
                        className="absolute w-full border-t border-sand-deep"
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
                            className="w-full bg-ink rounded-t-sm transition-all duration-300 hover:opacity-90 relative"
                            style={{ height: `${(data.room / scale.max) * 240}px` }}
                          ></div>
                          {/* Service Revenue Bar */}
                          <div 
                            className="w-full bg-forest transition-all duration-300 hover:opacity-90"
                            style={{ height: `${(data.service / scale.max) * 240}px` }}
                          ></div>
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-ink text-white text-xs px-3 py-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                          <div className="text-center">
                            <div className="font-semibold">{data.day}</div>
                            <div className="text-white/80">Room: ${(data.room * scale.multiplier).toLocaleString()}</div>
                            <div className="text-accent-100">Service: ${(data.service * scale.multiplier).toLocaleString()}</div>
                            <div className="text-brass font-semibold">Total: ${(data.total * scale.multiplier).toLocaleString()}</div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-ink"></div>
                        </div>

                        {/* Peak Indicator */}
                        {data.total >= (scale.max * 0.9) && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <div className="w-2 h-2 bg-brass rounded-full "></div>
                          </div>
                        )}
                      </div>
                      );
                    })}
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between text-xs text-ink-muted mt-4 px-1">
                  {getChartData().map((data, index) => (
                    <span key={index} className="text-center">{data.label}</span>
                  ))}
                </div>

                {/* Chart Summary */}
                <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-sand-deep">
                  <div className="text-center">
                    <div className="text-lg font-bold text-brass">$89,247</div>
                    <div className="text-xs text-ink-muted">Room Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-forest">$23,156</div>
                    <div className="text-xs text-ink-muted">Service Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-brass">$112,403</div>
                    <div className="text-xs text-ink-muted">Total Revenue</div>
                  </div>
                </div>
              </div>

              {/* Occupancy Chart */}
              <div className="panel p-6">
                <h4 className="text-lg font-semibold text-ink mb-6">Room Occupancy</h4>
                <div className="relative h-64">
                  {/* Pie Chart Simulation */}
                  <div className="w-48 h-48 mx-auto relative">
                    <div className="w-full h-full rounded-full border-8 border-sand-deep bg-sand-warm relative">
                      <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-ink">78%</div>
                          <div className="text-sm text-ink-muted">Occupied</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-forest rounded-full"></div>
                      <span>Available (22%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-ink-soft rounded-full"></div>
                      <span>Occupied (78%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-brass rounded-full"></div>
                      <span>Cleaning (8%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-brass-deep rounded-sm"></div>
                      <span>Maintenance (2%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Performing Rooms */}
              <div className="panel p-6">
                <h4 className="text-lg font-semibold text-ink mb-6">Top Performing Rooms</h4>
                <div className="space-y-4">
                  {[
                    { room: '301', type: 'Presidential', revenue: '$12,450', occupancy: '95%' },
                    { room: '201', type: 'Executive', revenue: '$8,920', occupancy: '89%' },
                    { room: '102', type: 'Deluxe', revenue: '$6,780', occupancy: '85%' },
                    { room: '205', type: 'Executive', revenue: '$6,340', occupancy: '82%' },
                    { room: '101', type: 'Standard', revenue: '$4,560', occupancy: '78%' }
                  ].map((room, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-sand-warm rounded-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-sand border border-sand-deep rounded-sm flex items-center justify-center text-sm font-bold text-brass">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-ink">Room {room.room}</p>
                          <p className="text-sm text-ink-muted">{room.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-ink">{room.revenue}</p>
                        <p className="text-sm text-forest">{room.occupancy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings Analytics */}
              <div className="panel p-6">
                <h4 className="text-lg font-semibold text-ink mb-6">Booking Sources</h4>
                <div className="space-y-4">
                  {[
                    { source: 'Direct Website', bookings: 145, percentage: 45, color: 'bg-ink' },
                    { source: 'Booking.com', bookings: 89, percentage: 28, color: 'bg-forest' },
                    { source: 'Expedia', bookings: 52, percentage: 16, color: 'bg-brass' },
                    { source: 'Walk-in', bookings: 35, percentage: 11, color: 'bg-brass' }
                  ].map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-ink">{source.source}</span>
                        <span className="text-sm text-ink-muted">{source.bookings} bookings</span>
                      </div>
                      <div className="w-full bg-sand-deep rounded-sm h-2">
                        <div 
                          className={`h-2 rounded-sm ${source.color}`}
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-ink-muted">{source.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="panel p-6">
              <h4 className="text-lg font-semibold text-ink mb-6">Financial Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-accent-50 rounded-sm">
                  <div className="text-2xl font-bold text-forest">$89,247</div>
                  <div className="text-sm text-ink-muted">Total Revenue</div>
                  <div className="text-xs text-forest mt-1">+12% from last month</div>
                </div>
                <div className="text-center p-4 bg-sand-warm rounded-sm">
                  <div className="text-2xl font-bold text-brass">$23,456</div>
                  <div className="text-sm text-ink-muted">Operating Costs</div>
                  <div className="text-xs text-brass mt-1">-3% from last month</div>
                </div>
                <div className="text-center p-4 bg-sand-warm rounded-sm border border-sand-deep">
                  <div className="text-2xl font-bold text-brass">$65,791</div>
                  <div className="text-sm text-ink-muted">Net Profit</div>
                  <div className="text-xs text-brass mt-1">+18% from last month</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Settings Header */}
            <div className="panel p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-ink">System Settings</h3>
                  <p className="text-ink-muted">Configure hotel management system preferences</p>
                </div>
                <div className="flex gap-3">
                  <button className="btn-accent py-2 px-4 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Config
                  </button>
                  <button className="btn-primary py-2 px-4 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hotel Information */}
              <div className="panel p-6">
                <h4 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                  <Hotel className="w-5 h-5" />
                  Hotel Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Hotel Name</label>
                    <input
                      type="text"
                      defaultValue="Luxury Grand Hotel"
                      className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Address</label>
                    <textarea
                      defaultValue="123 Ocean Drive, Miami Beach, FL 33139"
                      rows={3}
                      className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink-soft mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-soft mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="info@luxurygrandhotel.com"
                        className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Settings */}
              <div className="panel p-6">
                <h4 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Booking Settings
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Check-in Time</label>
                    <select className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass">
                      <option>2:00 PM</option>
                      <option>3:00 PM</option>
                      <option>4:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Check-out Time</label>
                    <select className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass">
                      <option>11:00 AM</option>
                      <option>12:00 PM</option>
                      <option>1:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Advance Booking Days</label>
                    <input
                      type="number"
                      defaultValue="365"
                      className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <label className="text-sm text-ink-soft">Allow same-day bookings</label>
                  </div>
                </div>
              </div>

              {/* Payment Settings */}
              <div className="panel p-6">
                <h4 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment Settings
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Currency</label>
                    <select className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      defaultValue="12"
                      step="0.1"
                      className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Service Fee ($)</label>
                    <input
                      type="number"
                      defaultValue="25"
                      className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-ink-soft">Accepted Payment Methods</label>
                    <div className="space-y-2">
                      {['Credit Card', 'PayPal', 'Mobile Money', 'Cash at Front Desk'].map((method) => (
                        <div key={method} className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <label className="text-sm text-ink-soft">{method}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="panel p-6">
                <h4 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </h4>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-ink-soft">Email Notifications</label>
                    {[
                      'New bookings',
                      'Cancellations',
                      'Payment confirmations',
                      'Guest check-ins',
                      'Maintenance requests'
                    ].map((notification) => (
                      <div key={notification} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <label className="text-sm text-ink-soft">{notification}</label>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Admin Email</label>
                    <input
                      type="email"
                      defaultValue="admin@luxurygrandhotel.com"
                      className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="panel p-6">
                <h4 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Session Timeout (minutes)</label>
                    <select className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass">
                      <option>30</option>
                      <option>60</option>
                      <option>120</option>
                      <option>240</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-ink-soft">Security Features</label>
                    {[
                      'Two-factor authentication',
                      'Login attempt logging',
                      'IP address restrictions',
                      'Password complexity requirements'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <label className="text-sm text-ink-soft">{feature}</label>
                      </div>
                    ))}
                  </div>
                  <div>
                    <button className="w-full btn-secondary text-sm">
                      Reset Admin Password
                    </button>
                  </div>
                </div>
              </div>

              {/* System Preferences */}
              <div className="panel p-6">
                <h4 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Preferences
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Time Zone</label>
                    <select className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass">
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC-6 (Central Time)</option>
                      <option>UTC-7 (Mountain Time)</option>
                      <option>UTC-8 (Pacific Time)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Date Format</label>
                    <select className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Language</label>
                    <select className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm text-ink-soft">Enable dark mode</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm text-ink-soft">Show system notifications</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <label className="text-sm text-ink-soft">Enable maintenance mode</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="panel p-6">
              <h4 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                System Status & Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-accent-50 rounded-sm">
                  <div className="text-2xl font-bold text-forest">99.9%</div>
                  <div className="text-sm text-ink-muted">System Uptime</div>
                  <div className="text-xs text-forest mt-1">Last 30 days</div>
                </div>
                <div className="text-center p-4 bg-sand-warm rounded-sm">
                  <div className="text-2xl font-bold text-brass">v2.1.4</div>
                  <div className="text-sm text-ink-muted">Current Version</div>
                  <div className="text-xs text-brass mt-1">Latest available</div>
                </div>
                <div className="text-center p-4 bg-sand-warm rounded-sm border border-sand-deep">
                  <div className="text-2xl font-bold text-brass">2.4GB</div>
                  <div className="text-sm text-ink-muted">Database Size</div>
                  <div className="text-xs text-brass mt-1">15% of limit</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="btn-primary py-2 px-4 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Backup Database
                </button>
                <button className="btn-accent py-2 px-4 flex items-center justify-center gap-2">
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
          <div className="panel w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-ink">Change Booking Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-ink-muted hover:text-ink-muted"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-sand-warm rounded-sm p-4 mb-4">
                <p className="text-sm text-ink-muted">Booking ID</p>
                <p className="font-semibold text-ink">{selectedBooking.id}</p>
                <p className="text-sm text-ink-muted mt-2">Guest</p>
                <p className="font-semibold text-ink">{selectedBooking.guestName}</p>
                <p className="text-sm text-ink-muted mt-2">Current Status</p>
                <span className={getStatusColor(selectedBooking.status)}>
                  {selectedBooking.status}
                </span>
              </div>
              
              <div>
                <p className="text-sm font-medium text-ink-soft mb-3">Select New Status:</p>
                <div className="space-y-2">
                  {getStatusOptions(selectedBooking.status).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateBookingStatus(status as Booking['status'])}
                      className={`w-full text-left px-4 py-3 rounded-sm border border-sand-deep hover:border-brass transition-colors ${getStatusColor(status)}`}
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
                className="flex-1 px-4 py-2 border border-sand-deep text-ink-soft rounded-sm hover:bg-sand-warm transition-colors"
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
          <div className="panel w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-ink">Change Room Status</h3>
              <button
                onClick={() => setShowRoomStatusModal(false)}
                className="text-ink-muted hover:text-ink-muted"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-sand-warm rounded-sm p-4 mb-4">
                <p className="text-sm text-ink-muted">Room Number</p>
                <p className="font-semibold text-ink">Room {selectedRoom.number}</p>
                <p className="text-sm text-ink-muted mt-2">Room Type</p>
                <p className="font-semibold text-ink">{selectedRoom.type}</p>
                <p className="text-sm text-ink-muted mt-2">Floor</p>
                <p className="font-semibold text-ink">Floor {selectedRoom.floor}</p>
                <p className="text-sm text-ink-muted mt-2">Price</p>
                <p className="font-semibold text-ink">${selectedRoom.price}/night</p>
                <p className="text-sm text-ink-muted mt-2">Current Status</p>
                <span className={getStatusColor(selectedRoom.status)}>
                  {selectedRoom.status}
                </span>
              </div>
              
              <div>
                <p className="text-sm font-medium text-ink-soft mb-3">Select New Status:</p>
                <div className="space-y-2">
                  {getRoomStatusOptions(selectedRoom.status).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateRoomStatus(status as Room['status'])}
                      className={`w-full text-left px-4 py-3 rounded-sm border border-sand-deep hover:border-brass transition-colors ${getStatusColor(status)}`}
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
                className="flex-1 px-4 py-2 border border-sand-deep text-ink-soft rounded-sm hover:bg-sand-warm transition-colors"
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
