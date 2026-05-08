import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';

const BASE_URL = 'http://localhost:5274';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    supplierId: '',
    image: null,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [p, c, s] = await Promise.all([
        API.get('/products'),
        API.get('/categories'),
        API.get('/suppliers'),
      ]);
      setProducts(p.data);
      setCategories(c.data);
      setSuppliers(s.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('stock', form.stock);
      formData.append('categoryId', form.categoryId);
      formData.append('supplierId', form.supplierId);
      if (form.image) formData.append('image', form.image);

      if (editProduct) {
        await API.put(`/products/${editProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showSuccess('Product updated successfully!');
      } else {
        await API.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showSuccess('Product added successfully!');
      }
      resetForm();
      fetchAll();
    } catch (err) {
      showError('Failed to save product!');
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      supplierId: product.supplierId,
      image: null,
    });
    setImagePreview(product.imageUrl ? `${BASE_URL}${product.imageUrl}` : null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await API.delete(`/products/${id}`);
      showSuccess('Product deleted successfully!');
      fetchAll();
    } catch (err) {
      showError('Failed to delete product!');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditProduct(null);
    setImagePreview(null);
    setForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      supplierId: '',
      image: null,
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Products</h2>
            <p className="text-subtext">Manage all vehicle parts</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, category..."
              className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="bg-white border border-border text-gray-600 px-4 py-3 rounded-xl hover:border-primary transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package size={20} className="text-primary" />
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Image Upload */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary"
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-3 w-full h-48 object-cover rounded-xl border border-border"
                    />
                  ) : (
                    <div className="mt-3 w-full h-48 bg-gray-50 border border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2">
                      <Package size={32} className="text-subtext" />
                      <p className="text-subtext text-sm">Image preview will appear here</p>
                    </div>
                  )}
                </div>

                {/* Product Name */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Product Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    rows={3}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Price + Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-700 text-sm font-medium mb-2 block">Price (Rs.)</label>
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-medium mb-2 block">Stock</label>
                    <input
                      name="stock"
                      type="number"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">Category</label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

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

                {/* Buttons */}
                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Plus size={16} />
                    {editProduct ? 'Update Product' : 'Add Product'}
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition">

              {/* Product Image */}
              <div className="h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={`${BASE_URL}${product.imageUrl}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={48} className="text-gray-300" />
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-gray-800 font-semibold text-lg">{product.name}</h3>
                <p className="text-subtext text-sm mt-1 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-primary font-bold text-xl">Rs. {product.price}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                    ${product.stock < 10
                      ? 'bg-red-100 text-red-500'
                      : 'bg-green-100 text-green-600'}`}>
                    {product.stock < 10
                      ? <><AlertTriangle size={12} /> {product.stock} left</>
                      : <><CheckCircle size={12} /> {product.stock} in stock</>
                    }
                  </span>
                </div>

                <div className="mt-2">
                  <span className="bg-blue-50 text-primary text-xs px-2 py-1 rounded-full">
                    {product.category?.name}
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-gray-50 border border-border text-gray-600 py-2 rounded-xl text-sm hover:border-primary hover:text-primary transition flex items-center justify-center gap-1"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl text-sm hover:bg-red-100 transition flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-4 text-center py-20">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-subtext">
                {searchQuery ? `No products found for "${searchQuery}"` : 'No products found!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}