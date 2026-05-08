import { useEffect, useState } from 'react';
import { Star, Trash2, User, ThumbsUp, ThumbsDown, Minus, X } from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../services/api';
import { showSuccess, showError } from '../../services/toast';

export default function AllReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await API.get('/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error(err);
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating
          ? 'text-yellow-400 fill-yellow-400'
          : 'text-gray-200'}
      />
    ));
  };

  const getRatingBadge = (rating) => {
    if (rating === 5) return {
      icon: <Star size={10} className="fill-current" />,
      label: 'Excellent',
      className: 'bg-green-100 text-green-600'
    };
    if (rating === 4) return {
      icon: <ThumbsUp size={10} />,
      label: 'Good',
      className: 'bg-blue-100 text-blue-600'
    };
    if (rating === 3) return {
      icon: <Minus size={10} />,
      label: 'Average',
      className: 'bg-yellow-100 text-yellow-600'
    };
    if (rating === 2) return {
      icon: <ThumbsDown size={10} />,
      label: 'Poor',
      className: 'bg-orange-100 text-orange-500'
    };
    return {
      icon: <X size={10} />,
      label: 'Very Poor',
      className: 'bg-red-100 text-red-500'
    };
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <Layout>
      <div className="p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">All Reviews</h2>
          <p className="text-subtext">View all customer reviews</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-xl">
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <p className="text-subtext text-sm">Average Rating</p>
                <p className="text-gray-800 font-bold text-2xl">{avgRating} / 5</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-subtext text-sm">Total Reviews</p>
                <p className="text-gray-800 font-bold text-2xl">{reviews.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-xl">
                <ThumbsUp size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-subtext text-sm">5 Star Reviews</p>
                <p className="text-gray-800 font-bold text-2xl">
                  {reviews.filter(r => r.rating === 5).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(review => {
            const badge = getRatingBadge(review.rating);
            return (
              <div key={review.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition">

                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center">
                      <User size={18} className="text-primary" />
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
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <p className="text-gray-700 text-sm italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* Rating Badge */}
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${badge.className}`}>
                  {badge.icon}
                  {badge.label}
                </span>
              </div>
            );
          })}

          {reviews.length === 0 && (
            <div className="col-span-3 text-center py-20 bg-white rounded-2xl border border-border">
              <Star size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 font-semibold">No reviews yet!</p>
              <p className="text-subtext text-sm mt-1">
                Customer reviews will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}