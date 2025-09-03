import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskService from '../services/taskService';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all tasks to calculate statistics
        const response = await TaskService.getTasks();
        const tasks = response.tasks || [];
        
        // Calculate statistics
        const stats = {
          total: tasks.length,
          pending: tasks.filter(task => task.status === 'pending').length,
          in_progress: tasks.filter(task => task.status === 'in_progress').length,
          completed: tasks.filter(task => task.status === 'completed').length
        };
        
        setTaskStats(stats);
        
        // Get recent tasks (up to 5)
        const sortedTasks = [...tasks].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        ).slice(0, 5);
        
        setRecentTasks(sortedTasks);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="dashboard-loading">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="welcome-message">
        <h2>Welcome, {currentUser.username}!</h2>
        <p>This is your task management dashboard. Here you can see an overview of your tasks and projects.</p>
      </div>
      
      {error && (
        <div className="dashboard-error">
          <p>{error}</p>
        </div>
      )}
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Task Summary</h3>
          
          <div className="task-stats">
            <div className="stat-card pending">
              <div className="stat-label">Pending</div>
              <div className="stat-number">{taskStats.pending}</div>
            </div>
            
            <div className="stat-card in-progress">
              <div className="stat-label">In Progress</div>
              <div className="stat-number">{taskStats.in_progress}</div>
            </div>
            
            <div className="stat-card completed">
              <div className="stat-label">Completed</div>
              <div className="stat-number">{taskStats.completed}</div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>
            Recent Tasks
            <Link to="/tasks" className="view-all">View All</Link>
          </h3>
          
          <div className="recent-tasks">
            {recentTasks.length > 0 ? (
              recentTasks.map(task => (
                <div key={task.id} className="recent-task-item">
                  <div className="recent-task-info">
                    <div className="recent-task-title">{task.title}</div>
                    <div className="recent-task-meta">
                      Created: {formatDate(task.created_at)}
                    </div>
                  </div>
                  <span className={`recent-task-status status-${task.status}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-tasks-message">
                <p>You don't have any tasks yet.</p>
                <Link to="/tasks" className="create-task-link">Create Your First Task</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;