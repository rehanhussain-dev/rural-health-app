// File: server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

/**
 * @description Protects routes by checking for a valid JWT.
 * @param {object} req The request object.
 * @param {object} res The response object.
 * @param {function} next The next middleware function.
 */
const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get the token from the header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using the secret from your environment variables
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Find the user associated with the token (excluding the password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // 4. Continue to the next middleware or route handler
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is found in the request header
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * @description Middleware to restrict access based on user role.
 * @param {string} role The required role (e.g., 'doctor').
 * @returns {function} The middleware function.
 */
const restrictTo = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
        next();
    };
};

module.exports = { protect, restrictTo };
