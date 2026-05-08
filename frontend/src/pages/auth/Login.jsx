import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, Wrench } from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FormError from '../../components/FormError';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setServerError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data);
      if (res.data.role === 'Admin') navigate('/dashboard');
      else if (res.data.role === 'Staff') navigate('/staff-dashboard');
      else navigate('/my-appointments');
    } catch {
      setServerError('Invalid email or password!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Left Side — Blue Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Wrench size={56} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            VEHICLE<br />PARTS
          </h1>
          <p className="text-blue-100 text-lg mt-4">
            Complete Vehicle Parts & Service Management System
          </p>
          <div className="mt-12 space-y-4 text-left">
            <div className="flex items-center gap-3 text-blue-100">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Manage inventory efficiently</span>
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Track orders and invoices</span>
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Customer management made easy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Logo Mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Wrench size={28} className="text-primary" />
            <span className="text-2xl font-bold">
              <span className="text-primary">VEHICLE</span>
              <span className="text-gray-800">PARTS</span>
            </span>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back!
          </h2>
          <p className="text-subtext mb-8">
            Sign in to your account to continue
          </p>

          {/* Server Error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4 mb-6 flex items-center gap-2">
              <span>⚠️</span>
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-gray-700 text-sm font-medium mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: '' });
                  }}
                  placeholder="Enter your email"
                  className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <FormError message={errors.email} />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: '' });
                  }}
                  placeholder="Enter your password"
                  className="w-full bg-white border border-border rounded-xl pl-10 pr-12 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext hover:text-gray-800 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FormError message={errors.password} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-subtext text-sm text-center mt-8">
            Don't have an account?{' '}
            <a href="/register" className="text-primary hover:underline font-medium">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}