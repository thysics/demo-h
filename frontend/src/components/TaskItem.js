import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Determine if task is due soon (within 2 days) or overdue
  const getDueDateClass = () => {
    if (!task.due_date) return '';
    
    const dueDate = new Date(task.due_date);
    const today = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(today.getDate() + 2);
    
    if (dueDate < today) return 'overdue';
    if (dueDate <= twoDaysFromNow) return 'due-soon';
    return '';
  };

  // Get next status in the workflow
  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      case 'completed':
        return 'pending';
      default:
        return 'pending';
    }
  };

  // Get button text for status change
  const getStatusButtonText = (status) => {
    switch (status) {
      case 'pending':
        return 'Start';
      case 'in_progress':
        return 'Complete';
      case 'completed':
        return 'Reopen';
      default:
        return 'Update';
    }
  };

  return (
    <div className={`task-item status-${task.status} ${getDueDateClass()}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button 
            className="task-action-btn complete" 
            onClick={() => onStatusChange(task.id, getNextStatus(task.status))}
            title={`Mark as ${getNextStatus(task.status)}`}
          >
            {getStatusButtonText(task.status)}
          </button>
          <button 
            className="task-action-btn edit" 
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            Edit
          </button>
          <button 
            className="task-action-btn delete" 
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="task-meta">
        <span className={`status-badge status-${task.status}`}>
          {task.status.replace('_', ' ')}
        </span>
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
        <span className="task-meta-item">
          Due: {formatDate(task.due_date)}
        </span>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
    </div>
  );
};

export default TaskItem;