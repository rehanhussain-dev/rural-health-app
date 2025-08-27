// File: src/components/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * @description A dynamic navigation bar component.
 * It shows different links based on the user's authentication status.
 * @returns {JSX.Element} The Navbar component.
 */
const Navbar = () => {
  // useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  // State to track if a user is logged in
  const [user, setUser] = useState(null);

  /**
   * @description Effect to check for user data in localStorage on component mount.
   * This determines which links to display in the navbar.
   */
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      // If user data exists, set the user state.
      setUser(JSON.parse(userData));
    } else {
      // If no user data, ensure the user state is null.
      setUser(null);
    }
  }, []);

  /**
   * @description Handles the user logout process.
   * Removes the user data from localStorage and redirects to the home page.
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null); // Clear the user state
    navigate('/'); // Navigate to the home page
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or App Name */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Rural Health App
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          {user ? (
            // Links for authenticated users
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-semibold transition duration-300">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-semibold transition duration-300 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            // Links for unauthenticated users
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-semibold transition duration-300">
                Login
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600 font-semibold transition duration-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
