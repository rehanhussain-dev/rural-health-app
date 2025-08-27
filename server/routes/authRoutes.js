// File: server/routes/authRoutes.js

// Import necessary libraries and controllers
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

/**
 * @description Define the authentication routes.
 * These routes handle user registration and login.
 * The logic for these routes is handled by the `authController`.
 */

// Route to register a new user
// This will be a POST request to /api/auth/register
router.post('/register', registerUser);

// Route to log in a user
// This will be a POST request to /api/auth/login
router.post('/login', loginUser);

// Export the router to be used in server.js
module.exports = router;
