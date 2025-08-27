// File: server/controllers/patientController.js

const User = require('../models/User'); // Import the User model

/**
 * @description Get all patients.
 * This is a protected route accessible only by doctors.
 * @route GET /api/patients
 * @access Private (Doctor only)
 * @param {object} req The request object.
 * @param {object} res The response object.
 */
const getPatients = async (req, res) => {
    try {
        // Find all users with the role of 'patient'
        const patients = await User.find({ role: 'patient' }).select('-password');

        // Send the list of patients in the response
        res.status(200).json(patients);
    } catch (error) {
        // Handle any server-side errors
        res.status(500).json({ message: 'Server error' });
    }
};

// Export the controller functions
module.exports = {
    getPatients,
};
