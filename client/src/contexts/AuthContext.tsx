import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, normalizeUser, SignupData, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.ok) {
        const data = await response.json();
        setUser(normalizeUser(data.user));
      } else {
        setUser(null);
      }
    } catch (authError) {
      console.error('Auth check failed:', authError);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.login({ email, password });

      if (response.ok) {
        const data = await response.json();
        const loggedInUser = normalizeUser(data.user);
        if (loggedInUser) {
          setUser(loggedInUser);
        } else {
          await checkAuth();
        }
        return true;
      }

      const errorData = await response.json().catch(() => ({}));
      setError(errorData.message || 'Login failed');
      return false;
    } catch (loginError) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.signup(userData);

      if (response.ok) {
        const data = await response.json();
        const signedUpUser = normalizeUser(data.user);
        if (signedUpUser) {
          setUser(signedUpUser);
        }
        return true;
      }

      const errorData = await response.json().catch(() => ({}));
      setError(errorData.message || 'Signup failed');
      return false;
    } catch (signupError) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (logoutError) {
      console.error('Logout error:', logoutError);
    } finally {
      setUser(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
