// File: server/config/db.js

// Import necessary libraries
const mongoose = require('mongoose'); // Mongoose for database interaction
const dotenv = require('dotenv');   // Dotenv to load environment variables from .env file

// Load environment variables from .env file
dotenv.config();

/**
 * @description Establishes a connection to the MongoDB database.
 * @async
 * @function connectDB
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 */
const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI from environment variables
        // The `connect` method returns a promise, so we use `await` to wait for it to resolve
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // These options are recommended by Mongoose to avoid deprecation warnings
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Log a success message to the console
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        // Log the error message if the connection fails
        console.error(`Error: ${error.message}`);
        // Exit the process with a failure code
        process.exit(1);
    }
};

// Export the function to be used in other files (e.g., server.js)
module.exports = connectDB;
