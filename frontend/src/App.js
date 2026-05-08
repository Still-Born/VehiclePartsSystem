import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Suppliers from './pages/admin/Suppliers';
import StaffManagement from './pages/admin/StaffManagement';
import Reports from './pages/admin/Reports';
import AllAppointments from './pages/admin/AllAppointments';
import AllReviews from './pages/admin/AllReviews';
import AllPartRequests from './pages/admin/AllPartRequests';
import PurchaseInvoices from './pages/admin/PurchaseInvoices';

// Staff Pages
import Customers from './pages/staff/Customers';
import Orders from './pages/staff/Orders';
import StaffDashboard from './pages/staff/StaffDashboard';

// Customer Pages
import MyAppointments from './pages/customer/MyAppointments';
import MyOrders from './pages/customer/MyOrders';
import PartRequests from './pages/customer/PartRequests';
import Reviews from './pages/customer/Reviews';
import Profile from './pages/customer/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Only */}
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['Admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute roles={['Admin']}>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute roles={['Admin']}>
            <Categories />
          </ProtectedRoute>
        } />
        <Route path="/suppliers" element={
          <ProtectedRoute roles={['Admin']}>
            <Suppliers />
          </ProtectedRoute>
        } />
        <Route path="/staff" element={
          <ProtectedRoute roles={['Admin']}>
            <StaffManagement />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute roles={['Admin']}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/purchase-invoices" element={
          <ProtectedRoute roles={['Admin']}>
            <PurchaseInvoices />
          </ProtectedRoute>
        } />
        <Route path="/all-reviews" element={
          <ProtectedRoute roles={['Admin']}>
            <AllReviews />
          </ProtectedRoute>
        } />

        {/* Admin + Staff */}
        <Route path="/appointments" element={
          <ProtectedRoute roles={['Admin', 'Staff']}>
            <AllAppointments />
          </ProtectedRoute>
        } />
        <Route path="/all-part-requests" element={
          <ProtectedRoute roles={['Admin', 'Staff']}>
            <AllPartRequests />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute roles={['Admin', 'Staff']}>
            <Orders />
          </ProtectedRoute>
        } />

        {/* Staff Only */}
        <Route path="/staff-dashboard" element={
          <ProtectedRoute roles={['Staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path="/customers" element={
          <ProtectedRoute roles={['Staff', 'Admin']}>
            <Customers />
          </ProtectedRoute>
        } />

        {/* Customer Only */}
        <Route path="/my-appointments" element={
          <ProtectedRoute roles={['Customer']}>
            <MyAppointments />
          </ProtectedRoute>
        } />
        <Route path="/my-orders" element={
          <ProtectedRoute roles={['Customer']}>
            <MyOrders />
          </ProtectedRoute>
        } />
        <Route path="/part-requests" element={
          <ProtectedRoute roles={['Customer']}>
            <PartRequests />
          </ProtectedRoute>
        } />
        <Route path="/reviews" element={
          <ProtectedRoute roles={['Customer']}>
            <Reviews />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute roles={['Customer']}>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;