import { useState, useEffect } from 'react';
import { Plus, CalendarCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    appointmentDate: '',
    serviceType: '',
    notes: '',
  });

  // eslint-disable-next-line
  useEffect(() => {
    fetchCustomerId();
  }, []);

  const fetchCustomerId = async () => {
    try {
      const email = localStorage.getItem('email');
      const res = await API.get(`/customers/by-email/${email}`);
      setCustomerId(res.data.id);
      fetchAppointments(res.data.id);
    } catch (err) {
      console.error('Customer not found:', err);
    }
  };

  const fetchAppointments = async (id) => {
    try {
      const res = await API.get(`/appointments/customer/${id}`);
      setAppointments(res.data);
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
      const appointmentDate = new Date(form.appointmentDate).toISOString();
      await API.post('/appointments', {
        customerId: parseInt(customerId),
        appointmentDate: appointmentDate,
        serviceType: form.serviceType,
        notes: form.notes,
        status: "Pending"
      });
      showSuccess('Appointment booked successfully!');
      resetForm();
      fetchAppointments(customerId);
    } catch (err) {
      showError('Failed to book appointment!');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setForm({
      appointmentDate: '',
      serviceType: '',
      notes: '',
    });
  };

  const services = [
    'Oil Change',
    'Brake Service',
    'Engine Check',
    'Tire Replacement',
    'General Service',
    'Battery Replacement',
    'AC Service',
    'Other'
  ];

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">My Appointments</h2>
            <p className="text-subtext">Book and manage your service appointments</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Book Appointment
          </button>
        </div>

        {/* No Customer Found */}
        {!customerId && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 mb-6 flex items-start gap-3">
            <XCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Customer profile not found!</p>
              <p className="text-sm mt-1 text-red-400">
                Please ask staff to register you as a customer first.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        {customerId && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-subtext text-sm">Total</p>
              <p className="text-gray-800 font-bold text-2xl">{appointments.length}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
              <p className="text-subtext text-sm">Pending</p>
              <p className="text-yellow-600 font-bold text-2xl">
                {appointments.filter(a => a.status === 'Pending').length}
              </p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
              <p className="text-subtext text-sm">Completed</p>
              <p className="text-green-600 font-bold text-2xl">
                {appointments.filter(a => a.status === 'Completed').length}
              </p>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && customerId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CalendarCheck size={20} className="text-primary" />
                Book New Appointment
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Appointment Date & Time
                  </label>
                  <input
                    name="appointmentDate"
                    type="datetime-local"
                    value={form.appointmentDate}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Service Type
                  </label>
                  <select
                    name="serviceType"
                    value={form.serviceType}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  >
                    <option value="">Select Service</option>
                    {services.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Any additional notes..."
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
                    Book Appointment
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

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map(appointment => (
            <div key={appointment.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl
                    ${appointment.status === 'Completed'
                      ? 'bg-green-50'
                      : appointment.status === 'Cancelled'
                      ? 'bg-red-50'
                      : 'bg-blue-50'}`}>
                    <CalendarCheck size={20} className={
                      appointment.status === 'Completed'
                        ? 'text-green-500'
                        : appointment.status === 'Cancelled'
                        ? 'text-red-500'
                        : 'text-primary'
                    } />
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-semibold">{appointment.serviceType}</h3>
                    <p className="text-subtext text-xs">#{appointment.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                  ${appointment.status === 'Completed'
                    ? 'bg-green-100 text-green-600'
                    : appointment.status === 'Cancelled'
                    ? 'bg-red-100 text-red-500'
                    : 'bg-yellow-100 text-yellow-600'}`}>
                  {appointment.status === 'Completed'
                    ? <CheckCircle size={12} />
                    : appointment.status === 'Cancelled'
                    ? <XCircle size={12} />
                    : <Clock size={12} />}
                  {appointment.status}
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-2 text-subtext text-sm">
                  <Clock size={14} className="text-primary shrink-0" />
                  {new Date(appointment.appointmentDate).toLocaleString()}
                </div>
                {appointment.notes && (
                  <p className="text-subtext text-sm italic">
                    "{appointment.notes}"
                  </p>
                )}
              </div>
            </div>
          ))}

          {appointments.length === 0 && (
            <div className="col-span-3 text-center py-20 bg-white rounded-2xl border border-border">
              <CalendarCheck size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 font-semibold">No appointments yet!</p>
              <p className="text-subtext text-sm mt-1">
                Book your first service appointment.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}