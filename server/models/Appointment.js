// File: server/models/Appointment.js

// Import necessary libraries
const mongoose = require('mongoose');

/**
 * @description Defines the Mongoose schema for an Appointment.
 * This schema links a patient and a doctor (by their user IDs) to a specific
 * appointment date, time, and status.
 */
const appointmentSchema = mongoose.Schema({
    patient: {
        // This is how you reference another model in Mongoose.
        // The `type` is set to `mongoose.Schema.Types.ObjectId`, which is
        // the unique identifier for a MongoDB document.
        type: mongoose.Schema.Types.ObjectId,
        // The `ref` field specifies which model this ID refers to.
        // This allows Mongoose to "populate" the patient's data later.
        ref: 'User',
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'completed', 'canceled'],
        default: 'pending',
    },
}, {
    // Adds `createdAt` and `updatedAt` timestamps to the schema
    timestamps: true,
});

// Create and export the Appointment model from the schema
const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
