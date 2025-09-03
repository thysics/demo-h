import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">Task Management App</Link>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            {currentUser ? (
              // Links for authenticated users
              <>
                <li className="nav-item">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/tasks">Tasks</Link>
                </li>
                <li className="nav-item">
                  <Link to="/projects">Projects</Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="logout-button">Logout</button>
                </li>
              </>
            ) : (
              // Links for unauthenticated users
              <>
                <li className="nav-item">
                  <Link to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;