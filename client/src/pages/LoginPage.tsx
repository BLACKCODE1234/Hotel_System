import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const inputClass =
  'w-full border border-sand-deep bg-white px-3 py-3 text-ink focus:outline-none focus:border-brass';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setShowVerificationSuccess(true);
      const timer = setTimeout(() => setShowVerificationSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const validateForm = () => {
    const next: { [key: string]: string } = {};
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) next.email = 'Email is invalid';
    if (!formData.password.trim()) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);
    if (!result.success) return;

    const role = result.role;
    if (role === 'admin') navigate('/admin');
    else if (role === 'staff') navigate('/staff');
    else if (role === 'superadmin') navigate('/superadmin');
    else navigate('/dashboard');
  };

  return (
    <div
      className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-16 px-4 relative"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(20,33,43,0.55), rgba(20,33,43,0.72)), url('/userloginpage.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative w-full max-w-md bg-sand-warm border border-sand-deep p-8 md:p-10 animate-rise">
        <p className="section-label mb-2">LuxuryStay</p>
        <h1 className="font-display text-4xl text-ink mb-2">Sign in</h1>
        <p className="text-ink-muted mb-8">Access your reservations and guest profile.</p>

        {showVerificationSuccess && (
          <div className="mb-6 border border-[#C5DED6] bg-[#E8F2EF] px-4 py-3 text-forest text-sm">
            Email verified. You can sign in now.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-ink-muted mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClass}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-[#8B3A32]">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-ink-muted mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`${inputClass} pr-11`}
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-[#8B3A32]">{errors.password}</p>}
          </div>

          {error && <p className="text-sm text-[#8B3A32]">{error}</p>}

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ink-muted">
          New guest?{' '}
          <Link to="/signup" className="text-brass hover:text-brass-deep font-medium">
            Create an account
          </Link>
        </p>

        {import.meta.env.DEV && (
          <p className="mt-4 text-center text-xs text-ink-muted/80">
            Seed accounts listed in backend/.env.example
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
