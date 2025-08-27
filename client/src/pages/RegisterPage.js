// File: src/pages/RegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * @description The registration page component with a functional form.
 * It manages form state and provides a user-friendly interface for registration.
 * @returns {JSX.Element} The Register Page component.
 */
function RegisterPage() {
  const navigate = useNavigate();

  // State to manage form input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient', // Default role is 'patient'
  });

  // State to handle and display messages to the user
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Destructure form data for easier access
  const { name, email, password, role } = formData;

  /**
   * @description Handles changes to the form input fields.
   * Updates the component state as the user types.
   * @param {object} e The event object from the input change.
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * @description Handles the form submission.
   * Sends the user data to the backend for registration.
   * @param {object} e The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setIsError(false); // Reset error state

    try {
      // Make a POST request to the registration endpoint
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        role,
      });

      // If registration is successful, store the user token and redirect
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/dashboard'); // Redirect to a dashboard or home page
      }
    } catch (error) {
      // Handle registration errors from the server
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Create an Account
        </h2>
        
        {/* Display messages to the user */}
        {message && (
          <div className={`p-3 rounded-lg text-center mb-4 ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {/* The registration form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="role">
              Register as
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
