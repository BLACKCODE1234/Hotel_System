import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Crown, 
  Shield, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building, 
  UserCheck, 
  Eye, 
  EyeOff, 
  Save,
  Plus,
  Users,
  Settings,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Calendar
} from 'lucide-react';

const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create-admin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    mobile_number: '',
    department: 'Hotel Management',
    position: 'Hotel Administrator'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (formData.password) {
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = 'Password must contain uppercase, lowercase, and a number';
    }
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const response = await api.createAdmin({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.detail?.message || data?.message || 'Failed to create administrator');
      }

      setSuccessMessage('Administrator created successfully!');
      setFormData({
        email: '', password: '', confirm_password: '',
        first_name: '', last_name: '', mobile_number: '',
        department: 'Hotel Management', position: 'Hotel Administrator'
      });
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create administrator. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Very Weak', color: 'bg-red-700' },
      { strength: 2, label: 'Weak', color: 'bg-brass' },
      { strength: 3, label: 'Fair', color: 'bg-brass' },
      { strength: 4, label: 'Good', color: 'bg-ink' },
      { strength: 5, label: 'Strong', color: 'bg-forest' }
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="ops-shell">
      {/* Header */}
      <div className="ops-topbar text-white px-4 py-4 ">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Link 
              to="/admin"
              className="inline-flex items-center px-3 py-2 sm:px-4 bg-white/20 backdrop-blur-sm text-white font-medium rounded-sm hover:bg-white/30 transition-all duration-200 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brass rounded-sm flex items-center justify-center ">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Super Administrator Dashboard</h1>
                <p className="text-white/70 text-sm">Manage administrators and system settings</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Crown className="w-5 h-5 text-brass" />
            <span className="font-medium">Super Admin Panel</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl  border border-sand-deep p-2">
            <nav className="flex flex-wrap gap-2">
              {[
                { id: 'create-admin', label: 'Create Administrator', icon: Shield },
                { id: 'manage-users', label: 'Manage Users', icon: Users },
                { id: 'system-settings', label: 'System Settings', icon: Settings },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-sm font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-ink text-white '
                      : 'text-ink-muted hover:text-ink hover:bg-sand-warm'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Create Administrator Tab */}
        {activeTab === 'create-admin' && (
          <div>
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-accent-50 border border-accent-100 rounded-sm flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-forest" />
                <span className="text-green-800 font-medium">{successMessage}</span>
              </div>
            )}

            {/* Main Form Card */}
            <div className="panel overflow-hidden p-0">
              {/* Card Header */}
              <div className="bg-ink px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Create New Administrator</h2>
                    <p className="text-white/70 text-sm">Add a new administrator to the hotel management system</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-brass" />
                        Personal Information
                      </h3>
                      
                      <div className="space-y-4">
                        {/* First Name */}
                        <div>
                          <label className="block text-sm font-medium text-ink-soft mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:border-brass transition-all duration-200 ${
                              errors.first_name ? 'border-red-500' : 'border-sand-deep'
                            }`}
                            placeholder="Enter first name"
                          />
                          {errors.first_name && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <XCircle className="w-4 h-4" />
                              {errors.first_name}
                            </p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="block text-sm font-medium text-ink-soft mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-sm focus:outline-none focus:border-brass transition-all duration-200 ${
                              errors.last_name ? 'border-red-500' : 'border-sand-deep'
                            }`}
                            placeholder="Enter last name"
                          />
                          {errors.last_name && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <XCircle className="w-4 h-4" />
                              {errors.last_name}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-ink-soft mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink-muted" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-sm focus:outline-none focus:border-brass transition-all duration-200 ${
                                errors.email ? 'border-red-500' : 'border-sand-deep'
                              }`}
                              placeholder="admin@hotel.com"
                            />
                          </div>
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <XCircle className="w-4 h-4" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-ink-soft mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink-muted" />
                            <input
                              type="tel"
                              name="mobile_number"
                              value={formData.mobile_number}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-sand-deep rounded-sm focus:outline-none focus:border-brass transition-all duration-200"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security & Role Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-brass" />
                        Security & Role Information
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Password */}
                        <div>
                          <label className="block text-sm font-medium text-ink-soft mb-2">
                            Password *
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink-muted" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-12 py-3 border rounded-sm focus:outline-none focus:border-brass transition-all duration-200 ${
                                errors.password ? 'border-red-500' : 'border-sand-deep'
                              }`}
                              placeholder="Enter secure password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink-muted hover:text-ink-muted"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          
                          {/* Password Strength Indicator */}
                          {formData.password && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-ink-muted">{passwordStrength.label}</span>
                              </div>
                            </div>
                          )}
                          
                          {errors.password && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <XCircle className="w-4 h-4" />
                              {errors.password}
                            </p>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-sm font-medium text-ink-soft mb-2">
                            Confirm Password *
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink-muted" />
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirm_password"
                              value={formData.confirm_password}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-12 py-3 border rounded-sm focus:outline-none focus:border-brass transition-all duration-200 ${
                                errors.confirm_password ? 'border-red-500' : 'border-sand-deep'
                              }`}
                              placeholder="Confirm password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink-muted hover:text-ink-muted"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {errors.confirm_password && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <XCircle className="w-4 h-4" />
                              {errors.confirm_password}
                            </p>
                          )}
                        </div>

                        {/* Department */}
                        <div>
                          <label className="block text-sm font-medium text-ink-soft mb-2">
                            Department
                          </label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink-muted" />
                            <select
                              name="department"
                              value={formData.department}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-sand-deep rounded-sm focus:outline-none focus:border-brass transition-all duration-200"
                            >
                              <option value="Hotel Management">Hotel Management</option>
                              <option value="Operations">Operations</option>
                              <option value="Guest Services">Guest Services</option>
                              <option value="Housekeeping">Housekeeping</option>
                              <option value="Food & Beverage">Food & Beverage</option>
                              <option value="Maintenance">Maintenance</option>
                              <option value="Finance">Finance</option>
                              <option value="Human Resources">Human Resources</option>
                            </select>
                          </div>
                        </div>

                        {/* Position */}
                        <div>
                          <label className="block text-sm font-medium text-ink-soft mb-2">
                            Position
                          </label>
                          <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-sand-deep rounded-sm focus:outline-none focus:border-brass transition-all duration-200"
                            placeholder="Hotel Administrator"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800">{errors.submit}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({
                      email: '',
                      password: '',
                      confirm_password: '',
                      first_name: '',
                      last_name: '',
                      mobile_number: '',
                      department: 'Hotel Management',
                      position: 'Hotel Administrator'
                    })}
                    className="px-6 py-3 border border-sand-deep text-ink-soft rounded-sm hover:bg-sand-warm transition-colors duration-200 text-center"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-ink text-white font-medium rounded-sm hover: transform transition-all duration-200  disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Creating Administrator...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Create Administrator
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Info Card */}
            <div className="mt-6 bg-sand-warm border border-sand-deep rounded-sm p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-brass mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Administrator Privileges</h4>
                  <p className="text-sm text-blue-800">
                    Administrators have access to booking management, room management, guest services, 
                    and reporting features. They cannot create other administrators or modify system settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'manage-users' && (
          <div className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-muted">Total Users</p>
                    <p className="text-2xl font-bold text-ink">1,247</p>
                    <p className="text-sm text-forest">+12% this month</p>
                  </div>
                  <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <Users className="w-6 h-6 text-brass" />
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-muted">Administrators</p>
                    <p className="text-2xl font-bold text-ink">23</p>
                    <p className="text-sm text-brass">+2 this week</p>
                  </div>
                  <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <Shield className="w-6 h-6 text-brass" />
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-muted">Active Today</p>
                    <p className="text-2xl font-bold text-ink">89</p>
                    <p className="text-sm text-forest">+5% vs yesterday</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-50 border border-accent-100 rounded-sm flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-forest" />
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-muted">Pending Verification</p>
                    <p className="text-2xl font-bold text-ink">15</p>
                    <p className="text-sm text-orange-600">Needs attention</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-sm flex items-center justify-center">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl  border border-sand-deep p-6">
              <h3 className="text-lg font-semibold text-ink mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="flex items-center gap-3 p-4 border border-sand-deep rounded-sm hover:bg-sand-warm transition-colors">
                  <div className="w-10 h-10 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <Plus className="w-5 h-5 text-brass" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-ink">Bulk Import</p>
                    <p className="text-sm text-ink-muted">Import users from CSV</p>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 border border-sand-deep rounded-sm hover:bg-sand-warm transition-colors">
                  <div className="w-10 h-10 bg-accent-50 border border-accent-100 rounded-sm flex items-center justify-center">
                    <Mail className="w-5 h-5 text-forest" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-ink">Send Notifications</p>
                    <p className="text-sm text-ink-muted">Bulk email to users</p>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 border border-sand-deep rounded-sm hover:bg-sand-warm transition-colors">
                  <div className="w-10 h-10 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-brass" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-ink">Export Report</p>
                    <p className="text-sm text-ink-muted">Download user data</p>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 border border-sand-deep rounded-sm hover:bg-sand-warm transition-colors">
                  <div className="w-10 h-10 bg-red-100 rounded-sm flex items-center justify-center">
                    <Settings className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-ink">Bulk Actions</p>
                    <p className="text-sm text-ink-muted">Mass user operations</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl  border border-sand-deep p-6">
              <h3 className="text-lg font-semibold text-ink mb-4">Recent User Activity</h3>
              <div className="space-y-4">
                {[
                  { user: 'John Smith', action: 'Created new account', time: '2 minutes ago', type: 'success' },
                  { user: 'Sarah Johnson', action: 'Updated profile information', time: '15 minutes ago', type: 'info' },
                  { user: 'Mike Wilson', action: 'Password reset requested', time: '1 hour ago', type: 'warning' },
                  { user: 'Admin User', action: 'Created new administrator', time: '2 hours ago', type: 'success' },
                  { user: 'Emma Davis', action: 'Account suspended', time: '3 hours ago', type: 'error' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border border-sand-deep rounded-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-forest' :
                      activity.type === 'warning' ? 'bg-brass' :
                      activity.type === 'error' ? 'bg-red-500' : 'bg-ink'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink">{activity.user}</p>
                      <p className="text-sm text-ink-muted">{activity.action}</p>
                    </div>
                    <p className="text-xs text-ink-muted">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === 'system-settings' && (
          <div className="space-y-6">
            {/* Settings Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="bg-white rounded-xl  border border-sand-deep p-6">
                <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-brass" />
                  General Settings
                </h3>
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
                    <label className="block text-sm font-medium text-ink-soft mb-2">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="contact@luxurygrandhotel.com"
                      className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-xl  border border-sand-deep p-6">
                <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brass" />
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ink">Two-Factor Authentication</p>
                      <p className="text-sm text-ink-muted">Require 2FA for all admin accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brass/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-sand-deep after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brass"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ink">Email Verification</p>
                      <p className="text-sm text-ink-muted">Require email verification for new accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brass/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-sand-deep after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brass"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ink">Session Timeout</p>
                      <p className="text-sm text-ink-muted">Auto-logout inactive users</p>
                    </div>
                    <select className="px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>4 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Email Settings */}
              <div className="bg-white rounded-xl  border border-sand-deep p-6">
                <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-brass" />
                  Email Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">SMTP Server</label>
                    <input
                      type="text"
                      defaultValue="smtp.gmail.com"
                      className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">SMTP Port</label>
                    <input
                      type="number"
                      defaultValue="587"
                      className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ink">Enable SSL/TLS</p>
                      <p className="text-sm text-ink-muted">Secure email transmission</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brass/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-sand-deep after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brass"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Backup Settings */}
              <div className="bg-white rounded-xl  border border-sand-deep p-6">
                <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                  <Save className="w-5 h-5 text-brass" />
                  Backup & Maintenance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ink">Automatic Backups</p>
                      <p className="text-sm text-ink-muted">Daily database backups</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brass/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-sand-deep after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brass"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Backup Frequency</label>
                    <select className="w-full px-3 py-2 border border-sand-deep rounded-sm focus:outline-none focus:border-brass">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <button className="w-full px-4 py-2 btn-primary transition-colors">
                    Create Backup Now
                  </button>
                </div>
              </div>
            </div>

            {/* Save Settings */}
            <div className="flex justify-end">
              <button className="px-6 py-3 bg-ink text-white font-medium rounded-sm hover: transform transition-all duration-200 ">
                Save All Settings
              </button>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-muted">Total Revenue</p>
                    <p className="text-2xl font-bold text-ink">$89,247</p>
                    <p className="text-sm text-forest">+12% this month</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-50 border border-accent-100 rounded-sm flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-forest" />
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-muted">Bookings</p>
                    <p className="text-2xl font-bold text-ink">1,456</p>
                    <p className="text-sm text-brass">+8% this month</p>
                  </div>
                  <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-brass" />
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-muted">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-ink">78%</p>
                    <p className="text-sm text-forest">+5% vs last month</p>
                  </div>
                  <div className="w-12 h-12 bg-sand border border-sand-deep rounded-sm flex items-center justify-center">
                    <Users className="w-6 h-6 text-brass" />
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-muted">Avg. Rating</p>
                    <p className="text-2xl font-bold text-ink">4.8</p>
                    <p className="text-sm text-forest">+0.2 this month</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-sm flex items-center justify-center">
                    <Crown className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Reports */}
            <div className="bg-white rounded-xl  border border-sand-deep p-6">
              <h3 className="text-lg font-semibold text-ink mb-4">System Performance</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 border border-sand-deep rounded-sm">
                  <h4 className="font-medium text-ink mb-2">Server Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-muted">CPU Usage</span>
                      <span className="text-sm font-medium text-forest">23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '23%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-muted">Memory Usage</span>
                      <span className="text-sm font-medium text-brass">67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '67%'}}></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-sand-deep rounded-sm">
                  <h4 className="font-medium text-ink mb-2">Database Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-muted">Connection Pool</span>
                      <span className="px-2 py-1 status-chip status-chip--ok text-xs rounded-full">Healthy</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-muted">Query Performance</span>
                      <span className="px-2 py-1 status-chip status-chip--ok text-xs rounded-full">Optimal</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-muted">Storage Used</span>
                      <span className="text-sm font-medium text-ink">2.3 GB / 10 GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {!['create-admin', 'manage-users', 'system-settings', 'analytics'].includes(activeTab) && (
          <div className="bg-white rounded-sm  border border-sand-deep p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-ink-muted" />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">Coming Soon</h3>
            <p className="text-ink-muted">This feature will be available in the next update.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
