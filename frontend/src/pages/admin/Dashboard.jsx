import { useEffect, useState } from 'react';
import {
  Users, Package, ShoppingCart, Truck,
  AlertTriangle, CalendarCheck, Star,
  ClipboardList, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, LineChart, Line, Legend
} from 'recharts';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#e63946'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    suppliers: 0,
    lowStock: 0,
    appointments: 0,
    reviews: 0,
    partRequests: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [customers, products, orders, suppliers, lowStock, appointments, reviews, partRequests, categories] = await Promise.all([
        API.get('/customers'),
        API.get('/products'),
        API.get('/orders'),
        API.get('/suppliers'),
        API.get('/products/low-stock'),
        API.get('/appointments'),
        API.get('/reviews'),
        API.get('/partrequests'),
        API.get('/categories'),
      ]);

      setStats({
        customers: customers.data.length,
        products: products.data.length,
        orders: orders.data.length,
        suppliers: suppliers.data.length,
        lowStock: lowStock.data.length,
        appointments: appointments.data.length,
        reviews: reviews.data.length,
        partRequests: partRequests.data.length,
      });

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthly = months.map((month, i) => {
        const monthOrders = orders.data.filter(o =>
          new Date(o.createdAt).getMonth() === i
        );
        return {
          month,
          revenue: monthOrders.reduce((sum, o) => sum + o.finalAmount, 0),
          orders: monthOrders.length,
        };
      });
      setMonthlyData(monthly);

      const catData = categories.data.map(cat => ({
        name: cat.name,
        value: products.data.filter(p => p.categoryId === cat.id).length,
      })).filter(c => c.value > 0);
      setCategoryData(catData);

      setRecentOrders(orders.data.slice(-5).reverse());

    } catch (err) {
      console.error(err);
    }
  };

  const mainCards = [
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
      label: 'Total Products',
      value: stats.products,
      Icon: Package,
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
      textColor: 'text-green-600',
      path: '/products'
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
      label: 'Total Suppliers',
      value: stats.suppliers,
      Icon: Truck,
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      textColor: 'text-purple-600',
      path: '/suppliers'
    },
    {
      label: 'Low Stock Items',
      value: stats.lowStock,
      Icon: AlertTriangle,
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      textColor: 'text-red-600',
      path: '/products'
    },
  ];

  const activityCards = [
    {
      label: 'Appointments',
      value: stats.appointments,
      Icon: CalendarCheck,
      bg: 'bg-cyan-50',
      iconColor: 'text-cyan-500',
      path: '/appointments',
    },
    {
      label: 'Reviews',
      value: stats.reviews,
      Icon: Star,
      bg: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
      path: '/all-reviews',
    },
    {
      label: 'Part Requests',
      value: stats.partRequests,
      Icon: ClipboardList,
      bg: 'bg-pink-50',
      iconColor: 'text-pink-500',
      path: '/all-part-requests',
    },
    {
      label: 'Reports',
      value: null,
      Icon: TrendingUp,
      bg: 'bg-green-50',
      iconColor: 'text-green-500',
      path: '/reports',
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border rounded-xl p-3 shadow-lg">
          <p className="text-gray-800 font-semibold text-sm">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }} className="text-sm">
              {p.name}: {p.name === 'revenue' ? `Rs. ${p.value}` : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-subtext mt-1">Welcome back! Here's your business overview.</p>
        </div>

        {/* Main Stats */}
        <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-4">
          Overview
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {mainCards.map((card, i) => (
            <div
              key={i}
              onClick={() => navigate(card.path)}
              className={`${card.bg} rounded-2xl p-5 cursor-pointer hover:shadow-md transition`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.iconBg} p-2 rounded-xl`}>
                  <card.Icon size={20} className={card.iconColor} />
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-800">{card.value}</p>
              <p className={`text-sm mt-1 ${card.textColor} font-medium`}>{card.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-4">
          Analytics
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Monthly Revenue Bar Chart */}
          <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-gray-800 font-semibold mb-6 flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Monthly Revenue
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pie Chart */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-gray-800 font-semibold mb-6 flex items-center gap-2">
              <Package size={16} className="text-primary" />
              Products by Category
            </h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      color: '#1e293b'
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: '#64748b', fontSize: '12px' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-subtext text-sm">No category data yet!</p>
              </div>
            )}
          </div>
        </div>

        {/* Orders Line Chart */}
        <div className="bg-white border border-border rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-gray-800 font-semibold mb-6 flex items-center gap-2">
            <ShoppingCart size={16} className="text-primary" />
            Monthly Orders Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="orders"
                name="orders"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Access + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Quick Access */}
          <div>
            <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-4">
              Quick Access
            </p>
            <div className="grid grid-cols-2 gap-4">
              {activityCards.map((card, i) => (
                <div
                  key={i}
                  onClick={() => navigate(card.path)}
                  className={`${card.bg} rounded-2xl p-5 cursor-pointer hover:shadow-md transition`}
                >
                  <card.Icon size={20} className={`${card.iconColor} mb-3`} />
                  <p className="text-gray-800 text-sm font-semibold">{card.label}</p>
                  {card.value !== null && (
                    <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                  )}
                  <p className={`text-xs mt-2 ${card.iconColor}`}>
                    Click to view →
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-4">
              Recent Orders
            </p>
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="text-left text-subtext text-xs px-4 py-3 font-semibold">Customer</th>
                    <th className="text-left text-subtext text-xs px-4 py-3 font-semibold">Amount</th>
                    <th className="text-left text-subtext text-xs px-4 py-3 font-semibold">Type</th>
                    <th className="text-left text-subtext text-xs px-4 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-border hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-800 text-sm font-medium">
                        {order.customer?.fullName}
                      </td>
                      <td className="px-4 py-3 text-primary text-sm font-semibold">
                        Rs. {order.finalAmount}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${order.isCreditSale
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-green-100 text-green-600'}`}>
                          {order.isCreditSale ? 'Credit' : 'Cash'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-subtext text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-subtext py-8 text-sm">
                        No orders yet!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}