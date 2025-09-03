const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const authenticate = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authenticate, userController.getProfile);

module.exports = router;