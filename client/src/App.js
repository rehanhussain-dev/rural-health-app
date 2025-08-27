// File: src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage'; // Corrected import path
import Register from './pages/RegisterPage'; // Assuming Register is also in the pages folder
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard'; // Import the new component

/**
 * @description The main application component.
 * It manages user authentication state and handles routing
 * to different dashboards based on the user's role.
 * @returns {JSX.Element} The App component.
 */
const App = () => {
  // State to hold the current user and their authentication status
  const [user, setUser] = useState(null);
  const [loginMessage, setLoginMessage] = useState(null);

  /**
   * @description Effect to check for an authenticated user on component mount.
   * It retrieves the user from local storage and sets the state.
   */
  useEffect(() => {
    // Check local storage for an existing user
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []); // Empty dependency array ensures this runs once

  /**
   * @description Handles the login process by setting the user state and
   * storing the user in local storage.
   * @param {object} userData The user data received after successful login.
   */
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setLoginMessage(`Successfully logged in as a ${userData.role}. Redirecting to dashboard...`);
    setTimeout(() => {
      setLoginMessage(null);
    }, 3000);
  };

  /**
   * @description Handles the logout process by clearing the user state and
   * removing the user from local storage.
   */
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  /**
   * @description Handles the registration process and displays feedback.
   * @param {string} message The message to display after registration attempt.
   * @param {boolean} isError Whether the message is an error.
   */
  const handleRegisterFeedback = (message, isError) => {
    setLoginMessage(message);
    // You can handle error state separately if needed, for now we'll just use a single message
    setTimeout(() => {
      setLoginMessage(null);
    }, 5000);
  };

  /**
   * @description A protected route component.
   * It checks if a user is logged in before rendering the children.
   * @param {object} props The component props.
   * @param {object} props.children The components to be rendered if authenticated.
   * @returns {JSX.Element} The protected route or a redirect to the login page.
   */
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };
  
  // A component to display the correct dashboard based on the user's role
  const Dashboard = () => {
    if (user.role === 'patient') {
      return <PatientDashboard user={user} />;
    } else if (user.role === 'doctor') {
      return <DoctorDashboard user={user} />;
    } else if (user.role === 'admin') {
      return <AdminDashboard user={user} />;
    }
    return <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-8">
        <nav className="bg-white rounded-lg shadow-md p-4 mb-8 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition">
            MedApp
          </Link>
          <div className="flex space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-blue-600 transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>

        {loginMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center mb-4">
            {loginMessage}
          </div>
        )}

        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegisterFeedback} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
