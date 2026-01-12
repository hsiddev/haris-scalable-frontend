import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Home.css';

const Home = () => {
  const { user, logout } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('uploadDate');

  useEffect(() => {
    fetchPhotos();
  }, [page, sortBy, searchTerm]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        sortBy,
        order: 'desc'
      };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await api.get('/photos', { params });
      setPhotos(response.data.photos);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPhotos();
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <h1>Haris Assignment</h1>
          <div className="header-actions">
            {user ? (
              <>
                <span className="user-info">Welcome, {user.username}</span>
                {user.role === 'creator' && (
                  <Link to="/creator/upload" className="btn-primary">
                    Upload Photo
                  </Link>
                )}
                {user.role === 'consumer' && (
                  <Link to="/consumer" className="btn-primary">
                    Browse Photos
                  </Link>
                )}
                <button onClick={logout} className="btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="hero-section">
        <div className="hero-content">
          <h2>Discover Amazing Photos</h2>
          <p>Explore a world of creativity and inspiration</p>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="content-container">
        <div className="filters">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="uploadDate">Newest First</option>
            <option value="averageRating">Highest Rated</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading photos...</div>
        ) : photos.length === 0 ? (
          <div className="no-photos">No photos found</div>
        ) : (
          <>
            <div className="photos-grid">
              {photos.map((photo) => (
                <Link
                  key={photo._id}
                  to={`/photo/${photo._id}`}
                  className="photo-card"
                >
                  <div className="photo-image-container">
                    <img src={photo.imageUrl} alt={photo.title} />
                    <div className="photo-overlay">
                      <div className="photo-stats">
                        <span>⭐ {photo.averageRating.toFixed(1)}</span>
                        <span>👁️ {photo.views}</span>
                      </div>
                    </div>
                  </div>
                  <div className="photo-info">
                    <h3>{photo.title}</h3>
                    <p className="photo-creator">by {photo.creator.username}</p>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;


