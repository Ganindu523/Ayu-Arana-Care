// Path: /src/components/Footer.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/solid';

// Social media icons can be SVGs or imported from a library
const FacebookIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = () => (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
);

const InstagramIcon = () => (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.465c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.25-10.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" />
    </svg>
);

export default function Footer() {
    const maroonColor = '#800000';

    return (
        <footer style={{ backgroundColor: maroonColor }} className="text-gray-200">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    {/* Column 1: Logo and About */}
                    <div className="md:col-span-1">
                        <img className="h-16 w-auto mb-4" src="/images/logo.jpg" alt="Ayu Arana Care Logo" />
                        <p className="text-sm text-gray-300">
                            Providing compassionate and professional elder care to ensure your loved ones feel safe, respected, and cherished.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="/careers-page" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="/membership-preview" className="hover:text-white transition-colors">Membership</a></li>
                            <li><a href="/feedback" className="hover:text-white transition-colors">Feedback</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPinIcon className="h-5 w-5 mt-1 mr-3 flex-shrink-0" />
                                <span>No 25, Galle Road, Colombo 03, Sri Lanka</span>
                            </li>
                            <li className="flex items-start">
                                <EnvelopeIcon className="h-5 w-5 mt-1 mr-3 flex-shrink-0" />
                                <a href="mailto:info@ayuaranacare.com" className="hover:text-white">info@ayuaranacare.com</a>
                            </li>
                            <li className="flex items-start">
                                <PhoneIcon className="h-5 w-5 mt-1 mr-3 flex-shrink-0" />
                                <a href="tel:+94112345678" className="hover:text-white">+94 11 234 5678</a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Follow Us */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-300 hover:text-white" aria-label="Facebook"><FacebookIcon /></a>
                            <a href="#" className="text-gray-300 hover:text-white" aria-label="Twitter"><TwitterIcon /></a>
                            <a href="#" className="text-gray-300 hover:text-white" aria-label="Instagram"><InstagramIcon /></a>
                        </div>
                    </div>

                </div>
            </div>
            <div className="bg-black/30 py-4">
                <div className="container mx-auto text-center text-sm text-gray-300">
                    &copy; {new Date().getFullYear()} Ayu Arana Care. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}
