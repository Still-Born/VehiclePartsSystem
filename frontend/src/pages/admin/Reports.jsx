import { useState } from 'react';
import { BarChart2, Calendar, TrendingUp, Users, DollarSign, ShoppingCart, AlertTriangle } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('daily');
  const [reportData, setReportData] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [regularCustomers, setRegularCustomers] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dailyDate, setDailyDate] = useState('');
  const [monthlyYear, setMonthlyYear] = useState('');
  const [monthlyMonth, setMonthlyMonth] = useState('');
  const [yearlyYear, setYearlyYear] = useState('');

  const fetchDaily = async () => {
    if (!dailyDate) return;
    setLoading(true);
    try {
      const formattedDate = new Date(dailyDate).toISOString().split('T')[0];
      const res = await API.get(`/reports/daily?date=${formattedDate}`);
      setReportData(res.data);
    } catch (err) {
      console.error('Daily report error:', err.response?.data);
    }
    setLoading(false);
  };

  const fetchMonthly = async () => {
    if (!monthlyYear || !monthlyMonth) return;
    setLoading(true);
    try {
      const res = await API.get(`/reports/monthly?year=${monthlyYear}&month=${monthlyMonth}`);
      setReportData(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchYearly = async () => {
    if (!yearlyYear) return;
    setLoading(true);
    try {
      const res = await API.get(`/reports/yearly?year=${yearlyYear}`);
      setReportData(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchCustomerReports = async () => {
    setLoading(true);
    try {
      const [top, regular, stock] = await Promise.all([
        API.get('/reports/top-customers'),
        API.get('/reports/regular-customers'),
        API.get('/reports/low-stock'),
      ]);
      setTopCustomers(top.data);
      setRegularCustomers(regular.data);
      setLowStock(stock.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'daily', label: 'Daily', icon: Calendar },
    { id: 'monthly', label: 'Monthly', icon: BarChart2 },
    { id: 'yearly', label: 'Yearly', icon: TrendingUp },
    { id: 'customers', label: 'Customer Reports', icon: Users },
  ];

  const ReportCards = ({ data, label }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-50 p-2 rounded-xl">
            <Calendar size={18} className="text-primary" />
          </div>
          <p className="text-subtext text-sm font-medium">{label}</p>
        </div>
        <p className="text-gray-800 text-2xl font-bold">
          {data.date
            ? new Date(data.date).toLocaleDateString()
            : data.month
            ? `${data.month}/${data.year}`
            : data.year}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-100 p-2 rounded-xl">
            <ShoppingCart size={18} className="text-primary" />
          </div>
          <p className="text-subtext text-sm font-medium">Total Orders</p>
        </div>
        <p className="text-gray-800 text-4xl font-bold">{data.totalOrders}</p>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-green-100 p-2 rounded-xl">
            <DollarSign size={18} className="text-green-500" />
          </div>
          <p className="text-subtext text-sm font-medium">Total Revenue</p>
        </div>
        <p className="text-green-600 text-4xl font-bold">
          Rs. {data.totalRevenue}
        </p>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Reports</h2>
          <p className="text-subtext">View financial and customer reports</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white border border-border rounded-2xl p-2 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setReportData(null);
                if (tab.id === 'customers') fetchCustomerReports();
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition text-sm
                ${activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-subtext hover:text-gray-800'}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daily Report */}
        {activeTab === 'daily' && (
          <div className="space-y-6">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-800 font-semibold mb-4">Select Date</h3>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={dailyDate}
                  onChange={(e) => setDailyDate(e.target.value)}
                  className="bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                />
                <button
                  onClick={fetchDaily}
                  disabled={loading}
                  className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <BarChart2 size={16} />
                  {loading ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </div>
            {reportData && <ReportCards data={reportData} label="Date" />}
          </div>
        )}

        {/* Monthly Report */}
        {activeTab === 'monthly' && (
          <div className="space-y-6">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-800 font-semibold mb-4">Select Month</h3>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Year eg. 2026"
                  value={monthlyYear}
                  onChange={(e) => setMonthlyYear(e.target.value)}
                  className="bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 w-40"
                />
                <select
                  value={monthlyMonth}
                  onChange={(e) => setMonthlyMonth(e.target.value)}
                  className="bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Month</option>
                  {['January','February','March','April','May','June',
                    'July','August','September','October','November','December']
                    .map((m, i) => (
                      <option key={i} value={i + 1}>{m}</option>
                    ))}
                </select>
                <button
                  onClick={fetchMonthly}
                  disabled={loading}
                  className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <BarChart2 size={16} />
                  {loading ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </div>
            {reportData && <ReportCards data={reportData} label="Period" />}
          </div>
        )}

        {/* Yearly Report */}
        {activeTab === 'yearly' && (
          <div className="space-y-6">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-800 font-semibold mb-4">Select Year</h3>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Year eg. 2026"
                  value={yearlyYear}
                  onChange={(e) => setYearlyYear(e.target.value)}
                  className="bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 w-40"
                />
                <button
                  onClick={fetchYearly}
                  disabled={loading}
                  className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <BarChart2 size={16} />
                  {loading ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </div>
            {reportData && <ReportCards data={reportData} label="Year" />}
          </div>
        )}

        {/* Customer Reports */}
        {activeTab === 'customers' && (
          <div className="space-y-6">

            {/* Top Customers */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border bg-gray-50">
                <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" />
                  Top Spenders
                </h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-subtext text-xs font-semibold px-6 py-3">#</th>
                    <th className="text-left text-subtext text-xs font-semibold px-6 py-3">Customer</th>
                    <th className="text-left text-subtext text-xs font-semibold px-6 py-3">Total Orders</th>
                    <th className="text-left text-subtext text-xs font-semibold px-6 py-3">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((c, i) => (
                    <tr key={i} className="border-b border-border hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-subtext text-sm">{i + 1}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{c.customerName}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-primary text-xs px-2 py-1 rounded-full font-medium">
                          {c.totalOrders} orders
                        </span>
                      </td>
                      <td className="px-6 py-4 text-green-600 font-bold">
                        Rs. {c.totalSpent}
                      </td>
                    </tr>
                  ))}
                  {topCustomers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-subtext py-8">No data yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Regular Customers */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border bg-gray-50">
                <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                  <Users size={16} className="text-primary" />
                  Regular Customers (3+ orders)
                </h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-subtext text-xs font-semibold px-6 py-3">#</th>
                    <th className="text-left text-subtext text-xs font-semibold px-6 py-3">Customer</th>
                    <th className="text-left text-subtext text-xs font-semibold px-6 py-3">Total Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {regularCustomers.map((c, i) => (
                    <tr key={i} className="border-b border-border hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-subtext text-sm">{i + 1}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{c.customerName}</td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                          {c.totalOrders} orders
                        </span>
                      </td>
                    </tr>
                  ))}
                  {regularCustomers.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center text-subtext py-8">No regular customers yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Low Stock */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border bg-gray-50">
                <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-500" />
                  Low Stock Items (less than 10)
                </h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-subtext text-xs font-semibold px-6 py-3">Product</th>
                    <th className="text-left text-subtext text-xs font-semibold px-6 py-3">Stock</th>
                    <th className="text-left text-subtext text-xs font-semibold px-6 py-3">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((p, i) => (
                    <tr key={i} className="border-b border-border hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800 font-medium">{p.name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                          <AlertTriangle size={10} />
                          {p.stock} left
                        </span>
                      </td>
                      <td className="px-6 py-4 text-subtext">Rs. {p.price}</td>
                    </tr>
                  ))}
                  {lowStock.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center text-subtext py-8">
                        All products have sufficient stock!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}