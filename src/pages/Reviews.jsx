import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await axiosInstance.get('/api/v1/seller/reviews');
            setReviews(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load reviews.');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    if (loading) {
        return <div className="dashboard-container">Loading reviews...</div>;
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="form-message error">{error}</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container reviews-container">
            <h1 className="add-product-title">Reviews & Ratings</h1>

            {reviews.length === 0 ? (
                <div className="chart-card">
                    <p className="earnings-empty">No reviews yet on your products.</p>
                </div>
            ) : (
                <div className="reviews-list">
                    {reviews.map((review) => (
                        <div className="review-card" key={review.id}>
                            <img
                                src={review.productImage}
                                alt={review.productName}
                                className="review-product-image"
                            />
                            <div className="review-content">
                                <div className="review-top-row">
                                    <p className="review-product-name">{review.productName}</p>
                                    <span className="review-stars">{renderStars(review.rating)}</span>
                                </div>
                                <p className="review-customer">{review.customerName}</p>
                                {review.comment && <p className="review-comment">{review.comment}</p>}
                                <p className="review-date">
                                    {new Date(review.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;