import { useEffect, useState } from 'react';
import {
  Users, ShoppingCart, CalendarCheck,
  ClipboardList, Clock, CheckCircle, XCircle,
  Package, User, AlertTriangle
} from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    appointments: 0,
    partRequests: 0,
    pendingAppointments: 0,
    pendingRequests: 0,
    unpaidCredits: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [customers, orders, appointments, partRequests] = await Promise.all([
        API.get('/customers'),
        API.get('/orders'),
        API.get('/appointments'),
        API.get('/partrequests'),
      ]);

      setStats({
        customers: customers.data.length,
        orders: orders.data.length,
        appointments: appointments.data.length,
        partRequests: partRequests.data.length,
        pendingAppointments: appointments.data.filter(a => a.status === 'Pending').length,
        pendingRequests: partRequests.data.filter(r => r.status === 'Pending').length,
        unpaidCredits: orders.data.filter(o => o.isCreditSale && !o.isCreditPaid).length,
      });

      setRecentAppointments(appointments.data.slice(-3).reverse());
      setRecentRequests(partRequests.data.slice(-3).reverse());
      setRecentOrders(orders.data.slice(-3).reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const statCards = [
    {
      label: 'Total Customers',
      value: stats.customers,
      Icon: Users,
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-600',
      path: '/customers'
    },
    {
      label: 'Total Orders',
      value: stats.orders,
      Icon: ShoppingCart,
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-600',
      path: '/orders'
    },
    {
      label: 'Appointments',
      value: stats.appointments,
      Icon: CalendarCheck,
      bg: 'bg-cyan-50',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-500',
      textColor: 'text-cyan-600',
      path: '/appointments'
    },
    {
      label: 'Part Requests',
      value: stats.partRequests,
      Icon: ClipboardList,
      bg: 'bg-pink-50',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-500',
      textColor: 'text-pink-600',
      path: '/all-part-requests'
    },
  ];

  const alertCards = [
    {
      label: 'Pending Appointments',
      value: stats.pendingAppointments,
      Icon: Clock,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      iconColor: 'text-yellow-500',
      valueColor: 'text-yellow-600',
      path: '/appointments'
    },
    {
      label: 'Pending Part Requests',
      value: stats.pendingRequests,
      Icon: Package,
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      iconColor: 'text-pink-500',
      valueColor: 'text-pink-600',
      path: '/all-part-requests'
    },
    {
      label: 'Unpaid Credits',
      value: stats.unpaidCredits,
      Icon: AlertTriangle,
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconColor: 'text-red-500',
      valueColor: 'text-red-600',
      path: '/orders'
    },
  ];

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Staff Dashboard</h2>
          <p className="text-subtext">Welcome back! Here is today's overview.</p>
        </div>

        {/* Main Stats */}
        <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-4">
          Overview
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <div
              key={i}
              onClick={() => navigate(card.path)}
              className={`${card.bg} rounded-2xl p-5 cursor-pointer hover:shadow-md transition`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.iconBg} p-2 rounded-xl`}>
                  <card.Icon size={18} className={card.iconColor} />
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-800">{card.value}</p>
              <p className={`text-sm mt-1 font-medium ${card.textColor}`}>{card.label}</p>
              <p className={`text-xs mt-2 ${card.textColor}`}>Click to view →</p>
            </div>
          ))}
        </div>

        {/* Alert Cards */}
        <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-4">
          Needs Attention
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {alertCards.map((card, i) => (
            <div
              key={i}
              onClick={() => navigate(card.path)}
              className={`${card.bg} border ${card.border} rounded-2xl p-5 cursor-pointer hover:shadow-md transition`}
            >
              <div className="flex items-center gap-3">
                <card.Icon size={24} className={card.iconColor} />
                <div>
                  <p className={`text-2xl font-bold ${card.valueColor}`}>{card.value}</p>
                  <p className="text-gray-600 text-sm">{card.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Orders */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gray-50">
              <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                <ShoppingCart size={16} className="text-primary" />
                Recent Orders
              </h3>
              <button
                onClick={() => navigate('/orders')}
                className="text-primary text-sm hover:underline font-medium"
              >
                View All →
              </button>
            </div>
            <div className="p-4 space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="bg-gray-50 border border-border rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 p-1 rounded-lg">
                        <User size={12} className="text-primary" />
                      </div>
                      <span className="text-gray-800 text-sm font-medium">
                        {order.customer?.fullName}
                      </span>
                    </div>
                    <span className="text-primary font-bold text-sm">
                      Rs. {order.finalAmount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                      ${order.isCreditSale
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-green-100 text-green-600'}`}>
                      {order.isCreditSale ? 'Credit' : 'Cash'}
                    </span>
                    <span className="text-subtext text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <div className="text-center py-6">
                  <ShoppingCart size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-subtext text-sm">No orders yet!</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gray-50">
              <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                <CalendarCheck size={16} className="text-primary" />
                Recent Appointments
              </h3>
              <button
                onClick={() => navigate('/appointments')}
                className="text-primary text-sm hover:underline font-medium"
              >
                View All →
              </button>
            </div>
            <div className="p-4 space-y-3">
              {recentAppointments.map(appointment => (
                <div key={appointment.id} className="bg-gray-50 border border-border rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 p-1 rounded-lg">
                        <User size={12} className="text-primary" />
                      </div>
                      <span className="text-gray-800 text-sm font-medium">
                        {appointment.customer?.fullName}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1
                      ${appointment.status === 'Completed'
                        ? 'bg-green-100 text-green-600'
                        : appointment.status === 'Cancelled'
                        ? 'bg-red-100 text-red-500'
                        : 'bg-yellow-100 text-yellow-600'}`}>
                      {appointment.status === 'Completed'
                        ? <CheckCircle size={10} />
                        : appointment.status === 'Cancelled'
                        ? <XCircle size={10} />
                        : <Clock size={10} />}
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-subtext text-xs mt-1">{appointment.serviceType}</p>
                  <p className="text-subtext text-xs">
                    {new Date(appointment.appointmentDate).toLocaleString()}
                  </p>
                </div>
              ))}
              {recentAppointments.length === 0 && (
                <div className="text-center py-6">
                  <CalendarCheck size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-subtext text-sm">No appointments yet!</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Part Requests */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gray-50">
              <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                <ClipboardList size={16} className="text-primary" />
                Recent Part Requests
              </h3>
              <button
                onClick={() => navigate('/all-part-requests')}
                className="text-primary text-sm hover:underline font-medium"
              >
                View All →
              </button>
            </div>
            <div className="p-4 space-y-3">
              {recentRequests.map(request => (
                <div key={request.id} className="bg-gray-50 border border-border rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 p-1 rounded-lg">
                        <Package size={12} className="text-primary" />
                      </div>
                      <span className="text-gray-800 text-sm font-medium">
                        {request.partName}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1
                      ${request.status === 'Completed'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'}`}>
                      {request.status === 'Completed'
                        ? <CheckCircle size={10} />
                        : <Clock size={10} />}
                      {request.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <User size={10} className="text-subtext" />
                    <p className="text-subtext text-xs">
                      {request.customer?.fullName}
                    </p>
                  </div>
                  <p className="text-subtext text-xs mt-0.5 line-clamp-1">
                    {request.description}
                  </p>
                </div>
              ))}
              {recentRequests.length === 0 && (
                <div className="text-center py-6">
                  <ClipboardList size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-subtext text-sm">No requests yet!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}