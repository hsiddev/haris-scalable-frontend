import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './CreatorUpload.css';

const CreatorUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    location: '',
    people: []
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [personInput, setPersonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPerson = () => {
    if (personInput.trim() && !formData.people.includes(personInput.trim())) {
      setFormData({
        ...formData,
        people: [...formData.people, personInput.trim()]
      });
      setPersonInput('');
    }
  };

  const removePerson = (person) => {
    setFormData({
      ...formData,
      people: formData.people.filter(p => p !== person)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!image) {
      setError('Please select an image');
      setLoading(false);
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append('image', image);
      uploadData.append('title', formData.title);
      uploadData.append('caption', formData.caption);
      uploadData.append('location', formData.location);
      uploadData.append('people', JSON.stringify(formData.people));

      await api.post('/photos/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h1>Upload Photo</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Image *</label>
            <div className="image-upload">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="remove-image"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                  <span>Choose Image</span>
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label>Caption</label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              rows="4"
              maxLength={1000}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label>People</label>
            <div className="people-input">
              <input
                type="text"
                value={personInput}
                onChange={(e) => setPersonInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addPerson();
                  }
                }}
                placeholder="Add person name"
              />
              <button type="button" onClick={addPerson}>
                Add
              </button>
            </div>
            {formData.people.length > 0 && (
              <div className="people-tags">
                {formData.people.map((person, index) => (
                  <span key={index} className="person-tag">
                    {person}
                    <button
                      type="button"
                      onClick={() => removePerson(person)}
                      className="remove-person"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Uploading...' : 'Upload Photo'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatorUpload;


