// File: server/models/Appointment.js

const mongoose = require('mongoose');

/**
 * @description Mongoose schema for the Appointment model.
 * It defines the structure and data types for an appointment document.
 */
const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Reference to the User model (the patient)
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Reference to the User model (the doctor)
        },
        date: {
            type: Date,
            required: true,
        },
        reason: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

// Create the Appointment model from the schema
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
