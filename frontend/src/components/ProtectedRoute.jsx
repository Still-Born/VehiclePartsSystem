import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role not allowed
  if (roles && !roles.includes(user.role)) {
    if (user.role === 'Admin') return <Navigate to="/dashboard" />;
    if (user.role === 'Staff') return <Navigate to="/staff-dashboard" />;
    if (user.role === 'Customer') return <Navigate to="/my-appointments" />;
  }

  return children;
}