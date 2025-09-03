const Project = require('../models/project');

/**
 * Create a new project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Project name is required.' });
    }
    
    // Create project with user ID from authenticated user
    const projectData = {
      name,
      description,
      user_id: req.user.id
    };
    
    const projectId = await Project.create(projectData);
    
    // Get the created project
    const project = await Project.findById(projectId, req.user.id);
    
    res.status(201).json({
      message: 'Project created successfully.',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Error creating project.' });
  }
};

/**
 * Get all projects for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProjects = async (req, res) => {
  try {
    // Get projects for the authenticated user
    const projects = await Project.findByUser(req.user.id);
    
    res.status(200).json({
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Error retrieving projects.' });
  }
};

/**
 * Get a specific project by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    
    // Validate project ID
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required.' });
    }
    
    // Get project by ID (only if it belongs to the authenticated user)
    const project = await Project.findById(projectId, req.user.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    
    res.status(200).json({ project });
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({ message: 'Error retrieving project.' });
  }
};

/**
 * Update a project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description } = req.body;
    
    // Validate project ID
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required.' });
    }
    
    // Check if project exists and belongs to the user
    const existingProject = await Project.findById(projectId, req.user.id);
    
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    
    // Update project
    const projectData = {
      name,
      description
    };
    
    const success = await Project.update(projectId, req.user.id, projectData);
    
    if (!success) {
      return res.status(404).json({ message: 'Project not found or not updated.' });
    }
    
    // Get the updated project
    const updatedProject = await Project.findById(projectId, req.user.id);
    
    res.status(200).json({
      message: 'Project updated successfully.',
      project: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Error updating project.' });
  }
};

/**
 * Delete a project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    
    // Validate project ID
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required.' });
    }
    
    // Delete project (only if it belongs to the authenticated user)
    const success = await Project.delete(projectId, req.user.id);
    
    if (!success) {
      return res.status(404).json({ message: 'Project not found or not deleted.' });
    }
    
    res.status(200).json({
      message: 'Project deleted successfully.'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Error deleting project.' });
  }
};

/**
 * Get all tasks for a specific project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProjectTasks = async (req, res) => {
  try {
    const projectId = req.params.id;
    
    // Validate project ID
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required.' });
    }
    
    // Check if project exists and belongs to the user
    const project = await Project.findById(projectId, req.user.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    
    // Get tasks for the project
    const tasks = await Project.getTasks(projectId, req.user.id);
    
    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get project tasks error:', error);
    res.status(500).json({ message: 'Error retrieving project tasks.' });
  }
};