// File: src/pages/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @description The landing page component.
 * It provides a basic welcome message and links for users to log in or register.
 * @returns {JSX.Element} The Home Page component.
 */
function HomePage() {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
        Welcome to the Rural Health App
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Connecting patients and doctors for seamless healthcare in rural areas.
      </p>
      <div className="space-x-4">
        <Link 
          to="/login"
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Log In
        </Link>
        <Link 
          to="/register"
          className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
