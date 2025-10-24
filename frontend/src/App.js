import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import PetProfile from './components/PetProfile';
import VaccinationTracker from './components/VaccinationTracker';
import SymptomChecker from './components/SymptomChecker';
import BehaviorSolver from './components/BehaviorSolver';
import BreedInfo from './components/BreedInfo';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

// Services
import { healthCheck } from './services/api';

// Styles
import './styles/App.css';
import './styles/Components.css';
import './styles/Responsive.css';

function AppContent() {
  const { user, loading, checkAuth } = useAuth();
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    // Check backend connectivity on app start
    const checkBackend = async () => {
      try {
        await healthCheck();
        setBackendStatus('connected');
      } catch (error) {
        console.error('Backend connection failed:', error);
        setBackendStatus('disconnected');
      }
    };

    checkBackend();
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>🐾 PetPulse AI</h2>
          <p>Loading your pet health platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Backend Status Indicator */}
      {backendStatus === 'disconnected' && (
        <div className="backend-warning">
          ⚠️ Backend service is temporarily unavailable. Some features may not work.
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Show header on all pages except auth pages */}
      {!['/login', '/register'].includes(window.location.pathname) && <Header />}
      
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/dashboard" />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/pets" 
            element={user ? <PetProfile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/vaccinations" 
            element={user ? <VaccinationTracker /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/symptom-checker" 
            element={user ? <SymptomChecker /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/behavior-solver" 
            element={user ? <BehaviorSolver /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/breed-info" 
            element={user ? <BreedInfo /> : <Navigate to="/login" />} 
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Show footer on all pages except auth pages */}
      {!['/login', '/register'].includes(window.location.pathname) && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;