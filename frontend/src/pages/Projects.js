import React, { useState, useEffect } from 'react';
import ProjectService from '../services/projectService';
import ProjectItem from '../components/ProjectItem';
import ProjectForm from '../components/ProjectForm';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  // Load projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch projects from the API
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProjectService.getProjects();
      setProjects(response.projects || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Open form to create a new project
  const handleCreateProject = () => {
    setCurrentProject(null);
    setShowForm(true);
  };

  // Open form to edit an existing project
  const handleEditProject = (project) => {
    setCurrentProject(project);
    setShowForm(true);
  };

  // Handle project form submission (create or update)
  const handleProjectSubmit = async (projectData) => {
    try {
      if (currentProject) {
        // Update existing project
        await ProjectService.updateProject(currentProject.id, projectData);
      } else {
        // Create new project
        await ProjectService.createProject(projectData);
      }
      
      // Close form and refresh projects
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project. Please try again.');
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This will not delete the tasks associated with this project.')) {
      try {
        await ProjectService.deleteProject(projectId);
        // Refresh projects
        fetchProjects();
      } catch (err) {
        console.error('Error deleting project:', err);
        setError('Failed to delete project. Please try again.');
      }
    }
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1 className="projects-title">My Projects</h1>
        <button className="create-project-btn" onClick={handleCreateProject}>
          Create New Project
        </button>
      </div>
      
      {error && (
        <div className="projects-error">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="projects-loading">
          <p>Loading projects...</p>
        </div>
      ) : (
        <>
          <div className="projects-count">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} found
          </div>
          
          <div className="projects-list">
            {projects.length > 0 ? (
              projects.map(project => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              ))
            ) : (
              <div className="projects-empty">
                <h3>No projects found</h3>
                <p>Create a new project to organize your tasks.</p>
                <button className="create-project-btn" onClick={handleCreateProject}>
                  Create New Project
                </button>
              </div>
            )}
          </div>
        </>
      )}
      
      {showForm && (
        <ProjectForm
          project={currentProject}
          onSubmit={handleProjectSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Projects;