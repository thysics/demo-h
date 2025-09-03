import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProjectService from '../services/projectService';
import TaskService from '../services/taskService';
import ProjectForm from '../components/ProjectForm';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Load project and tasks when component mounts or projectId changes
  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  // Fetch project details and associated tasks
  const fetchProjectAndTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch project details
      const projectResponse = await ProjectService.getProjectById(projectId);
      setProject(projectResponse.project);
      
      // Fetch project tasks
      const tasksResponse = await ProjectService.getProjectTasks(projectId);
      setTasks(tasksResponse.tasks || []);
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Failed to load project details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle editing the project
  const handleEditProject = () => {
    setShowProjectForm(true);
  };

  // Handle project form submission
  const handleProjectSubmit = async (projectData) => {
    try {
      await ProjectService.updateProject(projectId, projectData);
      setShowProjectForm(false);
      fetchProjectAndTasks();
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project. Please try again.');
    }
  };

  // Handle deleting the project
  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This will not delete the tasks associated with this project.')) {
      try {
        await ProjectService.deleteProject(projectId);
        navigate('/projects');
      } catch (err) {
        console.error('Error deleting project:', err);
        setError('Failed to delete project. Please try again.');
      }
    }
  };

  // Open form to create a new task
  const handleCreateTask = () => {
    setCurrentTask(null);
    setShowTaskForm(true);
  };

  // Open form to edit an existing task
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setShowTaskForm(true);
  };

  // Handle task form submission
  const handleTaskSubmit = async (taskData) => {
    try {
      // Add project_id to task data
      taskData.project_id = parseInt(projectId, 10);
      
      if (currentTask) {
        // Update existing task
        await TaskService.updateTask(currentTask.id, taskData);
      } else {
        // Create new task
        await TaskService.createTask(taskData);
      }
      
      // Close form and refresh tasks
      setShowTaskForm(false);
      fetchProjectAndTasks();
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
        fetchProjectAndTasks();
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
      fetchProjectAndTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="project-detail-container">
        <div className="project-detail-loading">
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-container">
        <div className="project-detail-error">
          <p>{error}</p>
          <Link to="/projects" className="back-link">Back to Projects</Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-container">
        <div className="project-detail-error">
          <p>Project not found.</p>
          <Link to="/projects" className="back-link">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      <div className="project-detail-header">
        <div className="project-detail-nav">
          <Link to="/projects" className="back-link">
            &larr; Back to Projects
          </Link>
        </div>
        
        <div className="project-detail-title-section">
          <h1 className="project-detail-title">{project.name}</h1>
          <div className="project-detail-actions">
            <button 
              className="project-action-btn edit" 
              onClick={handleEditProject}
            >
              Edit Project
            </button>
            <button 
              className="project-action-btn delete" 
              onClick={handleDeleteProject}
            >
              Delete Project
            </button>
          </div>
        </div>
        
        {project.description && (
          <p className="project-detail-description">{project.description}</p>
        )}
        
        <div className="project-detail-meta">
          <span className="project-meta-item">
            Created: {new Date(project.created_at).toLocaleDateString()}
          </span>
          <span className="project-meta-item">
            Last Updated: {new Date(project.updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="project-tasks-section">
        <div className="project-tasks-header">
          <h2 className="project-tasks-title">Project Tasks</h2>
          <button className="create-task-btn" onClick={handleCreateTask}>
            Add Task to Project
          </button>
        </div>
        
        <div className="project-tasks-list">
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
            <div className="project-tasks-empty">
              <h3>No tasks in this project</h3>
              <p>Add a task to get started.</p>
              <button className="create-task-btn" onClick={handleCreateTask}>
                Add Task
              </button>
            </div>
          )}
        </div>
      </div>
      
      {showProjectForm && (
        <ProjectForm
          project={project}
          onSubmit={handleProjectSubmit}
          onCancel={() => setShowProjectForm(false)}
        />
      )}
      
      {showTaskForm && (
        <TaskForm
          task={currentTask}
          onSubmit={handleTaskSubmit}
          onCancel={() => setShowTaskForm(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetail;