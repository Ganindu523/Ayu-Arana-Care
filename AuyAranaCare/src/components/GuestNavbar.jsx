// Path: /src/components/GuestNavbar.jsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    HomeIcon, 
    ArrowRightOnRectangleIcon, 
    InformationCircleIcon, 
    BuildingOfficeIcon,
    BriefcaseIcon,
    CreditCardIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';

export default function GuestNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'About', href: '/about', icon: InformationCircleIcon },
        { name: 'Centers', href: '/center-info', icon: BuildingOfficeIcon },
        { name: 'Careers', href: '/careers-page', icon: BriefcaseIcon },
        { name: 'Membership', href: '/membership-preview', icon: CreditCardIcon },
    ];

    // --- UPDATED: Theme color changed to maroon ---
    const activeLinkStyle = "bg-red-50 text-red-800";
    const inactiveLinkStyle = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
    const maroonColor = '#800000';

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20"> {/* Increased navbar height */}
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <NavLink to="/">
                            <img className="h-16 w-auto" src="/images/logo.jpg" alt="Ayu Arana Care Logo" />
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

                    {/* Right side: Login Button & Mobile Menu Button */}
                    <div className="flex items-center">
                        <div className="hidden md:block">
                             <NavLink
                                to="/auth"
                                style={{ backgroundColor: maroonColor }}
                                className="ml-4 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                Login / Register
                            </NavLink>
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
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
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
                    <div className="border-t border-gray-200 my-2"></div>
                     <NavLink
                        to="/auth"
                        className={({ isActive }) =>
                            `flex items-center px-3 py-2 rounded-md text-base font-medium ${
                                isActive ? activeLinkStyle : "text-gray-700 hover:bg-gray-50"
                            }`
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" />
                        Login / Register
                    </NavLink>
                </div>
            </Transition>
        </header>
    );
}
