// File: server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, getDoctors } = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

/**
 * @description Define the user routes.
 * These routes handle user registration, login, and fetching user lists.
 */

// Route to register a new user.
router.post('/register', registerUser);

// Route to log in a user.
router.post('/login', loginUser);

// Route to get a list of all doctors.
router.get('/doctors', getDoctors);

// New route for admin to get a list of all users.
router.get('/all', protect, restrictTo('admin'), getAllUsers);

// Export the router to be used in server.js
module.exports = router;
