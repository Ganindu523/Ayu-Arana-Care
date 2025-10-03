// Path: /src/pages/AdminPages/AdminRegistrationPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserIcon, AtSymbolIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function AdminRegistrationPage() {
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegisterChange = e => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const clearMessages = () => {
        setError('');
        setSuccessMessage('');
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        clearMessages();

        if (registerData.password !== registerData.confirmPassword) {
            setError("Passwords do not match. Please ensure both passwords are the same.");
            return;
        }

        setLoading(true);

        const { confirmPassword, ...payload } = registerData;

        try {
            // This fetch call targets the backend route we are about to create.
            const response = await fetch('http://localhost:5000/api/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Admin registration failed.');
            }

            setSuccessMessage(data.message || 'Admin account successfully created!');
            setRegisterData({ fullName: '', email: '', password: '', confirmPassword: '' });

            setTimeout(() => {
                navigate('/auth'); // Redirect to the main login page after success
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderFloatingInput = (label, name, type, value, onChange, Icon) => (
        <div className="relative mb-5">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />}
            <input
                type={type} name={name} id={name} value={value}
                onChange={onChange} required disabled={loading} placeholder=" "
                className={`peer w-full border border-gray-300 rounded px-3 pt-4 pb-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 ${Icon ? 'pl-10' : ''}`}
            />
            <label htmlFor={name} className={`absolute ${Icon ? 'left-10' : 'left-2.5'} -top-2.5 text-gray-500 bg-white px-1 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:${Icon ? 'left-10' : 'left-3.5'} peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:${Icon ? 'left-10' : 'left-2.5'} peer-focus:text-sm peer-focus:text-blue-500 ${value ? '!-top-2.5 !text-sm !text-blue-500' : ''} pointer-events-none`}>
                {label}
            </label>
        </div>
    );

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-8 px-4">
            <div className="w-full max-w-lg bg-white shadow-xl rounded-lg border p-8 sm:p-10">
                <h2 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">Admin Registration</h2>
                <p className="text-lg text-gray-600 mb-8 text-center">
                    Create a new administrator account to manage the system.
                </p>

                {error && <p className="text-red-600 text-sm mb-6 p-3 bg-red-100 border border-red-200 rounded-md">{error}</p>}
                {successMessage && <p className="text-green-600 text-sm mb-6 p-3 bg-green-100 border border-green-200 rounded-md">{successMessage}</p>}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    {renderFloatingInput('Full Name', 'fullName', 'text', registerData.fullName, handleRegisterChange, UserIcon)}
                    {renderFloatingInput('Admin Email', 'email', 'email', registerData.email, handleRegisterChange, AtSymbolIcon)}
                    {renderFloatingInput('Password', 'password', 'password', registerData.password, handleRegisterChange, LockClosedIcon)}
                    {renderFloatingInput('Confirm Password', 'confirmPassword', 'password', registerData.confirmPassword, handleRegisterChange, LockClosedIcon)}
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition duration-150 ease-in-out mt-6">
                        {loading ? 'Registering Admin...' : 'Register Admin Account'}
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-600">
                    Already have an admin account?{' '}
                    <Link to="/auth" className="text-blue-600 hover:text-blue-800 font-medium">
                        Log in here
                    </Link>
                </div>
            </div>
        </div>
    );
}
