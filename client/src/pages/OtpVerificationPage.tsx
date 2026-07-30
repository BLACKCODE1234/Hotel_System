import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, CheckCircle, XCircle, Clock, RefreshCw, ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const inputClass =
  'w-full border border-white/20 bg-white/10 px-3 py-3 text-white tracking-widest text-center text-lg uppercase placeholder-white/40 focus:outline-none focus:border-brass';

const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>(emailParam ? 'otp' : 'email');
  const [status, setStatus] = useState<'pending' | 'success' | 'error' | 'expired'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const sendOtpEmail = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setResendLoading(true);
    setMessage('');
    setErrorMessage('');

    try {
      const response = await api.sendOtp(email.trim());
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setMessage(data.message || 'OTP sent to your email.');
        setCanResend(false);
        setCountdown(60);
        setStep('otp');
      } else {
        setErrorMessage(data.message || 'Failed to send OTP.');
      }
    } catch {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      setErrorMessage('Please enter the OTP.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await api.verifyOtp(email.trim(), otp.trim());
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus('success');
        setTimeout(() => navigate('/login?verified=true'), 3000);
      } else {
        const msg = data.message || 'Verification failed';
        if (msg.toLowerCase().includes('expired')) {
          setStatus('expired');
        } else {
          setStatus('error');
        }
        setErrorMessage(msg);
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const statusIcon = () => {
    switch (status) {
      case 'success': return <CheckCircle className="w-12 h-12 text-forest" />;
      case 'error': return <XCircle className="w-12 h-12 text-[#8B3A32]" />;
      case 'expired': return <Clock className="w-12 h-12 text-brass-soft" />;
      default: return <Mail className="w-12 h-12 text-brass-soft" />;
    }
  };

  const statusTitle = () => {
    switch (status) {
      case 'success': return 'Verified';
      case 'error': return 'Verification failed';
      case 'expired': return 'OTP expired';
      default: return 'Verify your email';
    }
  };

  const statusMessage = () => {
    switch (status) {
      case 'success': return 'Your email has been verified. Redirecting to login…';
      case 'error': return errorMessage || 'Invalid or already used OTP.';
      case 'expired': return 'The OTP has expired. Request a new one below.';
      default: return `Enter the 6-character code sent to ${email || 'your email'}.`;
    }
  };

  return (
    <div
      className="min-h-full flex items-center justify-center py-16 px-4 relative"
      style={{
        backgroundImage: "linear-gradient(180deg, rgba(20,33,43,0.55), rgba(20,33,43,0.72)), url('/signup.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative w-full max-w-md bg-ink/40 border border-white/10 p-8 md:p-10 animate-rise">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex justify-center">
            {isLoading ? (
              <div className="animate-spin h-12 w-12 border-2 border-white/20 border-t-brass-soft rounded-full" />
            ) : statusIcon()}
          </div>
          <p className="section-label text-brass-soft mb-2">LuxuryStay</p>
          <h1 className="font-display text-3xl text-white mb-2">{statusTitle()}</h1>
          <p className="text-white/60 text-sm leading-relaxed">{statusMessage()}</p>
        </div>

        {step === 'email' && status === 'pending' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-white/20 bg-white/10 px-3 py-3 text-white placeholder-white/40 focus:outline-none focus:border-brass"
                placeholder="you@example.com"
              />
            </div>
            {errorMessage && <p className="text-sm text-[#8B3A32]">{errorMessage}</p>}
            <button onClick={sendOtpEmail} disabled={resendLoading} className="w-full btn-primary disabled:opacity-60">
              {resendLoading ? 'Sending…' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 'otp' && status === 'pending' && (
          <>
            <div className="mb-6 border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brass-soft shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/50">OTP sent to</p>
                  <p className="text-sm text-white break-all">{email}</p>
                </div>
              </div>
            </div>

            <form onSubmit={verifyOtp} className="space-y-4 mb-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">One-time password</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className={inputClass}
                  placeholder="000000"
                  autoComplete="one-time-code"
                />
              </div>
              {errorMessage && status === 'pending' && (
                <p className="text-sm text-[#8B3A32]">{errorMessage}</p>
              )}
              <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-60">
                {isLoading ? 'Verifying…' : 'Verify email'}
              </button>
            </form>
          </>
        )}

        {(status === 'pending' || status === 'expired' || status === 'error') && step === 'otp' && (
          <div className="space-y-4">
            {message && (
              <div className={`px-4 py-3 text-sm border ${message.toLowerCase().includes('sent') ? 'border-[#C5DED6] text-white/80' : 'border-[#E8C9C3] text-white/80'}`}>
                {message}
              </div>
            )}
            <button
              onClick={sendOtpEmail}
              disabled={!canResend || resendLoading}
              className="w-full border border-white/20 text-white/80 px-4 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full" />
                  Sending…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  {canResend ? 'Resend OTP' : `Resend in ${countdown}s`}
                </span>
              )}
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="border border-[#C5DED6] bg-[#E8F2EF]/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-forest" />
                <span className="text-sm font-medium text-white/80">Verified successfully.</span>
              </div>
            </div>
            <Link to="/login" className="w-full btn-primary flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              Continue to login
            </Link>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/signup" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-white/20 text-white/70 text-sm hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to signup
            </Link>
            <Link to="/login" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-brass-soft hover:text-brass transition-colors text-sm font-medium">
              Already verified? Login
            </Link>
          </div>
        </div>

        <div className="mt-6 border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-white/40 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-white/80 mb-1 text-sm">Need help?</h4>
              <ul className="text-xs text-white/50 space-y-1">
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

export default OtpVerificationPage;
