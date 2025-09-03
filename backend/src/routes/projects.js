const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projects');
const authenticate = require('../middleware/auth');

// All project routes require authentication
router.use(authenticate);

// Project routes
router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.get('/:id/tasks', projectController.getProjectTasks);

module.exports = router;