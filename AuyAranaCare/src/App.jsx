// src/App.jsx
import React from 'react';
// REMOVE BrowserRouter as Router from here, as it's provided in main.jsx
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './context/UserContext'; // Assuming useAuth is exported from UserContext

// Import all 3 Navbar components
import GuestNavbar from './components/GuestNavbar';
import UserNavbar from './components/UserNavbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';




// Import your page components (Public & User-only)
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import About from './pages/About';
import CenterInfo from './pages/CenterInfo';
import Feedback from './pages/Feedback';
import MedicalUpdatesPage from './pages/MedicalUpdates';
import CareersPage from './pages/CareersPage';
import MembershipPreviewPage from './pages/MembershipPreviewPage';
import MembershipPage from './pages/MembershipPage';
import ProfilePage from './pages/ProfilePage';

// Import Admin pages
import AdminPage from './pages/AdminPages/AdminPage';
import AdminAddCenters from './pages/AdminPages/AdminAddCenters';
import AdminGalleryUpload from "./pages/AdminPages/AdminGalleryUpload";
import AdminContactMessages from './pages/AdminPages/AdminContactMessages';
import AdminRegistrationPage from './pages/AdminPages/AdminRegistrationPage';
import AdminMedicalPage from './pages/AdminPages/AdminMedicalPage';
import AdminCareersPage from './pages/AdminPages/AdminCareersPage';
import AdminParentRegistrationPage from './pages/AdminPages/AdminParentRegistrationPage';
import AdminMembershipPaymentsPage from './pages/AdminPages/AdminMembershipPaymentsPage';
import AdminFeedbackPage from './pages/AdminPages/AdminFeedbackPage.jsx';

/**
 * MainLayout: For public and authenticated user routes.
 * Conditionally renders GuestNavbar or UserNavbar. Includes Footer.
 */
function MainLayout() {
    const { isAuthenticated, isAdminAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-700">Loading application...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Conditionally render the correct navbar based on auth state */}
            { isAdminAuthenticated ? <AdminNavbar /> : isAuthenticated ? <UserNavbar /> : <GuestNavbar /> }

            <main className="flex-grow container mx-auto p-4">
                <Outlet /> {/* Renders the matched child route component */}
            </main>

            {/* Conditionally render the footer (not on admin pages) */}
            {!isAdminAuthenticated && <Footer />}
        </div>
    );
}

/**
 * AdminLayoutWrapper: Protects admin routes.
 * Ensures only authenticated admins can access. Renders AdminNavbar and Footer.
 */
function AdminLayoutWrapper() {
    const { isAdminAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-700">Checking admin access...</div>;
    }

    // If not authenticated as admin, redirect to the admin login page
    if (!isAdminAuthenticated) {
        return <Navigate to="/auth" replace />; // Redirect to your common AuthPage for login
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <AdminNavbar /> {/* AdminNavbar for admin-specific routes */}
            <main className="flex-grow container mx-auto p-4">
                <Outlet /> {/* Renders the matched nested admin page */}
            </main>
            <Footer /> {/* Footer for admin pages (optional, can be removed if not desired) */}
        </div>
    );
}


function App() {
    return (
        // REMOVE THE <Router> COMPONENT FROM HERE
        // It is now correctly provided in src/main.jsx
        <>
            <Routes>
                {/* Public and Authenticated User Routes - wrapped by MainLayout */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="auth" element={<AuthPage />} />
                    <Route path="about" element={<About />} />
                    <Route path="center-info" element={<CenterInfo />} />
                    <Route path="careers-page" element={<CareersPage />} />
                    <Route path="membership-preview" element={<MembershipPreviewPage />} />

                    {/* User-Only Routes */}
                    <Route path="feedback" element={<Feedback />} />
                    <Route path="medical-updates" element={<MedicalUpdatesPage />} />
                    <Route path="membership-type" element={<MembershipPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    
                   
                    {/* Catch-all for non-existent public/user pages */}
                    <Route path="*" element={<div className="text-center p-8"><h2>404 - Page Not Found</h2></div>} />
                </Route>

                {/* Admin-Only Routes - wrapped by AdminLayoutWrapper for protection */}
                <Route path="/admin" element={<AdminLayoutWrapper />}>
                    <Route index element={<AdminPage />} />
                    
                    <Route path="add-centers" element={<AdminAddCenters />} />
                    <Route path="gallery-upload" element={<AdminGalleryUpload />} />
                    <Route path="contact-messages" element={<AdminContactMessages />} />
                    <Route path="admin-registration" element={<AdminRegistrationPage />} />
                    <Route path="admin-Medical" element={<AdminMedicalPage />} />
                    <Route path="careers" element={<AdminCareersPage />} />
                    <Route path="Admin-Parent-Registration" element={<AdminParentRegistrationPage />} />
                    <Route path="Admin-membership-management" element={<AdminMembershipPaymentsPage />} />
                    <Route path="Admin-feedback" element={<AdminFeedbackPage />} />


                     
                </Route>
            </Routes>
        </>
    );
}

export default App;