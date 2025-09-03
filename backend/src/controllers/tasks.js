const Task = require('../models/task');

/**
 * Create a new task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, due_date, project_id } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Task title is required.' });
    }
    
    // Validate status if provided
    if (status && !['pending', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Status must be pending, in_progress, or completed.' });
    }
    
    // Validate priority if provided
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ message: 'Priority must be low, medium, or high.' });
    }
    
    // Create task with user ID from authenticated user
    const taskData = {
      title,
      description,
      status,
      priority,
      due_date,
      project_id,
      user_id: req.user.id
    };
    
    const taskId = await Task.create(taskData);
    
    // Get the created task
    const task = await Task.findById(taskId, req.user.id);
    
    res.status(201).json({
      message: 'Task created successfully.',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Error creating task.' });
  }
};

/**
 * Get all tasks for the authenticated user with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTasks = async (req, res) => {
  try {
    // Extract filter parameters from query
    const { status, priority, project_id, search } = req.query;
    
    // Create filters object with only defined filters
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (project_id) filters.project_id = parseInt(project_id, 10);
    if (search) filters.search = search;
    
    // Get tasks for the authenticated user with filters
    const tasks = await Task.findByUser(req.user.id, filters);
    
    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Error retrieving tasks.' });
  }
};

/**
 * Get a specific task by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Validate task ID
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required.' });
    }
    
    // Get task by ID (only if it belongs to the authenticated user)
    const task = await Task.findById(taskId, req.user.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    
    res.status(200).json({ task });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ message: 'Error retrieving task.' });
  }
};

/**
 * Update a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status, priority, due_date, project_id } = req.body;
    
    // Validate task ID
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required.' });
    }
    
    // Check if task exists and belongs to the user
    const existingTask = await Task.findById(taskId, req.user.id);
    
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    
    // Validate status if provided
    if (status && !['pending', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Status must be pending, in_progress, or completed.' });
    }
    
    // Validate priority if provided
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ message: 'Priority must be low, medium, or high.' });
    }
    
    // Update task
    const taskData = {
      title,
      description,
      status,
      priority,
      due_date,
      project_id
    };
    
    const success = await Task.update(taskId, req.user.id, taskData);
    
    if (!success) {
      return res.status(404).json({ message: 'Task not found or not updated.' });
    }
    
    // Get the updated task
    const updatedTask = await Task.findById(taskId, req.user.id);
    
    res.status(200).json({
      message: 'Task updated successfully.',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Error updating task.' });
  }
};

/**
 * Delete a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Validate task ID
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required.' });
    }
    
    // Delete task (only if it belongs to the authenticated user)
    const success = await Task.delete(taskId, req.user.id);
    
    if (!success) {
      return res.status(404).json({ message: 'Task not found or not deleted.' });
    }
    
    res.status(200).json({
      message: 'Task deleted successfully.'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Error deleting task.' });
  }
};