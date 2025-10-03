// Path: /src/components/AdminNavbar.jsx

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import { 
    BuildingOffice2Icon, 
    ChatBubbleLeftRightIcon, 
    HeartIcon, 
    UserPlusIcon, 
    PhotoIcon, 
    BriefcaseIcon, 
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    PlusIcon,
    UserGroupIcon, // For Parent Registration
    CreditCardIcon, // For Membership
    ChatBubbleBottomCenterTextIcon // For Feedback
} from '@heroicons/react/24/outline';

export default function AdminNavbar() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/auth'); // Redirect to login page after logout
    };

    const navLinks = [
        
        { name: 'Add Centers', href: '/admin/add-centers', icon: PlusIcon },
        { name: 'Messages', href: '/admin/contact-messages', icon: ChatBubbleLeftRightIcon },
        { name: 'Medical', href: '/admin/admin-Medical', icon: HeartIcon },
        { name: 'Admin Reg', href: '/admin/admin-registration', icon: UserPlusIcon },
        { name: 'Gallery', href: '/admin/gallery-upload', icon: PhotoIcon },
        { name: 'Careers', href: '/admin/careers', icon: BriefcaseIcon },
        { name: 'Parent Reg', href: '/admin/Admin-Parent-Registration', icon: UserGroupIcon },
        { name: 'Membership', href: '/admin/Admin-membership-management', icon: CreditCardIcon },
        { name: 'Feedback', href: '/admin/Admin-feedback', icon: ChatBubbleBottomCenterTextIcon },
    ];

    // --- UPDATED: Theme color changed to maroon for effects ---
    const activeLinkStyle = "bg-red-100 text-red-800";
    const inactiveLinkStyle = "text-gray-600 hover:bg-red-50 hover:text-red-800";
    const maroonColor = '#800000';

    return (
        <header className="bg-white text-gray-800 shadow-md sticky top-0 z-40">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Desktop Nav */}
                    <div className="flex items-center">
                        <NavLink to="/">
                            <img className="h-16 w-auto" src="/images/logo.jpg" alt="Ayu Arana Care Logo" />
                        </NavLink>
                        <div className="hidden md:ml-6 md:flex md:items-baseline md:space-x-4">
                            {navLinks.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                            isActive ? activeLinkStyle : inactiveLinkStyle
                                        }`
                                    }
                                >
                                    {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Profile and Logout */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center text-sm rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                style={{'--tw-ring-color': maroonColor}}
                            >
                                <span className="sr-only">Open user menu</span>
                                <UserCircleIcon className="h-8 w-8" />
                                <span className="ml-2 font-medium">{admin?.fullName || 'Admin'}</span>
                            </button>
                            {isProfileMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset"
                            style={{'--tw-ring-color': maroonColor}}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((item) => (
                             <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                        isActive ? activeLinkStyle : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <item.icon className="h-6 w-6 mr-3" />
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-5">
                            <div className="flex-shrink-0">
                                <UserCircleIcon className="h-10 w-10 text-gray-500" />
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium leading-none text-gray-800">{admin?.fullName || 'Admin'}</div>
                            </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
