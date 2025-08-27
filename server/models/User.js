// File: server/models/User.js

// Import necessary libraries
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @description Defines the Mongoose schema for a User.
 * This schema includes fields for name, email, password, and user role.
 * It also includes pre-save middleware to hash passwords before saving.
 */
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Removes whitespace from both ends of a string
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no two users can have the same email
        lowercase: true, // Converts email to lowercase before saving
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['patient', 'doctor', 'admin'], // Restricts the role to one of these values
        default: 'patient', // Sets 'patient' as the default role
    },
}, {
    // Adds `createdAt` and `updatedAt` timestamps to the schema
    timestamps: true,
});

/**
 * @description Pre-save middleware to hash the user's password before saving.
 * This is a crucial security step to prevent storing plain-text passwords.
 * It only runs if the password field is being modified.
 */
userSchema.pre('save', async function (next) {
    // If the password field has not been modified, move to the next middleware
    if (!this.isModified('password')) {
        next();
    }

    try {
        // Generate a salt with a cost factor of 10
        const salt = await bcrypt.genSalt(10);
        // Hash the password using the generated salt
        this.password = await bcrypt.hash(this.password, salt);
        next(); // Move to the next middleware
    } catch (error) {
        // Pass any errors to the next middleware
        next(error);
    }
});

/**
 * @description Method to compare a plain-text password with the stored hashed password.
 * @param {string} enteredPassword The password entered by the user.
 * @returns {Promise<boolean>} A promise that resolves to true if passwords match, otherwise false.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    // Use bcrypt.compare() to compare the entered password with the hashed password
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model from the schema
const User = mongoose.model('User', userSchema);
module.exports = User;
