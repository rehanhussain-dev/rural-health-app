// File: src/components/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * @description The dashboard component for administrators.
 * It fetches and displays a comprehensive list of all users and all appointments
 * in the system.
 * @param {object} props The component props.
 * @param {object} props.user The logged-in admin user object.
 * @returns {JSX.Element} The Admin Dashboard component.
 */
const AdminDashboard = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [error, setError] = useState(null);

    // Common configuration for protected API calls
    const token = JSON.parse(localStorage.getItem('user')).token;
    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    /**
     * @description Fetches the list of all users and appointments from the backend API.
     */
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                // Fetch all users using the new admin-only route
                const response = await axios.get('/api/users/all', authConfig);
                setUsers(response.data);
            } catch (err) {
                console.error('Error fetching all users:', err);
                setError('Failed to load users. Please try again.');
            } finally {
                setLoadingUsers(false);
            }
        };

        const fetchAllAppointments = async () => {
            try {
                // Fetch all appointments using the new admin-only route
                const response = await axios.get('/api/appointments/all', authConfig);
                setAppointments(response.data);
            } catch (err) {
                console.error('Error fetching all appointments:', err);
                setError('Failed to load appointments. Please try again.');
            } finally {
                setLoadingAppointments(false);
            }
        };

        fetchAllUsers();
        fetchAllAppointments();
    }, []); // Empty dependency array means this effect runs only once on mount

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Admin Dashboard
            </h2>
            <p className="text-lg text-gray-600 mb-4">
                Hello, <span className="font-semibold text-blue-600">{user.name}</span>! Welcome to the administrator control panel.
            </p>

            {/* Conditional rendering for loading, error, and data */}
            {error ? (
                <p className="text-red-500 font-semibold">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* All Users Section */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                            All Users
                        </h3>
                        {loadingUsers ? (
                            <p className="text-gray-500">Loading users...</p>
                        ) : users.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <li key={user._id} className="py-4">
                                        <p className="text-lg font-medium text-gray-900">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Email: {user.email}
                                        </p>
                                        <p className="text-sm font-semibold text-blue-600">
                                            Role: {user.role}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No users found.</p>
                        )}
                    </div>

                    {/* All Appointments Section */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                            All Appointments
                        </h3>
                        {loadingAppointments ? (
                            <p className="text-gray-500">Loading appointments...</p>
                        ) : appointments.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {appointments.map((appointment) => (
                                    <li key={appointment._id} className="py-4">
                                        <p className="text-lg font-medium text-gray-900">
                                            Patient: {appointment.patient.name}
                                        </p>
                                        <p className="text-lg font-medium text-gray-900">
                                            Doctor: {appointment.doctor.name}
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
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No appointments found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
