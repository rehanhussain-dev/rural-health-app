// File: server/routes/appointmentRoutes.js

const express = require('express');
const router = express.Router();
const { bookAppointment, getMyAppointments, updateAppointmentStatus, cancelAppointment, getAllAppointments } = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

/**
 * @description Define the appointment routes.
 * These routes handle appointment booking, fetching, and status updates.
 */

// Route to book a new appointment.
router.post('/book', protect, restrictTo('patient'), bookAppointment);

// Route to get all appointments for a logged-in user.
router.get('/my', protect, getMyAppointments);

// Route for doctors to update the status of an appointment.
router.put('/:id/status', protect, restrictTo('doctor'), updateAppointmentStatus);

// Route for patients to cancel their own appointments.
router.put('/cancel/:id', protect, restrictTo('patient'), cancelAppointment);

// New route for admin to get a list of all appointments.
router.get('/all', protect, restrictTo('admin'), getAllAppointments);

// Export the router to be used in server.js
module.exports = router;
