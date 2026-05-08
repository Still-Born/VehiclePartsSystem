import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCategory) {
        await API.put(`/categories/${editCategory.id}`, form);
        showSuccess('Category updated successfully!');
      } else {
        await API.post('/categories', form);
        showSuccess('Category added successfully!');
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      showError('Failed to save category!');
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setForm({
      name: category.name,
      description: category.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await API.delete(`/categories/${id}`);
      showSuccess('Category deleted successfully!');
      fetchCategories();
    } catch (err) {
      showError('Failed to delete category!');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditCategory(null);
    setForm({ name: '', description: '' });
  };

  const tagColors = [
    'bg-blue-50 text-blue-500',
    'bg-green-50 text-green-500',
    'bg-purple-50 text-purple-500',
    'bg-yellow-50 text-yellow-500',
    'bg-pink-50 text-pink-500',
    'bg-cyan-50 text-cyan-500',
  ];

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Categories</h2>
            <p className="text-subtext">Manage vehicle parts categories</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Tag size={20} className="text-primary" />
                {editCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Category Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="eg. Engine Parts, Brake System"
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter description"
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
                    {editCategory ? 'Update Category' : 'Add Category'}
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

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={category.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className={`${tagColors[index % tagColors.length]} p-3 rounded-xl`}>
                  <Tag size={22} />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-800 font-semibold text-lg">{category.name}</h3>
                  <p className="text-subtext text-sm mt-1">{category.description}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 bg-gray-50 border border-border text-gray-600 py-2 rounded-xl text-sm hover:border-primary hover:text-primary transition flex items-center justify-center gap-1"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl text-sm hover:bg-red-100 transition flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-3 text-center py-20">
              <Tag size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-subtext">No categories found. Add one!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}