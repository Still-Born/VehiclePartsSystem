import { useState, useEffect } from 'react';
import { ShoppingCart, Package, CheckCircle, XCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerId();
  // eslint-disable-next-line
  }, []);

  const fetchCustomerId = async () => {
    try {
      const email = localStorage.getItem('email');
      const res = await API.get(`/customers/by-email/${email}`);
      setCustomerId(res.data.id);
      fetchOrders(res.data.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (id) => {
    try {
      const res = await API.get(`/orders/customer/${id}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin"></div>
            <p className="text-subtext text-sm">Loading orders...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
          <p className="text-subtext">View your purchase history</p>
        </div>

        {/* No Customer Found */}
        {!customerId && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 mb-6 flex items-start gap-3">
            <XCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Customer profile not found!</p>
              <p className="text-sm mt-1 text-red-400">Please ask staff to register you first.</p>
            </div>
          </div>
        )}

        {/* Orders */}
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition">

              {/* Order Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-xl">
                    <ShoppingCart size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-semibold">Order #{order.id}</h3>
                    <p className="text-subtext text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${order.isCreditSale
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-green-100 text-green-600'}`}>
                    {order.isCreditSale ? 'Credit' : 'Cash'}
                  </span>
                  <span className="text-primary font-bold text-xl">
                    Rs. {order.finalAmount}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 border border-border rounded-xl p-4 mb-4">
                <p className="text-subtext text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Package size={14} className="text-primary" />
                  Items Purchased
                </p>
                <div className="space-y-2">
                  {order.orderItems?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-gray-800 text-sm font-medium">
                        {item.product?.name}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          x{item.quantity}
                        </span>
                        <span className="text-primary text-sm font-semibold">
                          Rs. {item.totalPrice}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <div className="space-y-1">
                  <p className="text-subtext text-sm">
                    Subtotal: <span className="text-gray-800 font-medium">Rs. {order.totalAmount}</span>
                  </p>
                  {order.discountAmount > 0 && (
                    <p className="text-green-600 text-sm flex items-center gap-1">
                      🎉 Loyalty Discount: - Rs. {order.discountAmount}
                    </p>
                  )}
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold
                  ${order.isCreditPaid || !order.isCreditSale
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-500'}`}>
                  {order.isCreditPaid || !order.isCreditSale
                    ? <CheckCircle size={16} />
                    : <XCircle size={16} />}
                  {order.isCreditPaid || !order.isCreditSale ? 'Paid' : 'Unpaid'}
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-border">
              <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 font-semibold">No orders yet!</p>
              <p className="text-subtext text-sm mt-1">Your purchase history will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}