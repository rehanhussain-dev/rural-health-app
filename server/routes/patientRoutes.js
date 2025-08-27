// File: server/routes/patientRoutes.js

const express = require('express');
const router = express.Router();
const { getPatients, getDoctors } = require('../controllers/patientController'); // Import the new getDoctors controller
const { protect, restrictTo } = require('../middleware/authMiddleware');

/**
 * @description Define the patient routes.
 * These routes handle fetching patient and doctor data.
 */

// Route to get a list of all patients. This route is protected.
// Only users with the 'doctor' role can access this.
router.get('/', protect, restrictTo('doctor'), getPatients);

// New route to get a list of all doctors. This is a public route,
// as patients need to see a list of doctors before they log in.
router.get('/doctors', getDoctors);

// Export the router to be used in server.js
module.exports = router;
