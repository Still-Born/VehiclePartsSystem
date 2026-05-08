import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, User } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';

export default function AllPartRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get('/partrequests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/partrequests/${id}/status?status=${status}`);
      showSuccess('Part request marked as completed!');
      fetchRequests();
    } catch (err) {
      showError('Failed to update status!');
    }
  };

  const filtered = filter === 'All'
    ? requests
    : requests.filter(r => r.status === filter);

  const counts = {
    All: requests.length,
    Pending: requests.filter(r => r.status === 'Pending').length,
    Completed: requests.filter(r => r.status === 'Completed').length,
  };

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">All Part Requests</h2>
          <p className="text-subtext">Manage all customer part requests</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['All', 'Pending', 'Completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2
                ${filter === tab
                  ? tab === 'Completed'
                    ? 'bg-green-100 text-green-600'
                    : tab === 'Pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-primary text-white'
                  : 'bg-white border border-border text-subtext hover:border-primary'}`}
            >
              {tab}
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-white bg-opacity-30">
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(request => (
            <div key={request.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition">

              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl
                    ${request.status === 'Completed'
                      ? 'bg-green-50'
                      : 'bg-blue-50'}`}>
                    <Package size={20} className={
                      request.status === 'Completed'
                        ? 'text-green-500'
                        : 'text-primary'
                    } />
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

              {/* Details */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <User size={14} className="text-primary shrink-0" />
                  <span className="text-gray-800 font-medium">
                    {request.customer?.fullName}
                  </span>
                </div>
                {request.description && (
                  <p className="text-subtext text-sm italic">
                    "{request.description}"
                  </p>
                )}
                <p className="text-subtext text-xs">
                  📅 {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Action Button */}
              {request.status === 'Pending' ? (
                <button
                  onClick={() => handleStatusUpdate(request.id, 'Completed')}
                  className="w-full bg-green-50 text-green-600 py-2.5 rounded-xl text-sm hover:bg-green-100 transition flex items-center justify-center gap-2 font-medium"
                >
                  <CheckCircle size={14} />
                  Mark as Completed
                </button>
              ) : (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle size={16} />
                  <span>Request Fulfilled</span>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-20 bg-white rounded-2xl border border-border">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 font-semibold">No part requests found!</p>
              <p className="text-subtext text-sm mt-1">
                {filter !== 'All' ? `No ${filter} requests` : 'No requests yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}