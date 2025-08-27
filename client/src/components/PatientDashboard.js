// File: src/components/PatientDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * @description The dashboard component for patients.
 * It will display features and information relevant to a patient,
 * including a list of doctors to book an appointment with and their upcoming appointments.
 * @param {object} props The component props.
 * @param {object} props.user The logged-in user object.
 * @returns {JSX.Element} The Patient Dashboard component.
 */
const PatientDashboard = ({ user }) => {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
        reason: '',
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    
    // Destructure form data for easier access
    const { doctorId, date, reason } = formData;

    // Common configuration for protected API calls
    const token = JSON.parse(localStorage.getItem('user')).token;
    const authConfig = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    /**
     * @description Fetches the list of all doctors and appointments from the backend API.
     */
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('/api/patients/doctors');
                setDoctors(response.data);
            } catch (err) {
                console.error('Error fetching doctors:', err);
                setMessage('Failed to load doctors. Please try again.');
                setIsError(true);
            } finally {
                setLoadingDoctors(false);
            }
        };

        const fetchAppointments = async () => {
            try {
                const response = await axios.get('/api/appointments/my', authConfig);
                setAppointments(response.data);
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setMessage('Failed to load appointments. Please try again.');
                setIsError(true);
            } finally {
                setLoadingAppointments(false);
            }
        };

        fetchDoctors();
        fetchAppointments();
    }, []); // Empty dependency array means this effect runs only once on mount

    /**
     * @description Handles changes to the form input fields.
     */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * @description Handles the form submission for booking an appointment.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        setIsError(false);
        
        try {
            // Send the appointment data to the backend
            const response = await axios.post('/api/appointments/book', formData, authConfig);
            
            setMessage(response.data.message);
            
            // Re-fetch appointments after a successful booking to update the list
            const updatedAppointments = await axios.get('/api/appointments/my', authConfig);
            setAppointments(updatedAppointments.data);

            // Reset the form after a successful booking
            setFormData({
                doctorId: '',
                date: '',
                reason: '',
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Something went wrong';
            setMessage(errorMessage);
            setIsError(true);
        }
    };
    
    /**
     * @description Handles canceling an appointment.
     * @param {string} appointmentId The ID of the appointment to cancel.
     */
    const handleCancelAppointment = async (appointmentId) => {
        setMessage(''); // Clear previous messages
        setIsError(false);
        
        try {
            const response = await axios.put(`/api/appointments/cancel/${appointmentId}`, {}, authConfig);
            
            setMessage(response.data.message);
            
            // Re-fetch appointments to update the list
            const updatedAppointments = await axios.get('/api/appointments/my', authConfig);
            setAppointments(updatedAppointments.data);
            
            // Clear the message after a few seconds
            setTimeout(() => setMessage(''), 5000);
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to cancel appointment.';
            setMessage(errorMessage);
            setIsError(true);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Patient Dashboard
            </h2>
            <p className="text-lg text-gray-600 mb-4">
                Hello, <span className="font-semibold text-blue-600">{user.name}</span>! Welcome to your personalized patient dashboard.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Appointment Booking Section */}
                <div>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                        Book an Appointment
                    </h3>
                    
                    {/* Display messages to the user */}
                    {message && (
                        <div className={`p-3 rounded-lg text-center mb-4 ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}
                    
                    {loadingDoctors ? (
                        <p className="text-gray-500">Loading doctors...</p>
                    ) : doctors.length > 0 ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="doctorId" className="block text-gray-700 font-semibold mb-2">
                                    Select a Doctor
                                </label>
                                <select
                                    id="doctorId"
                                    name="doctorId"
                                    value={doctorId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">-- Choose a doctor --</option>
                                    {doctors.map((doctor) => (
                                        <option key={doctor._id} value={doctor._id}>
                                            Dr. {doctor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">
                                    Appointment Date and Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="date"
                                    name="date"
                                    value={date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="reason" className="block text-gray-700 font-semibold mb-2">
                                    Reason for Visit
                                </label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    value={reason}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="e.g., General check-up, headache, follow-up"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                ></textarea>
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Book Appointment
                            </button>
                        </form>
                    ) : (
                        <p className="text-gray-500">No doctors available to book appointments with.</p>
                    )}
                </div>

                {/* Patient's Upcoming Appointments Section */}
                <div>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                        Your Appointments
                    </h3>
                    
                    {loadingAppointments ? (
                        <p className="text-gray-500">Loading appointments...</p>
                    ) : appointments.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {appointments.map((appointment) => (
                                <li key={appointment._id} className="py-4">
                                    <p className="text-lg font-medium text-gray-900">
                                        Appointment with Dr. {appointment.doctor.name}
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
                                    
                                    {/* Cancel Button */}
                                    {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                        <div className="mt-2">
                                            <button
                                                onClick={() => handleCancelAppointment(appointment._id)}
                                                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                            >
                                                Cancel Appointment
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">You have no upcoming appointments.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
