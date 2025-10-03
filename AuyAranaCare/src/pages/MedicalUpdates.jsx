import React, { useState, useEffect, Fragment, useRef } from 'react'; // Added useRef
import { Transition, Dialog } from '@headlessui/react';
import { DocumentPlusIcon, ClockIcon, CheckCircleIcon, ArrowDownTrayIcon, CreditCardIcon, MegaphoneIcon, UserIcon } from '@heroicons/react/24/outline';
import { useSpring, animated } from 'react-spring'; // Import animated and useSpring

// --- Custom Hook for Scroll Animations (Copy from Home.jsx) ---
const useInView = (options) => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return [ref, isInView];
};

// --- Animated Section Component (Copy from Home.jsx) ---
const AnimatedSection = ({ children, className }) => {
    const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true }); // Adjusted threshold slightly for visibility
    const animation = useSpring({
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(40px)',
        config: { tension: 280, friction: 40 },
    });

    return (
        <animated.div ref={ref} style={animation} className={className}>
            {children}
        </animated.div>
    );
};


// --- Reusable Utility Functions (Updated for Maroon Theme) ---
const getStatusChip = (status) => {
    const styles = {
        // Semantic colors (green, yellow, red) are often best left as is for universal understanding
        'Completed': 'bg-green-100 text-green-800',
        'Paid': 'bg-green-100 text-green-800',
        'Good': 'bg-green-100 text-green-800',

        // Re-themed to maroon for 'in-progress' or 'stable' states
        'Processing': 'bg-red-100 text-[#800000]', // Light maroon background with maroon text
        'Stable': 'bg-red-100 text-[#800000]', // Light maroon background with maroon text

        // Semantic colors (yellow, orange, red)
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Unpaid': 'bg-orange-100 text-orange-800',
        'Needs Attention': 'bg-orange-100 text-orange-800',

        'Rejected': 'bg-red-100 text-red-800',
        'Critical': 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
};

// --- Reusable Payment Modal Component (Updated for Maroon Theme) ---
const PaymentModal = ({ isOpen, onClose, request, onPaymentSuccess }) => {
    if (!isOpen) return null;

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        // Simulate payment success
        alert("Payment Simulated: Payment processed successfully!");

        try {
            const response = await fetch(`http://localhost:5000/api/medical/request/${request._id}/paymentStatus`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentStatus: 'Paid' })
            });
            if (!response.ok) throw new Error('Failed to update payment status on backend');

            onPaymentSuccess(); // Trigger re-fetch of user requests
            onClose();
        } catch (error) {
            console.error("Simulated Payment Error:", error);
            alert("Error: Could not mark payment as paid on backend: " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#800000' }}>Make a Payment</h2>
                <div className="p-4 rounded-md bg-yellow-100 border border-yellow-300 mb-6">
                    <p className="font-bold text-yellow-800">⚠️ University Project Simulation</p>
                    <p className="text-sm text-yellow-700">Do NOT enter real credit card details. This is not secure.</p>
                </div>
                <p className="mb-2">Payment for: <span className="font-semibold">{request?.checkupType?.name}</span></p>
                <p className="mb-6">Amount: <span className="font-semibold">{request?.checkupType?.price} LKR</span></p>
                <form className="space-y-4" onSubmit={handlePaymentSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                        <input type="text" placeholder="John Doe" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                            <input type="text" placeholder="MM/YY" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">CVV</label>
                            <input type="text" placeholder="123" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="text-white font-bold py-2 px-4 rounded-lg" style={{ backgroundColor: '#800000' }}>Pay Now (Simulated)</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function MedicalUpdatesPage() { // Renamed component for clarity
    const [medicalAnnouncements, setMedicalAnnouncements] = useState([]); // General announcements from admin
    const [requests, setRequests] = useState([]); // Checkup requests made by user
    const [residentMedicalRecords, setResidentMedicalRecords] = useState([]); // User's specific medical records
    const [checkupTypes, setCheckupTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedRequestForPayment, setSelectedRequestForPayment] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    // Function to fetch user-specific medical requests
    const fetchUserRequests = async (id) => {
        if (!id) {
            console.log("No user ID available, skipping fetchUserRequests.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/medical/request/my/${id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user requests');
            }
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error("Fetch User Requests Error:", error);
            alert("Error: Could not fetch your medical requests. " + error.message);
        }
    };

    // Function to fetch available checkup types
    const fetchCheckupTypes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/medical/types');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch checkup types');
            }
            const data = await response.json();
            setCheckupTypes(data);
        } catch (error) {
            console.error("Fetch Checkup Types Error:", error);
            alert("Error: Could not fetch checkup types. " + error.message);
        }
    };

    // Function to fetch general medical announcements from admin
    const fetchMedicalAnnouncements = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/medical/status-updates'); // Corrected URL for general announcements
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch medical announcements');
            }
            const data = await response.json();
            setMedicalAnnouncements(data);
        } catch (error) {
            console.error("Fetch Medical Announcements Error:", error);
            alert("Error: Could not fetch general medical announcements. " + error.message);
        }
    };

    // Function to fetch resident's specific medical records/statuses
    const fetchResidentMedicalRecords = async (residentId) => {
        if (!residentId) {
            console.log("No resident ID available, skipping fetchResidentMedicalRecords.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/medical/resident-statuses/${residentId}`); // Corrected URL for resident specific records
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch resident medical records');
            }
            const data = await response.json();
            setResidentMedicalRecords(data);
        } catch (error) {
            console.error("Fetch Resident Medical Records Error:", error);
            alert("Error: Could not fetch your medical records. " + error.message);
        }
    };


    // Main useEffect to handle initial data loading and user ID retrieval
    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);

            let currentUserId = null;
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const userObject = JSON.parse(storedUser);
                    currentUserId = userObject.id;
                    setLoggedInUserId(currentUserId);
                } catch (e) {
                    console.error("Failed to parse user from localStorage (initial load):", e);
                    localStorage.removeItem('user');
                }
            } else {
                console.warn("No 'user' found in localStorage (initial load). User might not be logged in.");
            }

            try {
                // Fetch all necessary data concurrently
                await Promise.all([
                    fetchCheckupTypes(),
                    fetchMedicalAnnouncements() // Fetch general announcements
                ]);

                // Fetch user-specific data only if a user ID is available
                if (currentUserId) {
                    await Promise.all([
                        fetchUserRequests(currentUserId),
                        fetchResidentMedicalRecords(currentUserId) // Fetch user's specific records
                    ]);
                } else {
                    setRequests([]);
                    setResidentMedicalRecords([]);
                }
            } catch (error) {
                console.error("Error loading initial data:", error);
                alert("An error occurred while loading initial medical data.");
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, []); // Empty dependency array means this runs once on mount

    const handlePayClick = (request) => {
        setSelectedRequestForPayment(request);
        setIsPaymentModalOpen(true);
    };

    const handleSubmitNewRequest = async (e) => {
        e.preventDefault();
        const checkupTypeId = e.target.checkupType.value;
        const notes = e.target.notes.value;

        console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}] --- Submitting New Request ---`);

        if (checkupTypeId === '-- Choose a test --' || !checkupTypeId) {
            alert('Please select a checkup type.');
            return;
        }

        let userIdToUse = loggedInUserId;

        if (!userIdToUse) {
            console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}] loggedInUserId state is null. Attempting direct localStorage read...`);
            const storedUserRaw = localStorage.getItem('user');

            if (storedUserRaw) {
                try {
                    const userObject = JSON.parse(storedUserRaw);
                    if (typeof userObject === 'object' && userObject !== null && typeof userObject.id === 'string' && userObject.id.length > 0) {
                        userIdToUse = userObject.id;
                        setLoggedInUserId(userIdToUse);
                        console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}] userIdToUse retrieved from localStorage:`, userIdToUse);
                    } else {
                        console.warn(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}] Parsed userObject from localStorage is malformed or missing a valid 'id'. Object:`, userObject);
                        localStorage.removeItem('user');
                    }
                } catch (e) {
                    console.error(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}] Error parsing user from localStorage during submit handler:`, e);
                    localStorage.removeItem('user');
                }
            } else {
                console.warn(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}] localStorage 'user' is empty or null when expected.`);
            }
        }

        console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}] Final userIdToUse before API call:`, userIdToUse);

        if (!userIdToUse) {
            alert('User not logged in. Please log in to submit a request.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/medical/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    residentId: userIdToUse,
                    requestedById: userIdToUse,
                    checkupTypeId,
                    notes
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit request');
            }

            alert('Medical checkup request submitted successfully!');
            e.target.reset();
            await fetchUserRequests(userIdToUse);

        } catch (error) {
            console.error("Submit New Request Error:", error);
            alert("Error submitting request: " + error.message);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading Medical Information...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                request={selectedRequestForPayment}
                onPaymentSuccess={() => fetchUserRequests(loggedInUserId)}
            />

            {/* Section 1: General Medical Announcements - Wrapped in AnimatedSection */}
            <AnimatedSection>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-[#800000] pb-2 mb-6 flex items-center">
                        <MegaphoneIcon className="h-8 w-8 mr-3 text-[#800000]" /> Medical Announcements
                    </h1>
                    <div className="space-y-6">
                        {medicalAnnouncements.length > 0 ? (
                            medicalAnnouncements.map(announcement => (
                                <div key={announcement._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#800000]">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-xl text-gray-900">{announcement.subject}</h3>
                                        <p className="text-sm text-gray-500">{new Date(announcement.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}</p>
                                    </div>
                                    <p className="mt-2 text-gray-700">{announcement.notes}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No general medical announcements available.</p>
                        )}
                    </div>
                </div>
            </AnimatedSection>

            {/* NEW Section: Your Medical Records/Status - Wrapped in AnimatedSection */}
            <AnimatedSection>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-[#800000] pb-2 mb-6 flex items-center">
                        <UserIcon className="h-8 w-8 mr-3 text-[#800000]" /> Your Medical Records/Status
                    </h1>
                    <div className="space-y-6">
                        {loggedInUserId ? (
                            residentMedicalRecords.length > 0 ? (
                                residentMedicalRecords.map(record => (
                                    <div key={record._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#800000]">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-xl text-gray-900">{record.subject}</h3>
                                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${getStatusChip(record.statusLevel)}`}>{record.statusLevel}</span>
                                        </div>
                                        <p className="mt-2 text-gray-700">{record.notes}</p>
                                        <p className="text-xs text-gray-500 mt-2">Last Updated: {new Date(record.updatedAt).toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No personal medical records available for your profile.</p>
                            )
                        ) : (
                            <p className="text-gray-500">Please log in to view your personal medical records.</p>
                        )}
                    </div>
                </div>
            </AnimatedSection>


            {/* Section 3: Medical Checkup Requests - Wrapped in AnimatedSection */}
            <AnimatedSection>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-[#800000] pb-2 mb-6">Your Medical Checkup Requests</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Column 1: Request a New Checkup */}
                        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                            <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center"><DocumentPlusIcon className="h-6 w-6 mr-2 text-[#800000]" />Request a New Checkup</h3>
                            <form className="space-y-4" onSubmit={handleSubmitNewRequest}>
                                <div>
                                    <label htmlFor="checkupType" className="block text-sm font-medium text-gray-700">Select Checkup Type</label>
                                    <select id="checkupType" name="checkupType" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md">
                                        <option value="">-- Choose a test --</option>
                                        {checkupTypes.map(type => (
                                            <option key={type._id} value={type._id}>{type.name} - {type.price} LKR</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                                    <textarea id="notes" name="notes" rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className={`w-full text-white font-bold py-2 px-4 rounded-lg ${
                                        checkupTypes.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#800000] hover:bg-[#660000]'
                                    }`}
                                    disabled={checkupTypes.length === 0} // Disable if no checkup types loaded
                                >
                                    Submit Request
                                </button>
                            </form>
                        </div>

                        {/* Column 2: Your Request History */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                            <h3 className="font-bold text-xl text-gray-900 mb-4">Your Checkup Request History</h3>
                            <div className="space-y-4">
                                {requests.length > 0 ? (
                                    requests.map(req => (
                                        <div key={req._id} className="border border-gray-200 p-4 rounded-lg">
                                            <div className="flex flex-wrap justify-between items-center gap-4">
                                                <div>
                                                    <p className="font-semibold text-lg">{req.checkupType?.name}</p>
                                                    <p className="text-sm text-gray-500">Requested: {new Date(req.createdAt).toLocaleDateString('en-US', { timeZone: 'Asia/Colombo' })}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusChip(req.status)}`}>{req.status}</span>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusChip(req.paymentStatus)}`}>{req.paymentStatus}</span>
                                                    <span className="text-lg font-semibold">{req.checkupType?.price} LKR</span>
                                                </div>
                                            </div>
                                            <div className="border-t my-3"></div>
                                            <div className="flex justify-end items-center gap-3">
                                                {req.status === 'Completed' && req.reportFile && (
                                                    <a href={req.reportFile} target="_blank" rel="noopener noreferrer" className="flex items-center text-white text-sm font-semibold py-2 px-3 rounded-md hover:bg-[#660000]" style={{ backgroundColor: '#800000' }}>
                                                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />Download Report
                                                    </a>
                                                )}
                                                {req.paymentStatus === 'Unpaid' && (
                                                    <button onClick={() => handlePayClick(req)} className="flex items-center text-white text-sm font-semibold py-2 px-3 rounded-md hover:bg-[#660000]" style={{ backgroundColor: '#800000' }}>
                                                        <CreditCardIcon className="h-5 w-5 mr-2" />Pay Now
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">You have not made any checkup requests.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
        </div>
    );
}