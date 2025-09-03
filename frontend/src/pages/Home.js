import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Task Management App</h1>
        <p className="home-description">
          A simple and efficient way to manage your tasks and projects.
        </p>
        
        <div className="home-features">
          <div className="feature">
            <h3>Task Management</h3>
            <p>Create, organize, and track your tasks with ease.</p>
          </div>
          <div className="feature">
            <h3>Project Organization</h3>
            <p>Group related tasks into projects for better organization.</p>
          </div>
          <div className="feature">
            <h3>Progress Tracking</h3>
            <p>Monitor your progress and stay on top of your deadlines.</p>
          </div>
        </div>
        
        <div className="home-cta">
          {isAuthenticated() ? (
            <Link to="/dashboard" className="cta-button">
              Go to Dashboard
            </Link>
          ) : (
            <div className="cta-buttons">
              <Link to="/login" className="cta-button">
                Login
              </Link>
              <Link to="/register" className="cta-button secondary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;