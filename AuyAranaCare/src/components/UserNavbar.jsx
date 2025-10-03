// Path: /src/components/UserNavbar.jsx

import React, { useState, Fragment } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import { Transition } from '@headlessui/react';
import { 
    HomeIcon, 
    HeartIcon, 
    CurrencyDollarIcon, 
    MapPinIcon, 
    ChatBubbleLeftEllipsisIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function UserNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        // The logout function in context already handles navigation
    };

    const navLinks = [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Medical Info', href: '/medical-updates', icon: HeartIcon },
        { name: 'Membership', href: '/membership-type', icon: CurrencyDollarIcon },
        { name: 'Center List', href: '/center-info', icon: MapPinIcon },
        { name: 'Feedback', href: '/feedback', icon: ChatBubbleLeftEllipsisIcon },
    ];

    // --- UPDATED: Theme color changed to maroon ---
    const activeLinkStyle = "bg-red-50 text-red-800";
    const inactiveLinkStyle = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <NavLink to="/" className="text-2xl font-bold" style={{ color: '#800000' }}>
                            Ayu Arana
                        </NavLink>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex md:items-center md:space-x-2">
                        {navLinks.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive ? activeLinkStyle : inactiveLinkStyle
                                    }`
                                }
                            >
                                <item.icon className="h-5 w-5 mr-2" />
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right side: Profile Dropdown & Mobile Menu Button */}
                    <div className="flex items-center">
                        <div className="hidden md:flex items-center">
                            <div className="relative ml-4">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <UserCircleIcon className="h-8 w-8 text-gray-500" />
                                    <span className="ml-2 font-medium text-gray-700 hidden lg:block">
                                        {user?.fullName || 'User'}
                                    </span>
                                </button>
                                <Transition
                                    as={Fragment}
                                    show={isProfileMenuOpen}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileMenuOpen(false)}>
                                            My Profile
                                        </NavLink>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-800 hover:bg-gray-100 focus:outline-none"
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
                </div>
            </nav>

            {/* Mobile menu, show/hide based on menu state. */}
            <Transition
                show={isMobileMenuOpen}
                as="div"
                className="md:hidden border-t border-gray-200"
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navLinks.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2 rounded-md text-base font-medium ${
                                    isActive ? activeLinkStyle : "text-gray-700 hover:bg-gray-50"
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
                            <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-3">
                            <div className="text-base font-medium text-gray-800">{user?.fullName || 'User'}</div>
                        </div>
                    </div>
                    <div className="mt-3 px-2 space-y-1">
                        <NavLink to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
                            My Profile
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </Transition>
        </header>
    );
}
