import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Save,
  User,
  CreditCard,
  Lock,
} from 'lucide-react';

const selectClass =
  'w-full border border-sand-deep bg-white px-3 py-3 text-ink focus:outline-none focus:border-brass';

const Toggle: React.FC<{
  enabled: boolean;
  onToggle: () => void;
}> = ({ enabled, onToggle }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 items-center border transition-colors ${
      enabled ? 'bg-forest border-forest' : 'bg-sand-deep border-sand-deep'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

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
    <div className="min-h-screen py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="btn-ghost inline-flex items-center gap-2 mb-8 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <header className="mb-10">
          <p className="section-label mb-2">Preferences</p>
          <h1 className="page-title mb-3">Settings</h1>
          <p className="text-ink-muted text-lg max-w-xl">
            Manage notifications, privacy, and account preferences.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="panel">
            <h2 className="font-display text-xl text-ink mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-brass" />
              Notifications
            </h2>

            <div className="space-y-5">
              {[
                { key: 'email' as const, title: 'Email notifications', desc: 'Receive updates via email' },
                { key: 'sms' as const, title: 'SMS notifications', desc: 'Text message alerts' },
                { key: 'push' as const, title: 'Push notifications', desc: 'Browser and app alerts' },
                { key: 'bookingUpdates' as const, title: 'Booking updates', desc: 'Confirmations and changes' },
              ].map(({ key, title, desc }) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-ink text-sm">{title}</h3>
                    <p className="text-ink-muted text-xs">{desc}</p>
                  </div>
                  <Toggle
                    enabled={notifications[key]}
                    onToggle={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h2 className="font-display text-xl text-ink mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brass" />
              Privacy & security
            </h2>

            <div className="space-y-5">
              {[
                {
                  key: 'twoFactor' as const,
                  state: security,
                  setter: setSecurity,
                  title: 'Two-factor authentication',
                  desc: 'Extra security for your account',
                },
                {
                  key: 'loginAlerts' as const,
                  state: security,
                  setter: setSecurity,
                  title: 'Login alerts',
                  desc: 'Notify on new sign-ins',
                },
                {
                  key: 'profileVisible' as const,
                  state: privacy,
                  setter: setPrivacy,
                  title: 'Profile visibility',
                  desc: 'Show profile to other guests',
                },
              ].map(({ key, state, setter, title, desc }) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-ink text-sm">{title}</h3>
                    <p className="text-ink-muted text-xs">{desc}</p>
                  </div>
                  <Toggle
                    enabled={state[key as keyof typeof state] as boolean}
                    onToggle={() => setter({ ...state, [key]: !state[key as keyof typeof state] })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h2 className="font-display text-xl text-ink mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-brass" />
              Regional preferences
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-2">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className={selectClass}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-muted mb-2">Currency</label>
                <select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                  className={selectClass}
                >
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="GHS">GHS — Ghana Cedi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-muted mb-2">Timezone</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                  className={selectClass}
                >
                  <option value="UTC+0">GMT — Ghana Time</option>
                  <option value="UTC-5">EST — Eastern Time</option>
                  <option value="UTC-8">PST — Pacific Time</option>
                  <option value="UTC+1">CET — Central European Time</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <div>
                  <h3 className="font-medium text-ink text-sm">Display theme</h3>
                  <p className="text-ink-muted text-xs">Light mode recommended</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferences({ ...preferences, theme: preferences.theme === 'light' ? 'dark' : 'light' })}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  {preferences.theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {preferences.theme === 'light' ? 'Light' : 'Dark'}
                </button>
              </div>
            </div>
          </div>

          <div className="panel">
            <h2 className="font-display text-xl text-ink mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-brass" />
              Account
            </h2>

            <div className="space-y-3">
              <Link
                to="/profile"
                className="flex items-center justify-between p-4 border border-sand-deep bg-sand-warm hover:border-brass/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-brass" />
                  <div>
                    <h3 className="font-medium text-ink text-sm">Edit profile</h3>
                    <p className="text-ink-muted text-xs">Update personal information</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-ink-muted rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <button
                type="button"
                className="flex items-center justify-between w-full p-4 border border-sand-deep bg-sand-warm hover:border-brass/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-brass" />
                  <div className="text-left">
                    <h3 className="font-medium text-ink text-sm">Change password</h3>
                    <p className="text-ink-muted text-xs">Update your account password</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-ink-muted rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                className="flex items-center justify-between w-full p-4 border border-sand-deep bg-sand-warm hover:border-brass/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-brass" />
                  <div className="text-left">
                    <h3 className="font-medium text-ink text-sm">Payment methods</h3>
                    <p className="text-ink-muted text-xs">Manage saved cards</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-ink-muted rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button type="button" onClick={handleSave} className="btn-primary">
            <Save className="w-4 h-4" />
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
