import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/projects" />;
};

function AppContent() {
  const { user } = useAuth();
  return (
    <div className="app">
      {user && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/projects" />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/projects" element={<PrivateRoute><ProjectList /></PrivateRoute>} />
          <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
          <Route path="/projects/:id/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;