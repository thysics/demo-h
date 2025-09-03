import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectItem.css';

const ProjectItem = ({ project, onEdit, onDelete }) => {
  return (
    <div className="project-item">
      <div className="project-header">
        <h3 className="project-title">{project.name}</h3>
        <div className="project-actions">
          <Link 
            to={`/projects/${project.id}`} 
            className="project-action-btn view"
            title="View project details"
          >
            View Details
          </Link>
          <button 
            className="project-action-btn edit" 
            onClick={() => onEdit(project)}
            title="Edit project"
          >
            Edit
          </button>
          <button 
            className="project-action-btn delete" 
            onClick={() => onDelete(project.id)}
            title="Delete project"
          >
            Delete
          </button>
        </div>
      </div>
      
      {project.description && (
        <p className="project-description">{project.description}</p>
      )}
      
      <div className="project-meta">
        <span className="project-meta-item">
          Created: {new Date(project.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default ProjectItem;