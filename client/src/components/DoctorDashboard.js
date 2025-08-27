// File: src/components/DoctorDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * @description The dashboard component for doctors.
 * It fetches and displays features and information relevant to a doctor,
 * including a list of their patients and upcoming appointments.
 * @param {object} props The component props.
 * @param {object} props.user The logged-in user object.
 * @returns {JSX.Element} The Doctor Dashboard component.
 */
const DoctorDashboard = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Common configuration for protected API calls
  const token = JSON.parse(localStorage.getItem('user')).token;
  const authConfig = {
      headers: {
          Authorization: `Bearer ${token}`,
      },
  };

  /**
   * @description Fetches the list of all patients and appointments from the backend API.
   * This request is protected and requires a valid JWT.
   */
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('/api/patients', authConfig);
        setPatients(response.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. Please try again.');
      } finally {
        setLoadingPatients(false);
      }
    };

    const fetchAppointments = async () => {
        try {
          const response = await axios.get('/api/appointments/my', authConfig);
          setAppointments(response.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to load appointments. Please try again.');
        } finally {
            setLoadingAppointments(false);
        }
    };

    fetchPatients();
    fetchAppointments();
  }, []); // Empty dependency array means this effect runs only once on mount

  /**
   * @description Handles updating an appointment's status.
   * @param {string} id The appointment's ID.
   * @param {string} newStatus The new status ('confirmed' or 'cancelled').
   */
  const handleStatusUpdate = async (id, newStatus) => {
      try {
          // Send a PUT request to update the appointment status
          const response = await axios.put(
              `/api/appointments/${id}/status`,
              { status: newStatus },
              authConfig
          );
          
          setStatusMessage(response.data.message);
          
          // Re-fetch appointments to update the list
          const updatedAppointments = await axios.get('/api/appointments/my', authConfig);
          setAppointments(updatedAppointments.data);

          // Clear the message after a few seconds
          setTimeout(() => setStatusMessage(''), 5000);

      } catch (err) {
          console.error('Error updating status:', err);
          setStatusMessage('Failed to update status. Please try again.');
      }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Doctor Dashboard
      </h2>
      <p className="text-lg text-gray-600 mb-4">
        Hello, Dr. <span className="font-semibold text-blue-600">{user.name}</span>! Welcome to your practice management dashboard.
      </p>

      {/* Conditional rendering for loading, error, and data */}
      {error ? (
        <p className="text-red-500 font-semibold">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Appointments List Section */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    Upcoming Appointments
                </h3>
                {statusMessage && (
                    <div className="p-3 bg-green-100 text-green-700 rounded-lg mb-4">
                        {statusMessage}
                    </div>
                )}
                {loadingAppointments ? (
                    <p className="text-gray-500">Loading appointments...</p>
                ) : appointments.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {appointments.map((appointment) => (
                            <li key={appointment._id} className="py-4">
                                <p className="text-lg font-medium text-gray-900">
                                    Appointment with {appointment.patient.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Date: {new Date(appointment.date).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Reason: {appointment.reason}
                                </p>
                                <p className="text-sm font-semibold text-blue-600">
                                    Status: {appointment.status}
                                </p>
                                
                                {/* Action Buttons */}
                                <div className="mt-2 flex space-x-2">
                                    {appointment.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                                                className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    {appointment.status !== 'pending' && (
                                        <p className="text-sm text-gray-500 italic">
                                            Status updated.
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">You have no upcoming appointments.</p>
                )}
            </div>

            {/* Patient List Section */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    My Patients
                </h3>
                {loadingPatients ? (
                    <p className="text-gray-500">Loading patients...</p>
                ) : patients.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {patients.map((patient) => (
                            <li key={patient._id} className="py-4">
                                <p className="text-lg font-medium text-gray-900">
                                    {patient.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Email: {patient.email}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No patients found.</p>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
