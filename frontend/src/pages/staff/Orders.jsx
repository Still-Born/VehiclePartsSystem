import { useState, useEffect } from 'react';
import { Plus, ShoppingCart, User, Package, Trash2, CheckCircle, Mail, Download } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';
import { generateInvoicePDF } from '../../services/generateInvoice';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [orderItems, setOrderItems] = useState([
    { productId: '', quantity: 1 }
  ]);
  const [form, setForm] = useState({
    customerId: '',
    isCreditSale: false,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [o, c, p] = await Promise.all([
        API.get('/orders'),
        API.get('/customers'),
        API.get('/products'),
      ]);
      setOrders(o.data);
      setCustomers(c.data);
      setProducts(p.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...orderItems];
    updated[index][field] = value;
    setOrderItems(updated);
  };

  const addItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find(p => p.id === parseInt(item.productId));
      if (product && item.quantity) {
        return total + (product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        customerId: parseInt(form.customerId),
        isCreditSale: form.isCreditSale,
        orderItems: orderItems.map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
        }))
      };
      await API.post('/orders', orderData);
      showSuccess('Order created successfully!');
      resetForm();
      fetchAll();
    } catch (err) {
      showError('Failed to create order!');
    }
  };

  const handlePayCredit = async (id) => {
    if (!window.confirm('Mark as paid?')) return;
    try {
      await API.put(`/orders/${id}/pay-credit`);
      showSuccess('Credit marked as paid!');
      fetchAll();
    } catch (err) {
      showError('Failed to update credit status!');
    }
  };

  const handleSendInvoice = async (id) => {
    try {
      await API.post(`/orders/${id}/send-invoice`);
      showSuccess('Invoice sent successfully!');
    } catch (err) {
      showError('Failed to send invoice. Check email settings!');
    }
  };

  const handleDownloadInvoice = (order) => {
    generateInvoicePDF(order);
    showSuccess('Invoice downloaded successfully!');
  };

  const resetForm = () => {
    setShowForm(false);
    setForm({ customerId: '', isCreditSale: false });
    setOrderItems([{ productId: '', quantity: 1 }]);
  };

  const total = calculateTotal();
  const discount = total > 5000 ? total * 0.10 : 0;
  const finalAmount = total - discount;

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Orders</h2>
            <p className="text-subtext">Manage sales and invoices</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            New Order
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ShoppingCart size={20} className="text-primary" />
                Create New Order
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Customer Select */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Select Customer
                  </label>
                  <select
                    value={form.customerId}
                    onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.fullName} — {c.phone}</option>
                    ))}
                  </select>
                </div>

                {/* Credit Sale */}
                <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                  <input
                    type="checkbox"
                    id="creditSale"
                    checked={form.isCreditSale}
                    onChange={(e) => setForm({ ...form, isCreditSale: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="creditSale" className="text-gray-700 text-sm font-medium">
                    Credit Sale (Customer pays later)
                  </label>
                </div>

                {/* Order Items */}
                <div className="bg-blue-50 rounded-xl p-1">
                  <p className="text-primary font-semibold text-sm uppercase tracking-wider px-3 py-2">
                    Order Items
                  </p>
                </div>

                {orderItems.map((item, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="text-gray-700 text-sm font-medium mb-2 block">Product</label>
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} — Rs. {p.price} ({p.stock} left)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-28">
                      <label className="text-gray-700 text-sm font-medium mb-2 block">Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>
                    {orderItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-100 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addItem}
                  className="w-full border border-dashed border-border text-subtext py-3 rounded-xl hover:border-primary hover:text-primary transition flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add Another Item
                </button>

                {/* Price Summary */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-subtext text-sm">
                    <span>Subtotal</span>
                    <span className="text-gray-800 font-medium">Rs. {total.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm">
                      <span>🎉 Loyalty Discount (10%)</span>
                      <span>- Rs. {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-800 font-bold text-lg border-t border-blue-200 pt-2">
                    <span>Total</span>
                    <span className="text-primary">Rs. {finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingCart size={16} />
                    Create Order
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 border border-border text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Order ID</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Customer</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Total</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Discount</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Final</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Type</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Status</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Date</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-border hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-primary font-mono font-semibold">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 p-1.5 rounded-lg">
                        <User size={14} className="text-primary" />
                      </div>
                      <span className="text-gray-800 font-medium">{order.customer?.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-subtext">Rs. {order.totalAmount}</td>
                  <td className="px-6 py-4 text-green-600 font-medium">
                    {order.discountAmount > 0 ? `- Rs. ${order.discountAmount}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-bold">
                    Rs. {order.finalAmount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${order.isCreditSale
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-green-100 text-green-600'}`}>
                      {order.isCreditSale ? 'Credit' : 'Cash'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.isCreditSale && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${order.isCreditPaid
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-500'}`}>
                        {order.isCreditPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    )}
                    {!order.isCreditSale && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                        Paid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-subtext text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="bg-blue-50 text-primary px-3 py-1.5 rounded-xl text-xs hover:bg-blue-100 transition flex items-center gap-1"
                      >
                        <Download size={12} />
                        Download PDF
                      </button>
                      <button
                        onClick={() => handleSendInvoice(order.id)}
                        className="bg-gray-50 border border-border text-gray-600 px-3 py-1.5 rounded-xl text-xs hover:border-primary hover:text-primary transition flex items-center gap-1"
                      >
                        <Mail size={12} />
                        Send Invoice
                      </button>
                      {order.isCreditSale && !order.isCreditPaid && (
                        <button
                          onClick={() => handlePayCredit(order.id)}
                          className="bg-green-50 text-green-600 px-3 py-1.5 rounded-xl text-xs hover:bg-green-100 transition flex items-center gap-1"
                        >
                          <CheckCircle size={12} />
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-20">
                    <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-subtext">No orders yet!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}