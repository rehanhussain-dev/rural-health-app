// File: server/server.js

// Import necessary libraries and files
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the database connection function

// Load environment variables from a .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware
// Enable CORS (Cross-Origin Resource Sharing) to allow requests from your frontend
app.use(cors());

// Parse incoming JSON requests. This is a built-in Express middleware.
app.use(express.json());

// Connect to the MongoDB database
connectDB();

// Define a simple welcome route to confirm the server is running
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import and mount the API routes
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const patientRoutes = require('./routes/patientRoutes');

// Use the routes for their specific API endpoints
// This organizes your API and keeps your server.js file clean
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);

// Define the port for the server to listen on
// It uses the PORT from the environment variables, or defaults to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

