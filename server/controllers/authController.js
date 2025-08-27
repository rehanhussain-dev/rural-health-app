// File: server/controllers/authController.js

// Import necessary libraries and models
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import the User model

/**
 * @description Generates a JWT (JSON Web Token) for a user.
 * @param {string} id The user's unique MongoDB ID.
 * @returns {string} The signed JWT.
 */
const generateToken = (id) => {
    // Sign the token with the user's ID and a secret from environment variables
    // The secret is crucial for token verification on future requests
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // The token will expire in 30 days
    });
};

/**
 * @description Registers a new user.
 * @route POST /api/auth/register
 * @access Public
 * @param {object} req The request object.
 * @param {object} res The response object.
 */
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // 1. Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // 2. Create the new user
        // The password will be automatically hashed by the pre-save middleware in the User model
        const user = await User.create({ name, email, password, role });

        // 3. If user creation is successful, send back a success response
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), // Generate and send a JWT
            });
        } else {
            // This case should be rare, but good to have for robustness
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        // Handle any server-side errors
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @description Logs in an existing user.
 * @route POST /api/auth/login
 * @access Public
 * @param {object} req The request object.
 * @param {object} res The response object.
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user by their email
        const user = await User.findOne({ email });

        // 2. Check if the user exists and the password is correct
        // The `matchPassword` method is defined in the User model
        if (user && (await user.matchPassword(password))) {
            // 3. If credentials are valid, send back the user data and a JWT
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            // Handle invalid credentials
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        // Handle any server-side errors
        res.status(500).json({ message: 'Server error' });
    }
};

// Export the controller functions to be used in authRoutes.js
module.exports = {
    registerUser,
    loginUser,
};
