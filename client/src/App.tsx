import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import BookingPage from './pages/BookingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
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

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin' || location.pathname === '/admin/profile';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdminRoute && <Header />}
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/hotel/:hotelId" element={<HotelDetailsPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
        </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
