const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface BookingData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  in_date: string;
  out_date: string;
  adult: number;
  children: number;
  rooms: number;
  room_type: string;
  special_request?: string;
}

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export const api = {
  // Authentication
  login: (credentials: LoginCredentials) => 
    fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include'
    }),

  signup: (userData: SignupData) =>
    fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include'
    }),

  logout: () =>
    fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    }),

  getCurrentUser: () =>
    fetch(`${API_BASE_URL}/me`, {
      method: 'POST',
      credentials: 'include'
    }),

  refreshToken: () =>
    fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      credentials: 'include'
    }),

  // Bookings
  createBooking: (bookingData: BookingData) =>
    fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
      credentials: 'include'
    }),

  getBookingHistory: () =>
    fetch(`${API_BASE_URL}/user/history`, {
      method: 'GET',
      credentials: 'include'
    }),

  cancelBooking: (bookingId: string) =>
    fetch(`${API_BASE_URL}/cancelbooking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId }),
      credentials: 'include'
    }),

  // User details
  getUserDetails: () =>
    fetch(`${API_BASE_URL}/userdetails`, {
      method: 'GET',
      credentials: 'include'
    }),

  // Payments
  processPayment: (paymentData: any) =>
    fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
      credentials: 'include'
    })
};
