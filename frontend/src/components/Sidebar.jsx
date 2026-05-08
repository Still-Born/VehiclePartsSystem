import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Package, Tag, Truck,
  Users, ShoppingCart, BarChart2, CalendarCheck,
  ClipboardList, Star, LogOut, Wrench, FileText,
  AlertTriangle, ChevronLeft, ChevronRight, User
} from 'lucide-react';

export default function Sidebar({ lowStockCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navBtn = (path, label, Icon, badge = null) => (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition
        ${isActive(path)
          ? 'bg-primary text-white font-semibold shadow-sm'
          : 'text-subtext hover:text-gray-900 hover:bg-gray-100'}`}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && (
        <span className="flex-1 text-left">{label}</span>
      )}
      {!collapsed && badge && badge > 0 && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  const adminLinks = [
    { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { path: '/products', label: 'Products', Icon: Package, badge: lowStockCount },
    { path: '/categories', label: 'Categories', Icon: Tag },
    { path: '/suppliers', label: 'Suppliers', Icon: Truck },
    { path: '/purchase-invoices', label: 'Purchases', Icon: FileText },
    { path: '/staff', label: 'Staff', Icon: Users },
    { path: '/orders', label: 'Orders', Icon: ShoppingCart },
    { path: '/appointments', label: 'Appointments', Icon: CalendarCheck },
    { path: '/all-reviews', label: 'Reviews', Icon: Star },
    { path: '/all-part-requests', label: 'Part Requests', Icon: ClipboardList },
    { path: '/reports', label: 'Reports', Icon: BarChart2 },
  ];

  const staffLinks = [
    { path: '/staff-dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { path: '/customers', label: 'Customers', Icon: Users },
    { path: '/orders', label: 'Orders', Icon: ShoppingCart },
    { path: '/appointments', label: 'Appointments', Icon: CalendarCheck },
    { path: '/all-part-requests', label: 'Part Requests', Icon: ClipboardList },
  ];

  const customerLinks = [
    { path: '/my-appointments', label: 'Appointments', Icon: CalendarCheck },
    { path: '/my-orders', label: 'My Orders', Icon: ClipboardList },
    { path: '/part-requests', label: 'Request Part', Icon: Package },
    { path: '/reviews', label: 'Reviews', Icon: Star },
    { path: '/profile', label: 'Profile', Icon: User },
  ];

  const links = user?.role === 'Admin'
    ? adminLinks
    : user?.role === 'Staff'
    ? staffLinks
    : customerLinks;

  return (
    <div className={`min-h-screen bg-white border-r border-border flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>

      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-border">
        {!collapsed && (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Wrench size={22} className="text-primary" />
            <span className="text-lg font-bold">
              <span className="text-primary">VEHICLE</span>
              <span className="text-gray-800">PARTS</span>
            </span>
          </div>
        )}
        {collapsed && (
          <Wrench
            size={22}
            className="text-primary mx-auto cursor-pointer"
            onClick={() => navigate('/')}
          />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-subtext hover:text-gray-800 transition p-1 rounded-lg hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              <User size={18} className="text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-gray-800 text-sm font-semibold truncate">{user?.email}</p>
              <span className="bg-blue-50 text-primary text-xs px-2 py-0.5 rounded-full border border-blue-100">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-subtext text-xs uppercase tracking-wider px-4 mb-3 font-semibold">
            Menu
          </p>
        )}
        {links.map((link, i) => (
          <div key={i}>
            {navBtn(link.path, link.label, link.Icon, link.badge)}
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {!collapsed && user?.role === 'Admin' && lowStockCount > 0 && (
        <div
          onClick={() => navigate('/products')}
          className="mx-3 mb-3 bg-red-50 border border-red-200 rounded-xl p-3 cursor-pointer hover:bg-red-100 transition"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <p className="text-red-500 text-sm font-semibold">
              {lowStockCount} Low Stock!
            </p>
          </div>
          <p className="text-red-400 text-xs mt-1">Click to view products</p>
        </div>
      )}

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-subtext hover:text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}