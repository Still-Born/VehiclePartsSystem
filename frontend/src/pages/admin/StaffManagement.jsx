import { useState, useEffect } from 'react';
import { Plus, Users, Mail, Shield } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';

export default function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'Staff',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await API.get('/auth/users');
      setStaffList(res.data.filter(u => u.role === 'Staff'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      showSuccess('Staff added successfully!');
      resetForm();
      fetchStaff();
    } catch {
      showError('Failed to add staff. Try again.');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setForm({ email: '', password: '', role: 'Staff' });
  };

  const roleColors = [
    'bg-blue-50 text-blue-500',
    'bg-purple-50 text-purple-500',
    'bg-green-50 text-green-500',
  ];

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Staff Management</h2>
            <p className="text-subtext">Manage your staff members</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Add Staff
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Users size={20} className="text-primary" />
                Add New Staff
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter staff email"
                      className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 6 chars eg. Staff@123"
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Role
                  </label>
                  <div className="relative">
                    <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="Staff">Staff</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Plus size={16} />
                    Add Staff
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 border border-border text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl">
            <Users size={18} className="text-white" />
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Total Staff Members</p>
            <p className="text-primary font-bold text-2xl">{staffList.length}</p>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffList.map((staff, index) => (
            <div key={index} className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <div className={`${roleColors[index % roleColors.length]} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="text-gray-800 font-semibold">
                    {staff.email.split('@')[0]}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Shield size={12} className="text-primary" />
                    <span className="text-primary text-xs font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                      {staff.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-subtext text-sm">
                  <Mail size={14} className="text-primary shrink-0" />
                  <span className="truncate">{staff.email}</span>
                </div>
              </div>
            </div>
          ))}

          {staffList.length === 0 && (
            <div className="col-span-3 text-center py-20">
              <Users size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-subtext">No staff found. Add one!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}