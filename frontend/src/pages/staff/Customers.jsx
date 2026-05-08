import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Users, Mail, Phone, Car, Search, MapPin, X } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    vehicleNumber: '',
    vehicleModel: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchCustomers();
      return;
    }
    try {
      const res = await API.get(`/customers/search?query=${searchQuery}`);
      setCustomers(res.data);
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
      if (editCustomer) {
        await API.put(`/customers/${editCustomer.id}`, form);
        showSuccess('Customer updated successfully!');
      } else {
        await API.post('/customers', form);
        showSuccess('Customer registered successfully!');
      }
      resetForm();
      fetchCustomers();
    } catch (err) {
      showError('Failed to save customer!');
    }
  };

  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setForm({
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      vehicleNumber: customer.vehicleNumber,
      vehicleModel: customer.vehicleModel,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await API.delete(`/customers/${id}`);
      showSuccess('Customer deleted successfully!');
      fetchCustomers();
    } catch (err) {
      showError('Failed to delete customer!');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditCustomer(null);
    setForm({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      vehicleNumber: '',
      vehicleModel: '',
    });
  };

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Customers</h2>
            <p className="text-subtext">Manage all customers and vehicle details</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Add Customer
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Search by name, phone, vehicle number..."
            className="w-full bg-white border border-border rounded-xl pl-12 pr-12 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                fetchCustomers();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext hover:text-red-500 transition"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Users size={20} className="text-primary" />
                {editCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Personal Info */}
                <div className="bg-blue-50 rounded-xl p-1">
                  <p className="text-primary font-semibold text-xs uppercase tracking-wider px-3 py-2">
                    Personal Info
                  </p>
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Full Name</label>
                  <div className="relative">
                    <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                      required
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
                      placeholder="Enter phone number"
                      className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                      required
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
                      placeholder="Enter address"
                      className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-blue-50 rounded-xl p-1 mt-2">
                  <p className="text-primary font-semibold text-xs uppercase tracking-wider px-3 py-2">
                    Vehicle Info
                  </p>
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Vehicle Number</label>
                  <div className="relative">
                    <Car size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
                    <input
                      name="vehicleNumber"
                      value={form.vehicleNumber}
                      onChange={handleChange}
                      placeholder="eg. BA 1 CHA 1234"
                      className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                      required
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
                      placeholder="eg. Toyota Corolla 2020"
                      className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Plus size={16} />
                    {editCustomer ? 'Update Customer' : 'Add Customer'}
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

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, index) => {
            const avatarColors = [
              'bg-blue-100 text-blue-500',
              'bg-green-100 text-green-500',
              'bg-purple-100 text-purple-500',
              'bg-yellow-100 text-yellow-500',
              'bg-pink-100 text-pink-500',
            ];
            const color = avatarColors[index % avatarColors.length];

            return (
              <div key={customer.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition">

                {/* Customer Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${color}`}>
                    {customer.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-semibold">{customer.fullName}</h3>
                    <span className="text-primary text-xs bg-blue-50 px-2 py-0.5 rounded-full">
                      ID: #{customer.id}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-subtext text-sm">
                    <Mail size={14} className="text-primary shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-subtext text-sm">
                    <Phone size={14} className="text-primary shrink-0" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-subtext text-sm">
                    <MapPin size={14} className="text-primary shrink-0" />
                    {customer.address}
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-gray-50 border border-border rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Car size={14} className="text-primary" />
                    <span className="text-gray-800 text-sm font-semibold">Vehicle Info</span>
                  </div>
                  <p className="text-subtext text-sm">{customer.vehicleModel}</p>
                  <p className="text-primary text-sm font-mono font-semibold">
                    {customer.vehicleNumber}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="flex-1 bg-gray-50 border border-border text-gray-600 py-2 rounded-xl text-sm hover:border-primary hover:text-primary transition flex items-center justify-center gap-1"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl text-sm hover:bg-red-100 transition flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          {customers.length === 0 && (
            <div className="col-span-3 text-center py-20 bg-white rounded-2xl border border-border">
              <Users size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 font-semibold">No customers found!</p>
              <p className="text-subtext text-sm mt-1">Add your first customer.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}