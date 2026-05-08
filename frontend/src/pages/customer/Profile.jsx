import { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Car,
  Save, Edit, KeyRound, Eye, EyeOff, Lock
} from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';

export default function Profile() {
  const [customer, setCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    vehicleNumber: '',
    vehicleModel: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    try {
      const email = localStorage.getItem('email');
      const res = await API.get(`/customers/by-email/${email}`);
      setCustomer(res.data);
      setForm({
        fullName: res.data.fullName,
        email: res.data.email,
        phone: res.data.phone,
        address: res.data.address,
        vehicleNumber: res.data.vehicleNumber,
        vehicleModel: res.data.vehicleModel,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/customers/${customer.id}`, form);
      showSuccess('Profile updated successfully!');
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      showError('Failed to update profile!');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError('Passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showError('Password must be at least 6 characters!');
      return;
    }
    try {
      await API.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      showSuccess('Password changed successfully!');
      setShowPasswordForm(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      showError('Failed to change password! Check current password.');
    }
  };

  if (!customer) return (
    <Layout>
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin"></div>
          <p className="text-subtext text-sm">Loading profile...</p>
        </div>
      </div>
    </Layout>
  );

  const inputClass = (enabled) =>
    `w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none transition
    ${enabled
      ? 'bg-white border-border text-gray-800 focus:border-primary focus:ring-2 focus:ring-blue-100'
      : 'bg-gray-50 border-border text-subtext cursor-not-allowed'}`;

  return (
    <Layout>
      <div className="p-8 max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
          <p className="text-subtext">Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-border rounded-2xl p-8 mb-6 shadow-sm">

          {/* Avatar + Name */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center shadow-md">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-gray-800 text-xl font-bold">{customer.fullName}</h3>
                <p className="text-subtext text-sm">{customer.email}</p>
                <span className="bg-blue-50 text-primary text-xs px-3 py-1 rounded-full mt-1 inline-block border border-blue-100 font-medium">
                  Customer
                </span>
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition
                ${editMode
                  ? 'bg-gray-100 border border-border text-gray-600 hover:bg-gray-200'
                  : 'bg-primary hover:bg-blue-700 text-white shadow-sm'}`}
            >
              <Edit size={14} />
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleUpdate} className="space-y-4">

            {/* Personal Info */}
            <div className="bg-blue-50 rounded-xl p-1 mb-2">
              <p className="text-primary font-semibold text-xs uppercase tracking-wider px-3 py-2">
                Personal Information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={inputClass(editMode)}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={inputClass(editMode)}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={inputClass(editMode)}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">Address</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={inputClass(editMode)}
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="bg-blue-50 rounded-xl p-1 mt-4">
              <p className="text-primary font-semibold text-xs uppercase tracking-wider px-3 py-2">
                Vehicle Information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">Vehicle Number</label>
                <div className="relative">
                  <Car size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                  <input
                    name="vehicleNumber"
                    value={form.vehicleNumber}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={inputClass(editMode)}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">Vehicle Model</label>
                <div className="relative">
                  <Car size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                  <input
                    name="vehicleModel"
                    value={form.vehicleModel}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={inputClass(editMode)}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            {editMode && (
              <button
                type="submit"
                className="w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 mt-4 shadow-sm"
              >
                <Save size={16} />
                Save Changes
              </button>
            )}
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl">
                <KeyRound size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold">Change Password</h3>
                <p className="text-subtext text-sm mt-0.5">Update your login password</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="bg-gray-100 border border-border text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition font-medium"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="space-y-4">

              {/* Current Password */}
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Current Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-12 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext hover:text-gray-800 transition"
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-12 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext hover:text-gray-800 transition"
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-12 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext hover:text-gray-800 transition"
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <KeyRound size={16} />
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}