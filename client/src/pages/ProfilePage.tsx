import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  User,
  MapPin,
  Lock,
  Camera,
  Upload,
  Save,
  Globe,
  CircleUser,
  ArrowLeft
} from 'lucide-react';

const inputClass =
  'w-full border border-sand-deep bg-white px-3 py-3 text-ink focus:outline-none focus:border-brass';

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
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [user] = useState({
    membershipTier: 'Gold'
  });

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const response = await api.getUserDetails();
        if (!response.ok) {
          return;
        }

        const data = await response.json().catch(() => ({}));
        const firstName = data.first_name || data.firstname || '';
        const lastName = data.last_name || data.lastname || '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ');

        setProfileData(prev => ({
          ...prev,
          name: fullName || prev.name,
          email: data.email || prev.email,
          phone: data.phone || prev.phone
        }));
      } catch (error) {
        // Silently fail; profile can still be edited manually
      }
    };

    loadUserDetails();
  }, []);

  const handlePasswordUpdate = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.new_password.length < 4) {
      alert('Password must be at least 4 characters long!');
      return;
    }

    try {
      const response = await api.updateProfile({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password
      });

      if (response.ok) {
        alert('Password updated successfully!');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        setShowPasswordSection(false);
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.message || 'Failed to update password');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    const nameParts = profileData.name.trim().split(' ');
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ');

    try {
      const response = await api.updateProfile({
        first_name,
        last_name,
        email: profileData.email,
        phone: profileData.phone
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const initials = profileData.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="min-h-screen py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="btn-ghost inline-flex items-center gap-2 mb-8 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <header className="mb-8">
          <p className="section-label mb-2">Account</p>
          <h1 className="page-title">Profile settings</h1>
        </header>

        <div className="panel">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="text-center lg:border-r lg:border-sand-deep lg:pr-10">
              <div className="relative inline-block mb-5">
                <div className="w-28 h-28 bg-sand border border-sand-deep flex items-center justify-center text-ink font-display text-3xl">
                  {initials}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-9 h-9 bg-white border border-sand-deep flex items-center justify-center hover:border-brass transition-colors"
                  aria-label="Change photo"
                >
                  <Camera className="h-4 w-4 text-ink-muted" />
                </button>
              </div>
              <h3 className="font-display text-xl text-ink mb-1">{profileData.name}</h3>
              <p className="text-ink-muted text-sm mb-5">{user.membershipTier} member</p>
              <button type="button" className="btn-secondary text-sm py-2 px-4 w-full sm:w-auto">
                <Upload className="h-4 w-4" />
                Upload photo
              </button>
            </div>

            <div className="lg:col-span-2 space-y-10">
              <section>
                <h4 className="section-label mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-muted mb-2">Full name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-muted mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-ink-muted mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              <section>
                <h4 className="section-label mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address & billing
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-ink-muted mb-2">Street address</label>
                    <input
                      type="text"
                      value={profileData.address.street}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, street: e.target.value }
                      })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-muted mb-2">City</label>
                    <input
                      type="text"
                      value={profileData.address.city}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, city: e.target.value }
                      })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-muted mb-2">State / province</label>
                    <input
                      type="text"
                      value={profileData.address.state}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, state: e.target.value }
                      })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-muted mb-2">Postal code</label>
                    <input
                      type="text"
                      value={profileData.address.zipCode}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, zipCode: e.target.value }
                      })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-muted mb-2">Country</label>
                    <input
                      type="text"
                      value={profileData.address.country}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, country: e.target.value }
                      })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="section-label flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Security
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="text-sm font-semibold text-brass hover:text-brass-deep transition-colors"
                  >
                    {showPasswordSection ? 'Cancel' : 'Change password'}
                  </button>
                </div>

                {showPasswordSection && (
                  <div className="grid grid-cols-1 gap-4 p-5 bg-sand-warm border border-sand-deep">
                    <div>
                      <label className="block text-sm font-medium text-ink-muted mb-2">Current password</label>
                      <input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-muted mb-2">New password</label>
                      <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-muted mb-2">Confirm new password</label>
                      <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handlePasswordUpdate}
                      className="btn-primary w-fit text-sm py-2 px-4"
                    >
                      <Save className="h-4 w-4" />
                      Update password
                    </button>
                  </div>
                )}
              </section>

              <section>
                <h4 className="section-label mb-4">Connected accounts</h4>
                <div className="space-y-3">
                  {[
                    { icon: Globe, name: 'Google' },
                    { icon: CircleUser, name: 'Facebook' },
                  ].map(({ icon: Icon, name }) => (
                    <div
                      key={name}
                      className="flex items-center justify-between p-4 border border-sand-deep bg-sand-warm"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-ink-muted" />
                        <div>
                          <p className="font-medium text-ink">{name}</p>
                          <p className="text-sm text-ink-muted">Not connected</p>
                        </div>
                      </div>
                      <button type="button" className="btn-secondary text-sm py-2 px-4">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex justify-end pt-6 border-t border-sand-deep">
                <button type="button" onClick={handleSaveProfile} className="btn-primary">
                  <Save className="h-4 w-4" />
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
