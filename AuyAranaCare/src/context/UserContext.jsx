import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context object
export const UserContext = createContext(null); // Keep UserContext as the export name

// Create the Provider component that will wrap your app
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // For regular users
    const [admin, setAdmin] = useState(null); // For admin users
    const [loading, setLoading] = useState(true); // To indicate if initial auth check is complete
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            setLoading(true);
            try {
                const storedUser = localStorage.getItem('user');
                const storedAdmin = localStorage.getItem('admin');
                const userToken = localStorage.getItem('userToken');
                const adminToken = localStorage.getItem('adminToken');

                if (storedUser && userToken) {
                    const parsedUser = JSON.parse(storedUser);
                    // In a real app, you'd validate the token with the backend here.
                    // For now, assume it's valid if present.
                    setUser(parsedUser);
                } else if (storedAdmin && adminToken) {
                    const parsedAdmin = JSON.parse(storedAdmin);
                    // In a real app, you'd validate the token with the backend here.
                    // For now, assume it's valid if present.
                    setAdmin(parsedAdmin);
                }
            } catch (error) {
                console.error("Failed to parse session data from storage or token invalid", error);
                // Clear storage if data is corrupted
                localStorage.clear();
                setUser(null);
                setAdmin(null);
            } finally {
                setLoading(false); // Finished loading session
            }
        };
        checkSession();
    }, []);

    // Function for regular user login
    const login = (userData, token) => {
        setUser(userData);
        setAdmin(null); // Ensure admin state is cleared if a user logs in
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userToken', token);
        localStorage.removeItem('admin'); // Clear admin data from storage
        localStorage.removeItem('adminToken');
        navigate('/'); // Redirect regular users to home
    };

    // Function for admin login
    const adminLogin = (adminData, token) => {
        setAdmin(adminData);
        setUser(null); // Ensure user state is cleared if an admin logs in
        localStorage.setItem('admin', JSON.stringify(adminData));
        localStorage.setItem('adminToken', token);
        localStorage.removeItem('user'); // Clear user data from storage
        localStorage.removeItem('userToken');

        // --- UPDATED: Redirect admin directly to /admin/careers ---
        navigate('/admin/careers');
    };

    // Universal logout function
    const logout = () => {
        setUser(null);
        setAdmin(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
        navigate('/auth'); // Redirect to the common login page after logging out
    };

    // The values that will be available to all components wrapped by this provider
    const value = {
        user,
        admin,
        isAuthenticated: !!user, // True if a regular user is logged in
        isAdminAuthenticated: !!admin, // True if an admin is logged in
        loading, // Still important to indicate if initial check is done
        login, // For regular user login
        adminLogin, // For admin login
        logout // Universal logout
    };

    // Don't render children until the session check is complete
    return (
        <UserContext.Provider value={value}>
            {!loading && children} {/* Only render children once loading is false */}
        </UserContext.Provider>
    );
};

// A custom hook to make it easy to use the context in other components
export const useAuth = () => {
    const context = useContext(UserContext); // Use UserContext here
    if (context === undefined) {
        throw new Error('useAuth must be used within a UserProvider');
    }
    return context;
};