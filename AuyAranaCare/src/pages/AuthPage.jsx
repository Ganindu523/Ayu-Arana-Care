import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import {
    AtSymbolIcon,
    LockClosedIcon,
    UserIcon,
    DevicePhoneMobileIcon,
    IdentificationIcon,
    HashtagIcon,
    CakeIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext.jsx';

// Reusable Input Component for the forms
const FormInput = ({ icon, label, name, type, value, onChange, required = true }) => {
    const Icon = icon;
    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={label}
                className="peer block w-full rounded-md border border-gray-300 bg-gray-50 py-2.5 pl-10 text-gray-900 placeholder-transparent shadow-sm focus:border-red-800 focus:ring-red-800 sm:text-sm"
                autoComplete="off"
            />
            <label
                htmlFor={name}
                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs"
            >
                {label}
            </label>
        </div>
    );
};

// Main Authentication Page Component
export default function App() { // Changed to App for direct rendering in Canvas
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();
    const { login, adminLogin } = useAuth();

    // Animation for the overlay container
    const overlayAnimation = useSpring({
        transform: isRegister ? 'translateX(-100%)' : 'translateX(0%)',
        config: { tension: 280, friction: 30 }
    });

    // Animation for the form panels
    const loginFormAnimation = useSpring({
        left: isRegister ? '-50%' : '0%',
        config: { tension: 280, friction: 30 }
    });

    const registerFormAnimation = useSpring({
        left: isRegister ? '50%' : '100%',
        config: { tension: 280, friction: 30 }
    });

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        phone: '',
        nic: '',
        parentId: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLoginChange = e => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleRegisterChange = e => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

    const clearMessages = () => {
        setError('');
        setSuccessMessage('');
    };

    const handleLoginSubmit = async (event, loginType = 'user') => {
        event.preventDefault();
        clearMessages();
        setLoading(true);

        const API_URL = loginType === 'admin'
            ? 'http://localhost:5000/api/admin/login'
            : 'http://localhost:5000/api/auth/login';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed. Please check credentials.');
            }

            setSuccessMessage(data.message || 'Login successful!');

            if (loginType === 'admin') {
                if (data.token && data.admin) {
                    adminLogin(data.admin, data.token);
                    // Updated redirect path for admin login to AdminAddCenters
                    navigate('/admin/add-centers');
                } else {
                    throw new Error('Admin login data missing from server response.');
                }
            } else {
                if (data.user && data.token) {
                    login(data.user, data.token);
                    navigate('/'); // Redirect to user home page
                } else {
                    throw new Error('User login data missing from server response.');
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        clearMessages();
        if (registerData.password !== registerData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        const { confirmPassword, ...payload } = registerData;
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed.');
            setSuccessMessage(data.message || 'Registration successful! Please log in.');
            setRegisterData({ fullName: '', email: '', phone: '', nic: '', parentId: '', dateOfBirth: '', password: '', confirmPassword: '' });
            setIsRegister(false); // Switch back to login view
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="relative w-full max-w-4xl h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* Login Form Panel */}
                <animated.div className="absolute top-0 w-1/2 h-full p-8 sm:p-12 flex flex-col justify-center" style={loginFormAnimation}>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Login</h2>
                    {error && !isRegister && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-md">{error}</p>}
                    {successMessage && !isRegister && <p className="text-green-500 text-sm mb-4 p-3 bg-green-50 rounded-md">{successMessage}</p>}

                    <form onSubmit={(e) => handleLoginSubmit(e, 'user')} className="space-y-6">
                        <FormInput icon={AtSymbolIcon} label="Email" name="email" type="email" value={loginData.email} onChange={handleLoginChange} />
                        <FormInput icon={LockClosedIcon} label="Password" name="password" type="password" value={loginData.password} onChange={handleLoginChange} />
                        <button type="submit" disabled={loading} className="w-full bg-red-800 text-white py-2.5 rounded-full hover:bg-red-900 transition-colors disabled:bg-red-300 font-semibold tracking-wider uppercase">
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className="mt-6 border-t pt-6">
                        <button type="button" onClick={(e) => handleLoginSubmit(e, 'admin')} disabled={loading} className="w-full bg-gray-700 text-white py-2.5 rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-500 font-semibold tracking-wider uppercase">
                            {loading ? 'Logging in...' : 'Admin Login'}
                        </button>
                    </div>
                </animated.div>

                {/* Register Form Panel */}
                <animated.div className="absolute top-0 w-1/2 h-full p-8 sm:p-12 flex flex-col justify-center" style={registerFormAnimation}>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Account</h2>
                    {error && isRegister && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-md">{error}</p>}

                    <form onSubmit={handleRegisterSubmit} className="space-y-5">
                        <FormInput icon={UserIcon} label="Full Name" name="fullName" type="text" value={registerData.fullName} onChange={handleRegisterChange} />
                        <FormInput icon={AtSymbolIcon} label="Email" name="email" type="email" value={registerData.email} onChange={handleRegisterChange} />
                        <FormInput icon={DevicePhoneMobileIcon} label="Phone Number" name="phone" type="tel" value={registerData.phone} onChange={handleRegisterChange} />
                        <FormInput icon={IdentificationIcon} label="NIC Number" name="nic" type="text" value={registerData.nic} onChange={handleRegisterChange} />
                        <FormInput icon={HashtagIcon} label="Parent Registration ID" name="parentId" type="number" value={registerData.parentId} onChange={handleRegisterChange} />
                        <FormInput icon={CakeIcon} label="Date of Birth" name="dateOfBirth" type="date" value={registerData.dateOfBirth} onChange={handleRegisterChange} />
                        <FormInput icon={LockClosedIcon} label="Password" name="password" type="password" value={registerData.password} onChange={handleRegisterChange} />
                        <FormInput icon={LockClosedIcon} label="Confirm Password" name="confirmPassword" type="password" value={registerData.confirmPassword} onChange={handleRegisterChange} />

                        <button type="submit" disabled={loading} className="w-full bg-red-800 text-white py-2.5 rounded-full hover:bg-red-900 transition-colors disabled:bg-red-300 font-semibold tracking-wider uppercase">
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </animated.div>

                {/* Overlay Container */}
                <animated.div className="absolute top-0 left-1/2 w-1/2 h-full z-10" style={overlayAnimation}>
                    <div className="relative h-full w-full bg-gradient-to-r from-red-800 to-red-950 text-white text-center flex flex-col justify-center items-center p-12">
                        {/* Overlay for Login Side */}
                        <div className={`absolute w-full h-full flex flex-col justify-center items-center p-12 transition-all duration-500 ease-in-out ${isRegister ? 'opacity-0 transform -translate-x-full' : 'opacity-100 transform translate-x-0'}`}>
                            <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
                            <p className="mb-8">Enter your personal details and start your journey with us</p>
                            <button onClick={() => { setIsRegister(true); clearMessages(); }} className="bg-transparent border-2 border-white py-2 px-10 rounded-full font-semibold uppercase tracking-wider hover:bg-white hover:text-red-800 transition-colors">
                                Register
                            </button>
                        </div>
                        {/* Overlay for Register Side */}
                        <div className={`absolute w-full h-full flex flex-col justify-center items-center p-12 transition-all duration-500 ease-in-out ${isRegister ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-full'}`}>
                            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                            <p className="mb-8">To keep connected with us please login with your personal info</p>
                            <button onClick={() => { setIsRegister(false); clearMessages(); }} className="bg-transparent border-2 border-white py-2 px-10 rounded-full font-semibold uppercase tracking-wider hover:bg-white hover:text-red-800 transition-colors">
                                Login
                            </button>
                        </div>
                    </div>
                </animated.div>

            </div>
        </div>
    );
}