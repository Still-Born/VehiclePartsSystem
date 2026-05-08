import { useState, useEffect } from 'react';
import { Plus, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';

export default function PartRequests() {
  const [requests, setRequests] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    partName: '',
    description: '',
  });

  useEffect(() => {
    fetchCustomerId();
  // eslint-disable-next-line
  }, []);

  const fetchCustomerId = async () => {
    try {
      const email = localStorage.getItem('email');
      const res = await API.get(`/customers/by-email/${email}`);
      setCustomerId(res.data.id);
      fetchRequests(res.data.id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async (id) => {
    try {
      const res = await API.get(`/partrequests/customer/${id}`);
      setRequests(res.data);
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
      await API.post('/partrequests', {
        customerId: parseInt(customerId),
        partName: form.partName,
        description: form.description,
        status: "Pending"
      });
      showSuccess('Part request submitted successfully!');
      resetForm();
      fetchRequests(customerId);
    } catch (err) {
      showError('Failed to submit request!');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setForm({ partName: '', description: '' });
  };

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Part Requests</h2>
            <p className="text-subtext">Request unavailable vehicle parts</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Request Part
          </button>
        </div>

        {/* No Customer Found */}
        {!customerId && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 mb-6 flex items-start gap-3">
            <XCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Customer profile not found!</p>
              <p className="text-sm mt-1 text-red-400">
                Please ask staff to register you first.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        {customerId && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-subtext text-sm">Total Requests</p>
              <p className="text-gray-800 font-bold text-2xl">{requests.length}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
              <p className="text-subtext text-sm">Pending</p>
              <p className="text-yellow-600 font-bold text-2xl">
                {requests.filter(r => r.status === 'Pending').length}
              </p>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && customerId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package size={20} className="text-primary" />
                Request Unavailable Part
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Part Name
                  </label>
                  <input
                    name="partName"
                    value={form.partName}
                    onChange={handleChange}
                    placeholder="Enter part name"
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the part you need..."
                    rows={3}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Plus size={16} />
                    Submit Request
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

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(request => (
            <div key={request.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${request.status === 'Completed' ? 'bg-green-50' : 'bg-blue-50'}`}>
                    <Package size={20} className={request.status === 'Completed' ? 'text-green-500' : 'text-primary'} />
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-semibold">{request.partName}</h3>
                    <p className="text-subtext text-xs">#{request.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                  ${request.status === 'Completed'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'}`}>
                  {request.status === 'Completed'
                    ? <CheckCircle size={12} />
                    : <Clock size={12} />}
                  {request.status}
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                {request.description && (
                  <p className="text-subtext text-sm italic mb-2">
                    "{request.description}"
                  </p>
                )}
                <p className="text-subtext text-xs">
                  📅 {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="col-span-3 text-center py-20 bg-white rounded-2xl border border-border">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 font-semibold">No part requests yet!</p>
              <p className="text-subtext text-sm mt-1">
                Request a part that is unavailable in our store.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}