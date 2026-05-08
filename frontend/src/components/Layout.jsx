import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user } = useAuth();
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchLowStock();
    }
  }, [user]);

  const fetchLowStock = async () => {
    try {
      const res = await API.get('/products/low-stock');
      setLowStockCount(res.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Fixed */}
      <div className="flex-shrink-0 h-screen overflow-y-auto">
        <Sidebar lowStockCount={lowStockCount} />
      </div>
      {/* Main Content - Scrollable */}
      <div className="flex-1 h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}