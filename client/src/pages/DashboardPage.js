// File: src/pages/DashboardPage.js

import React, { useEffect, useState } from 'react';
import PatientDashboard from '../components/PatientDashboard'; // Import the patient dashboard component
import DoctorDashboard from '../components/DoctorDashboard'; // Import the doctor dashboard component

/**
 * @description The main dashboard component for authenticated users.
 * It checks the user's role and renders the appropriate dashboard.
 * @returns {JSX.Element} The Dashboard Page component.
 */
function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage after the component mounts
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []); // The empty dependency array ensures this runs only once

  return (
    <div className="container mx-auto p-4 min-h-screen">
      {user ? (
        <>
          {/* Conditional rendering based on user role */}
          {user.role === 'patient' ? (
            <PatientDashboard user={user} />
          ) : (
            <DoctorDashboard user={user} />
          )}
        </>
      ) : (
        // Message to display if the user is not logged in
        <div className="flex flex-col items-center justify-center text-center h-full">
          <p className="text-lg text-red-500 font-semibold">
            You are not logged in. Please log in to view this page.
          </p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
