import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import BookingPage from './pages/BookingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import UserDashboard from './pages/UserDashboard';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import SupportPage from './pages/SupportPage';
import RewardsPage from './pages/RewardsPage';
import SettingsPage from './pages/SettingsPage';
import PaymentPage from './pages/PaymentPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminProfilePage from './pages/AdminProfilePage';
import SuperAdminManagementPage from './pages/SuperAdminManagementPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import StaffDashboard from './pages/StaffDashboard';

const roleHome: Record<string, string> = {
  admin: '/admin',
  staff: '/staff',
  superadmin: '/superadmin',
  user: '/dashboard',
};

interface ProtectedRouteProps {
  children: React.ReactElement;
  roles?: string[];
}

function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand">
        <div className="h-10 w-10 border-2 border-sand-deep border-t-brass rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role || '')) {
    return <Navigate to={roleHome[user.role || 'user'] || '/dashboard'} replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin' || 
                      location.pathname === '/admin/profile' || 
                      location.pathname === '/superadmin-management' ||
                      location.pathname === '/superadmin' ||
                      location.pathname === '/staff';

  return (
      <div className="min-h-screen bg-sand text-ink flex flex-col">
        {!isAdminRoute && <Header />}
        <div className="flex-1">
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/booking" element={<ProtectedRoute roles={['user', 'admin', 'superadmin']}><BookingPage /></ProtectedRoute>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/email-verification" element={<EmailVerificationPage />} />
          <Route path="/otp-verification" element={<OtpVerificationPage />} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['user', 'admin', 'superadmin']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute roles={['user', 'admin', 'superadmin']}><HistoryPage /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute roles={['user']}><RewardsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute roles={['user', 'admin', 'superadmin']}><PaymentPage /></ProtectedRoute>} />
          <Route path="/hotel/:hotelId" element={<HotelDetailsPage />} />
          <Route path="/booking-confirmation" element={<ProtectedRoute roles={['user', 'admin', 'superadmin']}><BookingConfirmationPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin', 'superadmin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute roles={['admin', 'superadmin']}><AdminProfilePage /></ProtectedRoute>} />
          <Route path="/superadmin-management" element={<ProtectedRoute roles={['superadmin']}><SuperAdminManagementPage /></ProtectedRoute>} />
          <Route path="/superadmin" element={<ProtectedRoute roles={['superadmin']}><SuperAdminDashboard /></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute roles={['staff', 'admin']}><StaffDashboard /></ProtectedRoute>} />
        </Routes>
        </div>
        {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
