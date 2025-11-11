import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Settings,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  User,
  CreditCard,
  MapPin,
  Languages
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
    bookingUpdates: true,
    promotions: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    shareData: false,
    analytics: true
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'USD',
    timezone: 'UTC-5',
    theme: 'light'
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
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
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-bounce-slow"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl">
            <Settings className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
            Settings
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Customize your account preferences and privacy settings
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Notifications Settings */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl animate-slide-in-left">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-400" />
              Notifications
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Email Notifications</h3>
                  <p className="text-white/60 text-sm">Receive updates via email</p>
                </div>
                <button
                  onClick={() => setNotifications({...notifications, email: !notifications.email})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.email ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">SMS Notifications</h3>
                  <p className="text-white/60 text-sm">Get text message alerts</p>
                </div>
                <button
                  onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.sms ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.sms ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Push Notifications</h3>
                  <p className="text-white/60 text-sm">Browser and app notifications</p>
                </div>
                <button
                  onClick={() => setNotifications({...notifications, push: !notifications.push})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.push ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.push ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Booking Updates</h3>
                  <p className="text-white/60 text-sm">Reservation confirmations and changes</p>
                </div>
                <button
                  onClick={() => setNotifications({...notifications, bookingUpdates: !notifications.bookingUpdates})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.bookingUpdates ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.bookingUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl animate-slide-in-right">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-400" />
              Privacy & Security
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                  <p className="text-white/60 text-sm">Add extra security to your account</p>
                </div>
                <button
                  onClick={() => setSecurity({...security, twoFactor: !security.twoFactor})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    security.twoFactor ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    security.twoFactor ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Login Alerts</h3>
                  <p className="text-white/60 text-sm">Get notified of new logins</p>
                </div>
                <button
                  onClick={() => setSecurity({...security, loginAlerts: !security.loginAlerts})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    security.loginAlerts ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Profile Visibility</h3>
                  <p className="text-white/60 text-sm">Make profile visible to other users</p>
                </div>
                <button
                  onClick={() => setPrivacy({...privacy, profileVisible: !privacy.profileVisible})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.profileVisible ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.profileVisible ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Globe className="w-6 h-6 text-purple-400" />
              Preferences
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 mb-2 font-medium">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 mb-2 font-medium">Currency</label>
                <select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="GHS">GHS - Ghana Cedi</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 mb-2 font-medium">Timezone</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="UTC+0">GMT - Ghana Time</option>
                  <option value="UTC-5">EST - Eastern Time</option>
                  <option value="UTC-8">PST - Pacific Time</option>
                  <option value="UTC+1">CET - Central European Time</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Theme</h3>
                  <p className="text-white/60 text-sm">Choose your preferred theme</p>
                </div>
                <button
                  onClick={() => setPreferences({...preferences, theme: preferences.theme === 'light' ? 'dark' : 'light'})}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                  {preferences.theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {preferences.theme === 'light' ? 'Light' : 'Dark'}
                </button>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-yellow-400" />
              Account Management
            </h2>
            
            <div className="space-y-4">
              <Link 
                to="/profile"
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="text-white font-medium">Edit Profile</h3>
                    <p className="text-white/60 text-sm">Update your personal information</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-white/60 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="flex items-center justify-between w-full p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-green-400" />
                  <div>
                    <h3 className="text-white font-medium">Change Password</h3>
                    <p className="text-white/60 text-sm">Update your account password</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-white/60 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="flex items-center justify-between w-full p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="text-white font-medium">Payment Methods</h3>
                    <p className="text-white/60 text-sm">Manage your saved payment methods</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-white/60 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-12 text-center">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30"
          >
            <Save className="w-5 h-5" />
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
