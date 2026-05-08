import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Truck, Mail, Phone, MapPin } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await API.get('/suppliers');
      setSuppliers(res.data);
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
      if (editSupplier) {
        await API.put(`/suppliers/${editSupplier.id}`, form);
        showSuccess('Supplier updated successfully!');
      } else {
        await API.post('/suppliers', form);
        showSuccess('Supplier added successfully!');
      }
      resetForm();
      fetchSuppliers();
    } catch (err) {
      showError('Failed to save supplier!');
    }
  };

  const handleEdit = (supplier) => {
    setEditSupplier(supplier);
    setForm({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await API.delete(`/suppliers/${id}`);
      showSuccess('Supplier deleted successfully!');
      fetchSuppliers();
    } catch (err) {
      showError('Failed to delete supplier!');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditSupplier(null);
    setForm({ name: '', email: '', phone: '', address: '' });
  };

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Suppliers</h2>
            <p className="text-subtext">Manage your vendors and suppliers</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Add Supplier
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Truck size={20} className="text-primary" />
                {editSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Supplier Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter supplier name"
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

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
                      placeholder="Enter email"
                      className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Phone
                  </label>
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
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-3 text-subtext" />
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                      rows={3}
                      className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Plus size={16} />
                    {editSupplier ? 'Update Supplier' : 'Add Supplier'}
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

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map(supplier => (
            <div key={supplier.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition">

              {/* Supplier Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Truck size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-gray-800 font-semibold text-lg">{supplier.name}</h3>
                  <span className="text-xs text-subtext">Supplier</span>
                </div>
              </div>

              {/* Supplier Details */}
              <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-subtext text-sm">
                  <Mail size={14} className="text-primary shrink-0" />
                  <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-subtext text-sm">
                  <Phone size={14} className="text-primary shrink-0" />
                  {supplier.phone}
                </div>
                <div className="flex items-center gap-2 text-subtext text-sm">
                  <MapPin size={14} className="text-primary shrink-0" />
                  {supplier.address}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => handleEdit(supplier)}
                  className="flex-1 bg-gray-50 border border-border text-gray-600 py-2 rounded-xl text-sm hover:border-primary hover:text-primary transition flex items-center justify-center gap-1"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(supplier.id)}
                  className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl text-sm hover:bg-red-100 transition flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {suppliers.length === 0 && (
            <div className="col-span-3 text-center py-20">
              <Truck size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-subtext">No suppliers found. Add one!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}