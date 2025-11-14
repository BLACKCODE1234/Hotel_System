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
  AlertCircle
} from 'lucide-react';

const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | 'expired'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // Auto-verify if token is present in URL
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual verification endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification logic
      if (verificationToken === 'valid-token') {
        setVerificationStatus('success');
        // Redirect to login after successful verification
        setTimeout(() => {
          navigate('/login?verified=true');
        }, 3000);
      } else if (verificationToken === 'expired-token') {
        setVerificationStatus('expired');
      } else {
        setVerificationStatus('error');
      }
    } catch (error) {
      setVerificationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setResendLoading(true);
    setResendMessage('');
    
    try {
      // Simulate API call - replace with actual resend endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResendMessage('Verification email sent successfully!');
      setCanResend(false);
      setCountdown(60);
    } catch (error) {
      setResendMessage('Failed to send verification email. Please try again.');
    } finally {
      setResendLoading(false);
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
        return 'Verification Link Expired';
      default:
        return 'Check Your Email';
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Your email has been verified. You can now log in to your account. Redirecting to login page...';
      case 'error':
        return 'The verification link is invalid or has already been used. Please request a new verification email.';
      case 'expired':
        return 'The verification link has expired. Please request a new verification email to complete your registration.';
      default:
        return `We've sent a verification email to ${email}. Please check your inbox and click the verification link to activate your account.`;
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url('/signup.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Verification Content */}
      <div className="relative max-w-md w-full space-y-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex justify-center">
              {isLoading ? (
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
              ) : (
                getStatusIcon()
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLoading ? 'Verifying Email...' : getStatusTitle()}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {getStatusMessage()}
            </p>
          </div>

          {/* Email Display */}
          {email && !token && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Email sent to:</p>
                  <p className="text-sm text-blue-800 break-all">{email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Resend Section */}
          {(verificationStatus === 'pending' || verificationStatus === 'expired' || verificationStatus === 'error') && (
            <div className="space-y-4">
              {/* Resend Message */}
              {resendMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  resendMessage.includes('successfully') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {resendMessage}
                </div>
              )}

              {/* Resend Button */}
              <button
                onClick={resendVerificationEmail}
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
                    {canResend ? 'Resend Verification Email' : `Resend in ${countdown}s`}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Success Actions */}
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

          {/* Navigation Links */}
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

          {/* Help Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-2">
                  If you don't receive the email within a few minutes:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Check your spam/junk folder</li>
                  <li>• Make sure the email address is correct</li>
                  <li>• Try resending the verification email</li>
                  <li>• Contact support if the problem persists</li>
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
