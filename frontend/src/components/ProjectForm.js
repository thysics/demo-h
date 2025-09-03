import React, { useState, useEffect } from 'react';
import './ProjectForm.css';

const ProjectForm = ({ project, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If editing an existing project, populate the form
  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setDescription(project.description || '');
    }
  }, [project]);

  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = 'Project name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const projectData = {
          name,
          description
        };
        
        await onSubmit(projectData);
        
        // Reset form if not editing
        if (!project) {
          setName('');
          setDescription('');
        }
      } catch (error) {
        console.error('Error submitting project:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="project-form-overlay" onClick={onCancel}>
      <div className="project-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="project-form-header">
          <h2 className="project-form-title">{project ? 'Edit Project' : 'Create New Project'}</h2>
          <button className="project-form-close" onClick={onCancel}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className={formErrors.name ? 'error' : ''}
            />
            {formErrors.name && <div className="error-text">{formErrors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              rows="4"
            />
          </div>
          
          <div className="project-form-actions">
            <button 
              type="button" 
              className="project-form-button cancel" 
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="project-form-button submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;