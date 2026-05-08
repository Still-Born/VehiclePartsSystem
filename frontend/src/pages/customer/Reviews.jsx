import { useState, useEffect } from 'react';
import { Plus, Star, Trash2, XCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    comment: '',
    rating: 5,
  });

  useEffect(() => {
    fetchCustomerId();
  // eslint-disable-next-line
  }, []);

  const fetchCustomerId = async () => {
    try {
      const email = localStorage.getItem('email');
      const res = await API.get(`/customers/by-email/${email}`);
      setCustomerId(res.data.id);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get('/reviews');
      setReviews(res.data);
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
      await API.post('/reviews', {
        customerId: parseInt(customerId),
        comment: form.comment,
        rating: parseInt(form.rating),
      });
      showSuccess('Review submitted successfully!');
      resetForm();
      fetchReviews();
    } catch (err) {
      showError('Failed to submit review!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete review?')) return;
    try {
      await API.delete(`/reviews/${id}`);
      showSuccess('Review deleted!');
      fetchReviews();
    } catch (err) {
      showError('Failed to delete review!');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setForm({ comment: '', rating: 5 });
  };

  
  const renderStars = (rating, size = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={i < rating
          ? 'text-yellow-400 fill-yellow-400'
          : 'text-gray-200 fill-gray-200'}
      />
    ));
  };

  // Interactive star selector
  const StarSelector = ({ value, onChange }) => {
    const [hovered, setHovered] = useState(0);
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            onMouseEnter={() => setHovered(i + 1)}
            onMouseLeave={() => setHovered(0)}
            className="transition"
          >
            <Star
              size={28}
              className={i < (hovered || value)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-200 fill-gray-200'}
            />
          </button>
        ))}
        <span className="text-subtext text-sm ml-2 font-medium">
          {value}/5 —{' '}
          {value === 5 ? 'Excellent'
            : value === 4 ? 'Good'
            : value === 3 ? 'Average'
            : value === 2 ? 'Poor'
            : 'Very Poor'}
        </span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Reviews</h2>
            <p className="text-subtext">Share your experience with us</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Write Review
          </button>
        </div>

        {/* No Customer Found */}
        {!customerId && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 mb-6 flex items-start gap-3">
            <XCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Customer profile not found!</p>
              <p className="text-sm mt-1 text-red-400">
                Please ask staff to register you first.
              </p>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && customerId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                Write a Review
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Interactive Star Rating */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-3 block">
                    Rating
                  </label>
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                    <StarSelector
                      value={parseInt(form.rating)}
                      onChange={(val) => setForm({ ...form, rating: val })}
                    />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Comment
                  </label>
                  <textarea
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                    placeholder="Share your experience..."
                    rows={4}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-800 placeholder-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Star size={16} />
                    Submit Review
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

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition">

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-50 w-10 h-10 rounded-full flex items-center justify-center">
                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-semibold">
                      {review.customer?.fullName || 'Customer'}
                    </h3>
                    <p className="text-subtext text-xs">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-gray-300 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {renderStars(review.rating)}
                <span className="text-subtext text-xs ml-1">
                  ({review.rating}/5)
                </span>
              </div>

              {/* Comment */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-700 text-sm italic">
                  "{review.comment}"
                </p>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="col-span-3 text-center py-20 bg-white rounded-2xl border border-border">
              <Star size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 font-semibold">No reviews yet!</p>
              <p className="text-subtext text-sm mt-1">
                Be the first to write a review.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}