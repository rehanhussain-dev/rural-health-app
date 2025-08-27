// File: server/controllers/appointmentController.js

const Appointment = require('../models/Appointment');
const User = require('../models/User');

/**
 * @description Books a new appointment.
 * @route POST /api/appointments/book
 * @access Private (Patient only)
 * @param {object} req The request object.
 * @param {object} res The response object.
 */
const bookAppointment = async (req, res) => {
    const { doctorId, date, reason } = req.body;
    const patientId = req.user._id;

    try {
        // Find the doctor to ensure they exist
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Create the new appointment
        const appointment = await Appointment.create({
            patient: patientId,
            doctor: doctorId,
            date,
            reason,
        });

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment,
        });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @description Gets all appointments for the logged-in user.
 * This route is versatile and works for both patients and doctors.
 * @route GET /api/appointments/my
 * @access Private
 * @param {object} req The request object.
 * @param {object} res The response object.
 */
const getMyAppointments = async (req, res) => {
    const userId = req.user._id;
    const userRole = req.user.role;

    try {
        let appointments;

        // Fetch appointments based on the user's role
        if (userRole === 'patient') {
            // Populate the doctor field to get doctor details
            appointments = await Appointment.find({ patient: userId }).populate('doctor', 'name email');
        } else if (userRole === 'doctor') {
            // Populate the patient field to get patient details
            appointments = await Appointment.find({ doctor: userId }).populate('patient', 'name email');
        } else {
            return res.status(403).json({ message: 'Invalid user role' });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @description Updates the status of an appointment.
 * @route PUT /api/appointments/:id/status
 * @access Private (Doctor only)
 * @param {object} req The request object.
 * @param {object} res The response object.
 */
const updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;
    const appointmentId = req.params.id;

    // Validate the new status
    if (!['confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
        // Find the appointment by ID and update its status
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        // Check if the logged-in user is the doctor for this appointment
        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this appointment.' });
        }

        // Update the status and save
        appointment.status = status;
        await appointment.save();

        res.status(200).json({
            message: `Appointment ${status} successfully.`,
            appointment,
        });
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

/**
 * @description Allows a patient to cancel their own appointment.
 * @route PUT /api/appointments/cancel/:id
 * @access Private (Patient only)
 * @param {object} req The request object.
 * @param {object} res The response object.
 */
const cancelAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const patientId = req.user._id;

    try {
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        // Ensure the logged-in patient is the one who booked the appointment
        if (appointment.patient.toString() !== patientId.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this appointment.' });
        }

        // Update the status to 'cancelled'
        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({
            message: 'Appointment cancelled successfully.',
            appointment,
        });
    } catch (error) {
        console.error('Error canceling appointment:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

/**
 * @description Gets all appointments in the database.
 * @route GET /api/appointments/all
 * @access Private (Admin only)
 * @param {object} req The request object.
 * @param {object} res The response object.
 */
const getAllAppointments = async (req, res) => {
    try {
        // Find all appointments and populate with patient and doctor details
        const appointments = await Appointment.find()
            .populate('patient', 'name email')
            .populate('doctor', 'name email');

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching all appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    bookAppointment,
    getMyAppointments,
    updateAppointmentStatus,
    cancelAppointment,
    getAllAppointments,
};
