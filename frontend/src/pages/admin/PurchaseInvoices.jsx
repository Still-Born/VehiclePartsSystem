import { useState, useEffect } from 'react';
import { Plus, FileText, Trash2, Truck, Package, TrendingUp } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';

export default function PurchaseInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    supplierId: '',
    productId: '',
    quantity: '',
    unitPrice: '',
    notes: '',
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [inv, sup, pro] = await Promise.all([
        API.get('/purchaseinvoices'),
        API.get('/suppliers'),
        API.get('/products'),
      ]);
      setInvoices(inv.data);
      setSuppliers(sup.data);
      setProducts(pro.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    if (form.unitPrice && form.quantity) {
      return (parseFloat(form.unitPrice) * parseInt(form.quantity)).toFixed(2);
    }
    return '0.00';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/purchaseinvoices', {
        supplierId: parseInt(form.supplierId),
        productId: parseInt(form.productId),
        quantity: parseInt(form.quantity),
        unitPrice: parseFloat(form.unitPrice),
        totalAmount: parseFloat(calculateTotal()),
        notes: form.notes,
      });
      showSuccess('Purchase Invoice created! Stock updated!');
      resetForm();
      fetchAll();
    } catch (err) {
      showError('Failed to create invoice!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await API.delete(`/purchaseinvoices/${id}`);
      showSuccess('Invoice deleted!');
      fetchAll();
    } catch (err) {
      showError('Failed to delete!');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setForm({
      supplierId: '',
      productId: '',
      quantity: '',
      unitPrice: '',
      notes: '',
    });
  };

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Purchase Invoices</h2>
            <p className="text-subtext">Manage stock purchases from suppliers</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            New Purchase
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                Create Purchase Invoice
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Supplier */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Supplier</label>
                  <select
                    name="supplierId"
                    value={form.supplierId}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Product */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Product</label>
                  <select
                    name="productId"
                    value={form.productId}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — Current Stock: {p.stock}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity + Unit Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-700 text-sm font-medium mb-2 block">Quantity</label>
                    <input
                      name="quantity"
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-medium mb-2 block">Unit Price (Rs.)</label>
                    <input
                      name="unitPrice"
                      type="number"
                      value={form.unitPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>

                {/* Total Amount */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-subtext text-sm font-medium">Total Amount</span>
                    <span className="text-primary font-bold text-2xl">
                      Rs. {calculateTotal()}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Notes</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Any additional notes..."
                    rows={3}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Plus size={16} />
                    Create Invoice
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

        {/* Invoices Table */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Invoice ID</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Supplier</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Product</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Quantity</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Unit Price</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Total</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Date</th>
                <th className="text-left text-subtext text-xs font-semibold px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id} className="border-b border-border hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-primary font-mono font-semibold">
                    #{invoice.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 p-1.5 rounded-lg">
                        <Truck size={14} className="text-primary" />
                      </div>
                      <span className="text-gray-800 font-medium">{invoice.supplier?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-50 p-1.5 rounded-lg">
                        <Package size={14} className="text-green-500" />
                      </div>
                      <span className="text-gray-800">{invoice.product?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={14} className="text-green-500" />
                      <span className="text-green-600 font-semibold">+{invoice.quantity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-subtext">Rs. {invoice.unitPrice}</td>
                  <td className="px-6 py-4 text-gray-800 font-semibold">
                    Rs. {invoice.totalAmount}
                  </td>
                  <td className="px-6 py-4 text-subtext text-sm">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="bg-red-50 text-red-500 px-3 py-1.5 rounded-xl text-sm hover:bg-red-100 transition flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-20">
                    <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-subtext">No purchase invoices yet!</p>
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