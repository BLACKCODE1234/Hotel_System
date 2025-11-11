import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  MapPin,
  Lock,
  Camera,
  Upload,
  Save,
  Shield,
  Settings,
  Bell,
  Mail,
  Phone,
  ArrowLeft,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Award,
  Users,
  Hotel,
  Activity,
  TrendingUp
} from 'lucide-react';

const AdminProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@luxurygrandhotel.com',
    phone: '+1 (555) 123-4567',
    employeeId: 'ADM-001',
    department: 'Hotel Management',
    position: 'Hotel Administrator',
    hireDate: '2020-01-15',
    address: {
      street: '456 Admin Boulevard',
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [adminSettings, setAdminSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    desktopNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    maintenanceAlerts: true,
    bookingAlerts: true,
    paymentAlerts: true,
    twoFactorAuth: false
  });

  const [adminStats] = useState({
    totalBookingsManaged: 2847,
    totalRevenue: 1250000,
    yearsOfService: 4,
    lastLogin: '2024-11-08 14:30:00',
    systemAccess: 'Full Access',
    securityClearance: 'Level 5'
  });

  const handleSaveProfile = () => {
    alert('Admin profile updated successfully!');
  };

  const handlePasswordUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    alert('Password updated successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordSection(false);
  };

  const handleSettingsUpdate = () => {
    alert('Admin settings updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Link 
              to="/admin"
              className="inline-flex items-center px-3 py-2 sm:px-4 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/30 transition-all duration-200 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Back to Dashboard</span>
              <span className="xs:hidden">Back</span>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold">Admin Profile Management</h1>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Administrator</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bookings Managed</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.totalBookingsManaged.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Hotel className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${(adminStats.totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Years of Service</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.yearsOfService}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Level</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.securityClearance}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Profile Content */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 sm:mr-3" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Administrator Profile</h2>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* Profile Picture & Basic Info */}
              <div className="xl:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block mb-4 sm:mb-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-4xl font-bold shadow-lg">
                      A
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
                      <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    </button>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{profileData.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-2">{profileData.position}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4">{profileData.department}</p>
                  <button className="inline-flex items-center px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base">
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Upload Picture
                  </button>
                </div>

                {/* Admin Info Card */}
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                    Admin Information
                  </h4>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 font-medium sm:font-normal">Employee ID:</span>
                      <span className="font-medium text-gray-900">{profileData.employeeId}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 font-medium sm:font-normal">Hire Date:</span>
                      <span className="font-medium text-gray-900">{new Date(profileData.hireDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 font-medium sm:font-normal">System Access:</span>
                      <span className="font-medium text-green-600">{adminStats.systemAccess}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 font-medium sm:font-normal">Last Login:</span>
                      <span className="font-medium text-gray-900 text-xs sm:text-sm">{new Date(adminStats.lastLogin).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="xl:col-span-2 space-y-6 sm:space-y-8">
                {/* Personal Information */}
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Position</label>
                      <input
                        type="text"
                        value={profileData.position}
                        onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                    Address Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        value={profileData.address.street}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          address: {...profileData.address, street: e.target.value}
                        })}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={profileData.address.city}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          address: {...profileData.address, city: e.target.value}
                        })}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">State/Province</label>
                      <input
                        type="text"
                        value={profileData.address.state}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          address: {...profileData.address, state: e.target.value}
                        })}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                      Security Settings
                    </h4>
                    <button
                      onClick={() => setShowPasswordSection(!showPasswordSection)}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 text-sm sm:text-base self-start sm:self-auto"
                    >
                      {showPasswordSection ? 'Cancel' : 'Change Password'}
                    </button>
                  </div>
                  
                  {showPasswordSection && (
                    <div className="grid grid-cols-1 gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={handlePasswordUpdate}
                        className="inline-flex items-center px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 w-fit text-sm sm:text-base"
                      >
                        <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Update Password
                      </button>
                    </div>
                  )}
                </div>

                {/* Admin Preferences */}
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                    Admin Preferences
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Notifications</h5>
                      <div className="space-y-2 sm:space-y-3">
                        {Object.entries({
                          emailNotifications: 'Email Notifications',
                          smsNotifications: 'SMS Notifications',
                          desktopNotifications: 'Desktop Notifications',
                          maintenanceAlerts: 'Maintenance Alerts',
                          bookingAlerts: 'Booking Alerts',
                          paymentAlerts: 'Payment Alerts'
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={adminSettings[key as keyof typeof adminSettings]}
                              onChange={(e) => setAdminSettings({
                                ...adminSettings,
                                [key]: e.target.checked
                              })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                            />
                            <span className="ml-2 text-xs sm:text-sm text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Reports & Security</h5>
                      <div className="space-y-2 sm:space-y-3">
                        {Object.entries({
                          weeklyReports: 'Weekly Reports',
                          monthlyReports: 'Monthly Reports',
                          twoFactorAuth: 'Two-Factor Authentication'
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={adminSettings[key as keyof typeof adminSettings]}
                              onChange={(e) => setAdminSettings({
                                ...adminSettings,
                                [key]: e.target.checked
                              })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                            />
                            <span className="ml-2 text-xs sm:text-sm text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <button 
                      onClick={handleSettingsUpdate}
                      className="inline-flex items-center px-3 py-2 sm:px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm sm:text-base"
                    >
                      <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Update Preferences
                    </button>
                  </div>
                </div>

                {/* Save Profile Button */}
                <div className="flex flex-col sm:flex-row justify-center sm:justify-end pt-4 sm:pt-6 border-t border-gray-200">
                  <button 
                    onClick={handleSaveProfile}
                    className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform transition-all duration-200 hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Save Profile Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
