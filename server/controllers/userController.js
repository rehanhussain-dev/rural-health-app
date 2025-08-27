// File: server/controllers/userController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * @description Generates a JWT token.
 * @param {string} id The user's ID.
 * @returns {string} The JWT token.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * @description Registers a new user.
 * @route POST /api/users/register
 * @access Public
 * @param {object} req The request object.
 * @param {object} res The response object.
 */
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // Respond with user details and a token
        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @description Authenticates a user and logs them in.
 * @route POST /api/users/login
 * @access Public
 * @param {object} req The request object.
 * @param {object} res The response object.
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if the user exists and the password is correct
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @description Gets all users from the database.
 * @route GET /api/users/all
 * @access Private (Admin only)
 * @param {object} req The request object.
 * @param {object} res The response object.
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @description Gets all users with the 'doctor' role.
 * @route GET /api/patients/doctors
 * @access Public
 * @param {object} req The request object.
 * @param {object} res The response object.
 */
const getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getDoctors,
};
