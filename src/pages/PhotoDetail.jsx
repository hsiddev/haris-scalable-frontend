import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './PhotoDetail.css';

const PhotoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPhoto();
    fetchComments();
    if (user && user.role === 'consumer') {
      fetchUserRating();
    }
  }, [id, user]);

  const fetchPhoto = async () => {
    try {
      const response = await api.get(`/photos/${id}`);
      setPhoto(response.data);
    } catch (error) {
      setError('Photo not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/photo/${id}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchUserRating = async () => {
    try {
      const response = await api.get(`/ratings/user/${id}`);
      if (response.data.rating) {
        setUserRating(response.data.rating);
        setRating(response.data.rating);
      }
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/comments', {
        photoId: id,
        text: commentText
      });
      setCommentText('');
      fetchComments();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingSubmit = async (selectedRating) => {
    if (!user || user.role !== 'consumer') return;

    setSubmitting(true);
    try {
      await api.post('/ratings', {
        photoId: id,
        rating: selectedRating
      });
      setUserRating(selectedRating);
      setRating(selectedRating);
      fetchPhoto();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!photo) {
    return (
      <div className="error-container">
        <p>Photo not found</p>
        <Link to="/">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="photo-detail-container">
      <div className="photo-detail-content">
        <div className="photo-section">
          <img src={photo.imageUrl} alt={photo.title} />
        </div>

        <div className="info-section">
          <div className="photo-header">
            <h1>{photo.title}</h1>
            <p className="creator">by {photo.creator.username}</p>
          </div>

          {photo.caption && (
            <div className="caption">
              <p>{photo.caption}</p>
            </div>
          )}

          <div className="metadata">
            {photo.location && (
              <div className="metadata-item">
                <span className="label">📍 Location:</span>
                <span>{photo.location}</span>
              </div>
            )}
            {photo.people && photo.people.length > 0 && (
              <div className="metadata-item">
                <span className="label">👥 People:</span>
                <span>{photo.people.join(', ')}</span>
              </div>
            )}
            <div className="metadata-item">
              <span className="label">📅 Uploaded:</span>
              <span>{new Date(photo.uploadDate).toLocaleDateString()}</span>
            </div>
            <div className="metadata-item">
              <span className="label">👁️ Views:</span>
              <span>{photo.views}</span>
            </div>
            <div className="metadata-item">
              <span className="label">⭐ Rating:</span>
              <span>{photo.averageRating.toFixed(1)} ({photo.totalRatings} ratings)</span>
            </div>
          </div>

          {user && user.role === 'consumer' && (
            <div className="rating-section">
              <h3>Rate this photo</h3>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= rating ? 'active' : ''}`}
                    onClick={() => handleRatingSubmit(star)}
                    disabled={submitting}
                  >
                    ⭐
                  </button>
                ))}
                {userRating && (
                  <span className="rating-text">Your rating: {userRating}/5</span>
                )}
              </div>
            </div>
          )}

          <div className="comments-section">
            <h3>Comments ({comments.length})</h3>

            {user && user.role === 'consumer' && (
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  rows="3"
                  maxLength={500}
                />
                <button type="submit" disabled={submitting || !commentText.trim()}>
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            )}

            {error && <div className="error-message">{error}</div>}

            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="comment-item">
                    <div className="comment-header">
                      <strong>{comment.user.username}</strong>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                    {user && user.id === comment.user._id && (
                      <button
                        className="delete-comment"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="actions">
            <Link to="/" className="back-button">
              ← Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;


