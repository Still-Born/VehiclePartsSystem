import { useEffect, useState } from 'react';
import { CalendarCheck, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';

export default function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/appointments/${id}`, { status });
      showSuccess(`Appointment marked as ${status}!`);
      fetchAppointments();
    } catch (err) {
      showError('Failed to update status!');
    }
  };

  const filtered = filter === 'All'
    ? appointments
    : appointments.filter(a => a.status === filter);

  const counts = {
    All: appointments.length,
    Pending: appointments.filter(a => a.status === 'Pending').length,
    Completed: appointments.filter(a => a.status === 'Completed').length,
    Cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  };

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">All Appointments</h2>
          <p className="text-subtext">Manage all customer appointments</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['All', 'Pending', 'Completed', 'Cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2
                ${filter === tab
                  ? tab === 'Completed'
                    ? 'bg-green-100 text-green-600'
                    : tab === 'Cancelled'
                    ? 'bg-red-100 text-red-500'
                    : tab === 'Pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-primary text-white'
                  : 'bg-white border border-border text-subtext hover:border-primary'}`}
            >
              {tab}
              <span className={`text-xs px-1.5 py-0.5 rounded-full
                ${filter === tab ? 'bg-white bg-opacity-30' : 'bg-gray-100'}`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(appointment => (
            <div key={appointment.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition">

              {/* Card Header */}
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

              {/* Details */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-2 mb-4">
                <div className="flex items-center gap-2 text-subtext text-sm">
                  <User size={14} className="text-primary shrink-0" />
                  <span className="text-gray-800 font-medium">
                    {appointment.customer?.fullName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-subtext text-sm">
                  <Clock size={14} className="text-primary shrink-0" />
                  {new Date(appointment.appointmentDate).toLocaleString()}
                </div>
                {appointment.notes && (
                  <p className="text-subtext text-xs mt-1 italic">
                    "{appointment.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              {appointment.status === 'Pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(appointment.id, 'Completed')}
                    className="flex-1 bg-green-50 text-green-600 py-2 rounded-xl text-sm hover:bg-green-100 transition flex items-center justify-center gap-1 font-medium"
                  >
                    <CheckCircle size={14} />
                    Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(appointment.id, 'Cancelled')}
                    className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl text-sm hover:bg-red-100 transition flex items-center justify-center gap-1 font-medium"
                  >
                    <XCircle size={14} />
                    Cancel
                  </button>
                </div>
              )}

              {appointment.status === 'Completed' && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle size={16} />
                  <span>Service Completed</span>
                </div>
              )}

              {appointment.status === 'Cancelled' && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <XCircle size={16} />
                  <span>Appointment Cancelled</span>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-20 bg-white rounded-2xl border border-border">
              <CalendarCheck size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 font-semibold">No appointments found!</p>
              <p className="text-subtext text-sm mt-1">
                {filter !== 'All' ? `No ${filter} appointments` : 'No appointments yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}