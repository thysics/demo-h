const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasks');
const authenticate = require('../middleware/auth');

// All task routes require authentication
router.use(authenticate);

// Task routes
router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;