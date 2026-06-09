import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Clock,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';

const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    'pending' | 'success' | 'error' | 'expired'
  >('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [initialOtpSent, setInitialOtpSent] = useState(false);

  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  useEffect(() => {
    if (email && !initialOtpSent) {
      sendOtpEmail();
      setInitialOtpSent(true);
    }
  }, [email, initialOtpSent]);

  const sendOtpEmail = async () => {
    if (!email) {
      setErrorMessage('Email address is missing. Please sign up again.');
      return;
    }

    setResendLoading(true);
    setResendMessage('');
    setErrorMessage('');

    try {
      const response = await api.sendOtp(email);
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setResendMessage(data.message || 'OTP sent to your email.');
        setCanResend(false);
        setCountdown(60);
      } else {
        setResendMessage(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setResendMessage('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Email address is missing.');
      return;
    }

    if (!otp.trim()) {
      setErrorMessage('Please enter the OTP from your email.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await api.verifyOtp(email, otp.trim());
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setVerificationStatus('success');
        setTimeout(() => {
          navigate('/login?verified=true');
        }, 3000);
      } else {
        const message = data.message || 'Verification failed';
        if (message.toLowerCase().includes('expired')) {
          setVerificationStatus('expired');
        } else {
          setVerificationStatus('error');
        }
        setErrorMessage(message);
      }
    } catch {
      setVerificationStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'expired':
        return <Clock className="w-16 h-16 text-orange-500" />;
      default:
        return <Mail className="w-16 h-16 text-blue-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Email Verified Successfully!';
      case 'error':
        return 'Verification Failed';
      case 'expired':
        return 'OTP Expired';
      default:
        return 'Verify Your Email';
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Your email has been verified. Redirecting to login...';
      case 'error':
        return errorMessage || 'The OTP is invalid or has already been used.';
      case 'expired':
        return 'The OTP has expired. Request a new code below.';
      default:
        return `Enter the 6-character OTP sent to ${email || 'your email'}.`;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url('/signup.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative max-w-md w-full space-y-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex justify-center">
              {isLoading ? (
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
              ) : (
                getStatusIcon()
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLoading ? 'Verifying OTP...' : getStatusTitle()}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{getStatusMessage()}</p>
          </div>

          {email && verificationStatus === 'pending' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">OTP sent to:</p>
                  <p className="text-sm text-blue-800 break-all">{email}</p>
                </div>
              </div>
            </div>
          )}

          {verificationStatus === 'pending' && (
            <form onSubmit={verifyOtp} className="space-y-4 mb-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  One-Time Password
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-widest text-center text-lg uppercase"
                  placeholder="Enter OTP"
                  autoComplete="one-time-code"
                />
              </div>

              {errorMessage && verificationStatus === 'pending' && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
          )}

          {(verificationStatus === 'pending' ||
            verificationStatus === 'expired' ||
            verificationStatus === 'error') && (
            <div className="space-y-4">
              {resendMessage && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    resendMessage.toLowerCase().includes('sent')
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {resendMessage}
                </div>
              )}

              <button
                onClick={sendOtpEmail}
                disabled={!canResend || resendLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {resendLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    {canResend ? 'Resend OTP' : `Resend in ${countdown}s`}
                  </>
                )}
              </button>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Account activated successfully!
                  </span>
                </div>
              </div>

              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Shield className="w-4 h-4" />
                Continue to Login
              </Link>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/signup"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Signup
              </Link>
              <Link
                to="/login"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                Already verified? Login
              </Link>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Need Help?</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Check your spam/junk folder</li>
                  <li>• OTP expires after 5 minutes</li>
                  <li>• Use resend if you did not receive the code</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
