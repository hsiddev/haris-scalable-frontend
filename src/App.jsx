import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatorUpload from './pages/CreatorUpload';
import Consumer from './pages/Consumer';
import PhotoDetail from './pages/PhotoDetail';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/creator/upload"
            element={
              <ProtectedRoute requiredRole="creator">
                <CreatorUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer"
            element={
              <ProtectedRoute requiredRole="consumer">
                <Consumer />
              </ProtectedRoute>
            }
          />
          <Route path="/photo/:id" element={<PhotoDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
