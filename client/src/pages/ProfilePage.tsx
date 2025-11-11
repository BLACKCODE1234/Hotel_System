import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  MapPin,
  Lock,
  Camera,
  Upload,
  Save,
  Facebook,
  Chrome,
  ArrowLeft
} from 'lucide-react';

const ProfilePage: React.FC = () => {
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

  const [user] = useState({
    membershipTier: 'Gold'
  });

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
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

          {/* Profile Content */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-8">
                <User className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-4xl font-bold text-gray-900">Profile Settings</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Picture Section */}
                <div className="lg:col-span-1">
                  <div className="text-center">
                    <div className="relative inline-block mb-6">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
                        <Camera className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{profileData.name}</h3>
                    <p className="text-gray-600 mb-4">{user.membershipTier} Member</p>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Upload className="h-4 w-4 mr-2" />
                      🖼️ Upload Picture
                    </button>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      👤 Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address/Billing Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      🏠 Address & Billing Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input
                          type="text"
                          value={profileData.address.street}
                          onChange={(e) => setProfileData({
                            ...profileData, 
                            address: {...profileData.address, street: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={profileData.address.city}
                          onChange={(e) => setProfileData({
                            ...profileData, 
                            address: {...profileData.address, city: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                        <input
                          type="text"
                          value={profileData.address.state}
                          onChange={(e) => setProfileData({
                            ...profileData, 
                            address: {...profileData.address, state: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                        <input
                          type="text"
                          value={profileData.address.zipCode}
                          onChange={(e) => setProfileData({
                            ...profileData, 
                            address: {...profileData.address, zipCode: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          value={profileData.address.country}
                          onChange={(e) => setProfileData({
                            ...profileData, 
                            address: {...profileData.address, country: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Lock className="h-5 w-5 mr-2 text-blue-600" />
                        🔒 Security
                      </h4>
                      <button
                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                      >
                        {showPasswordSection ? 'Cancel' : 'Change Password'}
                      </button>
                    </div>
                    
                    {showPasswordSection && (
                      <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 w-fit">
                          <Save className="h-4 w-4 mr-2" />
                          Update Password
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Social Login Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Connected Accounts</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <Chrome className="h-6 w-6 text-red-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">Google</p>
                            <p className="text-sm text-gray-600">Not connected</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                          Connect
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <Facebook className="h-6 w-6 text-blue-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">Facebook</p>
                            <p className="text-sm text-gray-600">Not connected</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform transition-all duration-200 hover:scale-105">
                      <Save className="h-5 w-5 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
