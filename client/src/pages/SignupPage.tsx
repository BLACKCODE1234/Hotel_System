import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const inputClass =
  'w-full border border-white/20 bg-white/10 px-3 py-3 text-white placeholder-white/40 focus:outline-none focus:border-brass';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const next: { [key: string]: string } = {};
    if (!formData.first_name.trim()) next.first_name = 'First name is required';
    if (!formData.last_name.trim()) next.last_name = 'Last name is required';
    if (!formData.mobile_number.trim()) next.mobile_number = 'Phone number is required';
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) next.email = 'Email is invalid';
    if (formData.password.length < 8) next.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirm_password) {
      next.confirm_password = 'Passwords do not match';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validateForm()) return;
    const success = await signup(formData);
    if (success) {
      navigate(`/email-verification?email=${encodeURIComponent(formData.email)}`);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
      <div className="relative w-full max-w-lg bg-ink/90 border border-white/10 p-8 md:p-10 animate-rise">
        <p className="section-label text-brass-soft mb-2">LuxuryStay</p>
        <h1 className="font-display text-4xl text-white mb-2">Create account</h1>
        <p className="text-white/60 mb-8">Join to manage bookings and guest preferences.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">First name</label>
              <input name="first_name" value={formData.first_name} onChange={onChange} className={inputClass} />
              {errors.first_name && <p className="mt-1 text-sm text-[#8B3A32]">{errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">Last name</label>
              <input name="last_name" value={formData.last_name} onChange={onChange} className={inputClass} />
              {errors.last_name && <p className="mt-1 text-sm text-[#8B3A32]">{errors.last_name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">Phone</label>
            <input name="mobile_number" value={formData.mobile_number} onChange={onChange} className={inputClass} />
            {errors.mobile_number && <p className="mt-1 text-sm text-[#8B3A32]">{errors.mobile_number}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={onChange} className={inputClass} />
            {errors.email && <p className="mt-1 text-sm text-[#8B3A32]">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={onChange}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-[#8B3A32]">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={onChange}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="mt-1 text-sm text-[#8B3A32]">{errors.confirm_password}</p>
            )}
          </div>

          {error && <p className="text-sm text-[#8B3A32]">{error}</p>}

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-60">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="text-brass hover:text-brass-deep font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
