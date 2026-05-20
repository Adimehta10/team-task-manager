import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/projects" className="navbar-brand">⚡ TaskFlow</Link>
      <div className="navbar-user">
        <span>👤 {user?.name}</span>
        <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}