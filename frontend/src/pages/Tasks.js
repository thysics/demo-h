import React, { useState, useEffect } from 'react';
import TaskService from '../services/taskService';
import ProjectService from '../services/projectService';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project_id: '',
    search: ''
  });

  // Load tasks and projects when component mounts
  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  // Fetch tasks with current filters
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Remove empty filters
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      const response = await TaskService.getTasks(activeFilters);
      setTasks(response.tasks || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects for filter dropdown
  const fetchProjects = async () => {
    try {
      const response = await ProjectService.getProjects();
      setProjects(response.projects || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      project_id: '',
      search: ''
    });
    // Fetch tasks without filters
    setTimeout(fetchTasks, 0);
  };

  // Open form to create a new task
  const handleCreateTask = () => {
    setCurrentTask(null);
    setShowForm(true);
  };

  // Open form to edit an existing task
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setShowForm(true);
  };

  // Handle task form submission (create or update)
  const handleTaskSubmit = async (taskData) => {
    try {
      if (currentTask) {
        // Update existing task
        await TaskService.updateTask(currentTask.id, taskData);
      } else {
        // Create new task
        await TaskService.createTask(taskData);
      }
      
      // Close form and refresh tasks
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task. Please try again.');
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await TaskService.deleteTask(taskId);
        // Refresh tasks
        fetchTasks();
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task. Please try again.');
      }
    }
  };

  // Handle task status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await TaskService.updateTask(taskId, { status: newStatus });
      // Refresh tasks
      fetchTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">My Tasks</h1>
        <button className="create-task-btn" onClick={handleCreateTask}>
          Create New Task
        </button>
      </div>
      
      <div className="tasks-filters">
        <div className="filters-header">
          <h2 className="filters-title">Filters</h2>
          <button 
            className="filters-toggle" 
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <form onSubmit={applyFilters} className="filters-form">
            <div className="filter-group">
              <label htmlFor="search">Search</label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search tasks..."
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="project_id">Project</label>
              <select
                id="project_id"
                name="project_id"
                value={filters.project_id}
                onChange={handleFilterChange}
              >
                <option value="">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filters-actions">
              <button 
                type="button" 
                className="filter-btn reset" 
                onClick={resetFilters}
              >
                Reset
              </button>
              <button 
                type="submit" 
                className="filter-btn apply"
              >
                Apply Filters
              </button>
            </div>
          </form>
        )}
      </div>
      
      {error && (
        <div className="tasks-error">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="tasks-loading">
          <p>Loading tasks...</p>
        </div>
      ) : (
        <>
          <div className="tasks-count">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
          </div>
          
          <div className="tasks-list">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <div className="tasks-empty">
                <h3>No tasks found</h3>
                <p>Create a new task or adjust your filters to see more results.</p>
                <button className="create-task-btn" onClick={handleCreateTask}>
                  Create New Task
                </button>
              </div>
            )}
          </div>
        </>
      )}
      
      {showForm && (
        <TaskForm
          task={currentTask}
          onSubmit={handleTaskSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Tasks;