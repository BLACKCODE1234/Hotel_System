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

const inputClass =
  'w-full border border-sand-deep bg-white px-3 py-3 text-ink focus:outline-none focus:border-brass tracking-widest text-center text-lg uppercase';

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
        return <CheckCircle className="w-12 h-12 text-forest" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-[#8B3A32]" />;
      case 'expired':
        return <Clock className="w-12 h-12 text-brass" />;
      default:
        return <Mail className="w-12 h-12 text-brass" />;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Email verified';
      case 'error':
        return 'Verification failed';
      case 'expired':
        return 'OTP expired';
      default:
        return 'Verify your email';
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Your email has been verified. Redirecting to login…';
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
      className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-16 px-4 relative"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(20,33,43,0.55), rgba(20,33,43,0.72)), url('/signup.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative w-full max-w-md bg-sand-warm border border-sand-deep p-8 md:p-10 animate-rise">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex justify-center">
            {isLoading ? (
              <div className="animate-spin h-12 w-12 border-2 border-sand-deep border-t-brass" />
            ) : (
              getStatusIcon()
            )}
          </div>
          <p className="section-label mb-2">LuxuryStay</p>
          <h1 className="font-display text-3xl text-ink mb-2">
            {isLoading ? 'Verifying OTP…' : getStatusTitle()}
          </h1>
          <p className="text-ink-muted text-sm leading-relaxed">{getStatusMessage()}</p>
        </div>

        {email && verificationStatus === 'pending' && (
          <div className="mb-6 border border-sand-deep bg-sand px-4 py-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brass shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted">OTP sent to</p>
                <p className="text-sm text-ink break-all">{email}</p>
              </div>
            </div>
          </div>
        )}

        {verificationStatus === 'pending' && (
          <form onSubmit={verifyOtp} className="space-y-4 mb-6">
            <div>
              <label htmlFor="otp" className="block text-xs uppercase tracking-wider text-ink-muted mb-2">
                One-time password
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className={inputClass}
                placeholder="Enter OTP"
                autoComplete="one-time-code"
              />
            </div>

            {errorMessage && verificationStatus === 'pending' && (
              <p className="text-sm text-[#8B3A32]">{errorMessage}</p>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-50">
              {isLoading ? 'Verifying…' : 'Verify email'}
            </button>
          </form>
        )}

        {(verificationStatus === 'pending' ||
          verificationStatus === 'expired' ||
          verificationStatus === 'error') && (
          <div className="space-y-4">
            {resendMessage && (
              <div
                className={`px-4 py-3 text-sm border ${
                  resendMessage.toLowerCase().includes('sent')
                    ? 'status-chip--ok border-[#C5DED6]'
                    : 'status-chip--danger border-[#E8C9C3]'
                }`}
              >
                {resendMessage}
              </div>
            )}

            <button
              onClick={sendOtpEmail}
              disabled={!canResend || resendLoading}
              className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-ink border-t-transparent" />
                  Sending…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  {canResend ? 'Resend OTP' : `Resend in ${countdown}s`}
                </span>
              )}
            </button>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="space-y-4">
            <div className="border border-[#C5DED6] bg-[#E8F2EF] px-4 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-forest" />
                <span className="text-sm font-medium text-forest">Account activated successfully.</span>
              </div>
            </div>

            <Link to="/login" className="btn-primary w-full">
              <Shield className="w-4 h-4" />
              Continue to login
            </Link>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-sand-deep space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/signup" className="btn-secondary flex-1 text-sm py-2">
              <ArrowLeft className="w-4 h-4" />
              Back to signup
            </Link>
            <Link
              to="/login"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-brass hover:text-brass-deep transition-colors text-sm font-medium"
            >
              Already verified? Login
            </Link>
          </div>
        </div>

        <div className="mt-6 border border-sand-deep bg-sand px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-ink-muted mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-ink mb-1 text-sm">Need help?</h4>
              <ul className="text-xs text-ink-muted space-y-1">
                <li>Check your spam or junk folder</li>
                <li>OTP expires after 5 minutes</li>
                <li>Use resend if you did not receive the code</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
