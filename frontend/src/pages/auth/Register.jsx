import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Eye, EyeOff, Wrench, User, Mail, Phone, MapPin, Car, Lock } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    address: '',
    vehicleNumber: '',
    vehicleModel: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', {
        email: form.email,
        password: form.password,
        role: 'Customer'
      });
      await API.post('/customers', {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        vehicleNumber: form.vehicleNumber,
        vehicleModel: form.vehicleModel,
      });
      setSuccess('Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError('Registration failed. Try a stronger password like Admin@123');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Left Side — Blue Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-primary flex-col items-center justify-center p-12">
        <div className="text-center">
          <Wrench size={56} className="text-white mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4">
            VEHICLE<br />PARTS
          </h1>
          <p className="text-blue-100 text-lg mt-4">
            Complete Vehicle Parts & Service Management System
          </p>
          <div className="mt-12 space-y-4 text-left">
            <div className="flex items-center gap-3 text-blue-100">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Book service appointments</span>
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Track your vehicle history</span>
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Request unavailable parts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side — Register Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg py-8">

          {/* Logo Mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Wrench size={28} className="text-primary" />
            <span className="text-2xl font-bold">
              <span className="text-primary">VEHICLE</span>
              <span className="text-gray-800">PARTS</span>
            </span>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-subtext mb-8">Fill in your details to get started</p>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4 mb-6">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl p-4 mb-6">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">

            {/* Account Info */}
            <div className="bg-blue-50 rounded-xl p-1 mb-2">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider px-3 py-2">
                Account Info
              </p>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium mb-2 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars eg. Admin@123"
                  className="w-full bg-white border border-border rounded-xl pl-10 pr-12 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext hover:text-gray-800 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-blue-50 rounded-xl p-1 mt-4">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider px-3 py-2">
                Personal Info
              </p>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium mb-2 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">Address</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Your address"
                    className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="bg-blue-50 rounded-xl p-1 mt-4">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider px-3 py-2">
                Vehicle Info
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">Vehicle Number</label>
                <div className="relative">
                  <Car size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={form.vehicleNumber}
                    onChange={handleChange}
                    placeholder="BA 1 CHA 1234"
                    className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">Vehicle Model</label>
                <div className="relative">
                  <Car size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                  <input
                    type="text"
                    name="vehicleModel"
                    value={form.vehicleModel}
                    onChange={handleChange}
                    placeholder="Toyota Corolla 2020"
                    className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 mt-4 shadow-sm"
            >
              Create Account
            </button>
          </form>

          <p className="text-subtext text-sm text-center mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline font-medium">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}