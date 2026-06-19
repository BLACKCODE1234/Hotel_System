const API_BASE_URL = process.env.REACT_APP_API_URL ?? '';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  first_name: string;
  last_name: string;
  mobile_number: string;
  email: string;
  password: string;
  confirm_password: string;
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
  role?: string;
}

export interface ApiUserPayload {
  email: string;
  first_name?: string;
  last_name?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  role?: string;
}

export function normalizeUser(data: ApiUserPayload | null | undefined): User | null {
  if (!data?.email) {
    return null;
  }

  return {
    email: data.email,
    first_name: data.first_name || data.firstname || '',
    last_name: data.last_name || data.lastname || '',
    phone: data.phone,
    role: data.role,
  };
}

async function apiFetch(path: string, options: RequestInit = {}, retry = true): Promise<Response> {
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  });

  if (
    retry &&
    response.status === 401 &&
    !['/refresh', '/login', '/signup', '/send-otp', '/verify-otp'].includes(path)
  ) {
    const refreshResponse = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      return apiFetch(path, options, false);
    }
  }

  return response;
}

export const api = {
  login: (credentials: LoginCredentials) =>
    apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  signup: (userData: SignupData) =>
    apiFetch('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () =>
    apiFetch('/logout', {
      method: 'POST',
    }),

  getCurrentUser: () =>
    apiFetch('/me', {
      method: 'POST',
    }),

  refreshToken: () =>
    apiFetch('/refresh', {
      method: 'POST',
    }),

  sendOtp: (email: string) =>
    apiFetch('/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyOtp: (email: string, otp: string) =>
    apiFetch('/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  createBooking: (bookingData: BookingData) =>
    apiFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  getBookingHistory: () =>
    apiFetch('/user/history', {
      method: 'GET',
    }),

  cancelBooking: (bookingId: string) =>
    apiFetch('/cancelbooking', {
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId }),
    }),

  getUserDetails: () =>
    apiFetch('/userdetails', {
      method: 'GET',
    }),

  updateProfile: (data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }) =>
    apiFetch('/change-profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  processPayment: (paymentData: Record<string, unknown>) =>
    apiFetch('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  listAdmins: () =>
    apiFetch('/superadmin/list_admin', {
      method: 'GET',
    }),

  createAdmin: (data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) =>
    apiFetch('/superadmin/create_admin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteAdmin: (email: string) =>
    apiFetch('/superadmin/deleteadmin', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};
