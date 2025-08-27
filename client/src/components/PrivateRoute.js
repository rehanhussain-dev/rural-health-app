// File: src/components/PrivateRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * @description A component that acts as a wrapper to protect routes.
 * It checks if a user is authenticated (by looking for a 'user' item in localStorage).
 * If authenticated, it renders the child route's content via <Outlet>.
 * If not authenticated, it redirects the user to the login page.
 * @returns {JSX.Element} Either the protected route's content or a redirect to login.
 */
const PrivateRoute = () => {
  // Check for the user item in localStorage
  const user = localStorage.getItem('user');

  // If the user is logged in, render the child component
  // The <Outlet> component renders the element defined in the child <Route>
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
