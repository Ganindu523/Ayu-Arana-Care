// C:\Users\ASUS\Desktop\ayu arana care\test-app\frontend\src\pages\AdminPages\AdminMedicalPage.jsx

import React, { useState, useEffect, Fragment } from 'react';
import {
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    PlusIcon,
    CloudArrowUpIcon, // For upload
    BellAlertIcon, // For reminder
    MegaphoneIcon, // For general medical announcements
    UserGroupIcon // For resident-specific medical records tab
} from '@heroicons/react/24/outline';
import { Transition, Dialog } from '@headlessui/react';

// --- Reusable Utility Functions (kept same) ---
const getStatusChip = (status) => {
    const styles = {
        'Completed': 'bg-green-100 text-green-800',
        'Processing': 'bg-blue-100 text-blue-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Rejected': 'bg-red-100 text-red-800',
        'Paid': 'bg-green-100 text-green-800',
        'Unpaid': 'bg-orange-100 text-orange-800',
        'Good': 'bg-green-100 text-green-800', // Added for resident medical status
        'Stable': 'bg-blue-100 text-blue-800', // Added for resident medical status
        'Needs Attention': 'bg-orange-100 text-orange-800', // Added for resident medical status
        'Critical': 'bg-red-100 text-red-800', // Added for resident medical status
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
};

// --- Reusable Modal Component (kept same) ---
const Modal = ({ isOpen, onClose, title, children }) => (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0 bg-black bg-opacity-60" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                        <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 flex justify-between items-center">
                                {title}
                                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><XMarkIcon className="h-6 w-6 text-gray-500" /></button>
                            </Dialog.Title>
                            <div className="mt-4">{children}</div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
);


export default function AdminMedicalPage() {
    // State to manage active tab: 'requests', 'manageTypes', 'announcements', or 'residentRecords'
    const [activeTab, setActiveTab] = useState('requests');
    const [requests, setRequests] = useState([]);
    const [checkupTypes, setCheckupTypes] = useState([]);
    const [medicalAnnouncements, setMedicalAnnouncements] = useState([]); // General announcements state
    const [residentMedicalRecords, setResidentMedicalRecords] = useState([]); // Resident-specific records state
    const [allResidents, setAllResidents] = useState([]); // List of all residents for dropdown in resident records tab
    const [loading, setLoading] = useState(true);
    // State for managing modal visibility and data passed to it
    const [modalInfo, setModalInfo] = useState({ type: null, data: null }); // type: 'addType', 'editType', 'upload', 'addAnnouncement', 'editAnnouncement', 'addResidentRecord', 'editResidentRecord'

    // --- Data Fetching Functions ---
    const fetchCheckupTypes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/medical/types');
            if (!response.ok) throw new Error('Failed to fetch checkup types');
            const data = await response.json();
            setCheckupTypes(data);
        } catch (error) {
            console.error("Fetch Checkup Types Error:", error);
            alert("Error: Could not fetch checkup types.");
        }
    };

    const fetchAllRequests = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/medical/request/all');
            if (!response.ok) throw new Error('Failed to fetch requests');
            const data = await response.json();
            setRequests(data);
        } catch(error) {
            console.error("Fetch All Requests Error:", error);
            alert("Error: Could not fetch requests.");
        }
    };

    // Function to fetch general medical announcements
    const fetchMedicalAnnouncements = async () => {
        try {
            // Updated URL: This is from medicalAnnouncementsRoutes.js
            const response = await fetch('http://localhost:5000/api/medical/status-updates');
            if (!response.ok) throw new Error('Failed to fetch medical announcements');
            const data = await response.json();
            setMedicalAnnouncements(data);
        } catch (error) {
            console.error("Fetch Medical Announcements Error:", error);
            alert("Error: Could not fetch medical announcements.");
        }
    };

    // Function to fetch all resident medical records and list of residents
    const fetchResidentMedicalRecordsAndResidents = async () => {
        try {
            // This endpoint will return both the list of users and their existing records
            // Updated URL: This is from residentMedicalRoutes.js
            const response = await fetch('http://localhost:5000/api/medical/resident-statuses/all');
            if (!response.ok) throw new Error('Failed to fetch resident medical records');
            const data = await response.json();
            setAllResidents(data.users); // Assuming backend sends { users: [], existingStatuses: [] }
            setResidentMedicalRecords(data.existingStatuses);
        } catch (error) {
            console.error("Fetch Resident Medical Records Error:", error);
            alert("Error: Could not fetch resident medical records.");
        }
    };


    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await Promise.all([
                fetchAllRequests(), // Medical Checkup Requests
                fetchCheckupTypes(), // Manage Checkup Types
                fetchMedicalAnnouncements(), // Medical Announcements
                fetchResidentMedicalRecordsAndResidents() // Resident Medical Records
            ]);
            setLoading(false);
        };
        loadInitialData();
    }, []); // Empty dependency array means this runs once on mount

    const handleAction = (type, data) => setModalInfo({ type, data });
    const closeModal = () => setModalInfo({ type: null, data: null });

    // --- Action Handlers for Medical Requests Tab (kept same) ---
    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/medical/request/${requestId}/status`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) throw new Error('Failed to update status');
            await fetchAllRequests();
            closeModal();
            alert(`Request status updated to ${newStatus}.`);
        } catch(error) {
            console.error("Status Update Error:", error);
            alert(`Error updating status: ${error.message}`);
        }
    };

    const handlePaymentStatusUpdate = async (requestId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/medical/request/${requestId}/paymentStatus`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ paymentStatus: newStatus })
            });
            if (!response.ok) throw new Error('Failed to update payment status');
            await fetchAllRequests();
            closeModal();
            alert(`Request payment status updated to ${newStatus}.`);
        } catch(error) {
            console.error("Payment Status Update Error:", error);
            alert(`Error updating payment status: ${error.message}`);
        }
    };

    const handleReportUploadSubmit = async (e) => {
        e.preventDefault();
        const requestId = modalInfo.data._id;
        const reportFileUrl = e.target.reportFileUrl.value;

        try {
            const response = await fetch(`http://localhost:5000/api/medical/request/${requestId}/upload-report`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ reportFileUrl })
            });
            if (!response.ok) throw new Error('Failed to upload report');
            await fetchAllRequests();
            closeModal();
            alert("Report uploaded and request marked as 'Completed'!");
        } catch (error) {
            console.error("Upload Report Error:", error);
            alert("Error uploading report: " + error.message);
        }
    };

    const handleSendReminder = (request) => {
        alert(`Simulated: Payment reminder sent to ${request.resident?.fullName} for ${request.checkupType.name}.`);
    };

    // --- Action Handlers for Manage Checkup Types Tab (kept same) ---
    const handleTypeSubmit = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const price = parseFloat(e.target.price.value);
        const typeId = modalInfo.data?._id;
        const isAdding = modalInfo.type === 'addType';

        const url = isAdding ? 'http://localhost:5000/api/medical/types' : `http://localhost:5000/api/medical/types/${typeId}`;
        const method = isAdding ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'API request failed');
            }

            await fetchCheckupTypes();
            closeModal();
            alert(`Checkup type ${isAdding ? 'added' : 'updated'} successfully!`);

        } catch (error) {
            console.error("Submit Checkup Type Error:", error);
            alert("Error: " + error.message);
        }
    };

    const handleTypeDelete = async (typeId) => {
        if (window.confirm("Are you sure you want to delete this checkup type? This cannot be undone.")) {
            try {
                const response = await fetch(`http://localhost:5000/api/medical/types/${typeId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Failed to delete checkup type');
                await fetchCheckupTypes();
                alert('Checkup type deleted.');
            } catch (error) {
                console.error("Delete Checkup Type Error:", error);
                alert("Error: Could not delete the checkup type." + error.message);
            }
        }
    };

    // --- Action Handlers for Medical Announcements Tab ---
    const handleMedicalAnnouncementSubmit = async (e) => {
        e.preventDefault();
        const subject = e.target.subject.value;
        const notes = e.target.notes.value;
        const updateId = modalInfo.data?._id;
        const isAdding = modalInfo.type === 'addAnnouncement';

        const url = isAdding ? 'http://localhost:5000/api/medical/status-updates' : `http://localhost:5000/api/medical/status-updates/${updateId}`;
        const method = isAdding ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, notes })
            });
            if (!response.ok) {
                // If response is not ok, attempt to read error message from body
                const errorData = await response.json();
                throw new Error(errorData.message || 'API request failed: Could not post/update announcement.');
            }

            await fetchMedicalAnnouncements();
            closeModal();
            alert(`Medical announcement ${isAdding ? 'posted' : 'updated'} successfully!`);
        } catch (error) {
            console.error("Submit Medical Announcement Error:", error);
            alert("Error: " + error.message);
        }
    };

    const handleMedicalAnnouncementDelete = async (updateId) => {
        if (window.confirm("Are you sure you want to delete this medical announcement? This cannot be undone.")) {
            try {
                const response = await fetch(`http://localhost:5000/api/medical/status-updates/${updateId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Failed to delete medical announcement');
                await fetchMedicalAnnouncements();
                alert('Medical announcement deleted.');
            } catch (error) {
                console.error("Delete Medical Announcement Error:", error);
                alert("Error: Could not delete the medical announcement." + error.message);
            }
        }
    };

    // --- Action Handlers for Manage Resident Medical Records Tab ---
    const handleResidentMedicalRecordSubmit = async (e) => {
        e.preventDefault();
        const residentId = e.target.residentId.value;
        const subject = e.target.recordSubject.value;
        const notes = e.target.recordNotes.value;
        const statusLevel = e.target.statusLevel.value;
        const recordId = modalInfo.data?._id;
        const isAdding = modalInfo.type === 'addResidentRecord';

        const url = isAdding ? 'http://localhost:5000/api/medical/resident-statuses' : `http://localhost:5000/api/medical/resident-statuses/${recordId}`;
        const method = isAdding ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ residentId, subject, notes, statusLevel })
            });
            if (!response.ok) {
                // If response is not ok, attempt to read error message from body
                const errorData = await response.json();
                throw new Error(errorData.message || 'API request failed: Could not add/update resident record.');
            }

            await fetchResidentMedicalRecordsAndResidents(); // Re-fetch records and residents
            closeModal();
            alert(`Resident medical record ${isAdding ? 'added' : 'updated'} successfully!`);
        } catch (error) {
            console.error("Submit Resident Medical Record Error:", error);
            alert("Error: " + error.message);
        }
    };

    const handleResidentMedicalRecordDelete = async (recordId) => {
        if (window.confirm("Are you sure you want to delete this resident medical record? This cannot be undone.")) {
            try {
                const response = await fetch(`http://localhost:5000/api/medical/resident-statuses/${recordId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Failed to delete resident medical record');
                await fetchResidentMedicalRecordsAndResidents();
                alert('Resident medical record deleted.');
            } catch (error) {
                console.error("Delete Resident Medical Record Error:", error);
                alert("Error: Could not delete the resident medical record." + error.message);
            }
        }
    };


    // --- Render Functions for Each Tab Content ---
    const renderRequests = () => (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <h3 className="font-bold text-xl text-gray-900 mb-4">All Medical Checkup Requests</h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resident</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Checkup</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr><td colSpan="6" className="text-center py-10">Loading requests...</td></tr>
                    ) : requests.length > 0 ? (
                        requests.map(req => (
                            <tr key={req._id}>
                                <td className="px-6 py-4">
                                    <div className="font-medium">{req.resident?.fullName || 'N/A'}</div>
                                    <div className="text-sm text-gray-500">by {req.requestedBy?.fullName || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4">{req.checkupType.name}</td>
                                <td className="px-6 py-4">{req.checkupType.price} LKR</td>
                                <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs font-semibold rounded-full ${getStatusChip(req.status)}`}>{req.status}</span></td>
                                <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs font-semibold rounded-full ${getStatusChip(req.paymentStatus)}`}>{req.paymentStatus}</span></td>
                                <td className="px-6 py-4 space-x-2">
                                    {/* Action buttons based on request status */}
                                    {req.status === 'Pending' && (
                                        <>
                                            <button onClick={() => handleStatusUpdate(req._id, 'Processing')} className="text-blue-600 hover:text-blue-900">Approve</button>
                                            <button onClick={() => handleStatusUpdate(req._id, 'Rejected')} className="text-red-600 hover:text-red-900 ml-2">Reject</button>
                                        </>
                                    )}
                                    {req.status === 'Processing' && !req.reportFile && (
                                        <button onClick={() => handleAction('upload', req)} className="text-green-600 hover:text-green-900">Upload Report</button>
                                    )}
                                    {req.paymentStatus === 'Unpaid' && (
                                        <>
                                            <button onClick={() => handlePaymentStatusUpdate(req._id, 'Paid')} className="text-purple-600 hover:text-purple-900">Mark Paid</button>
                                            <button onClick={() => handleSendReminder(req)} className="text-orange-600 hover:text-orange-900 ml-2">Remind</button>
                                        </>
                                    )}
                                    {req.status === 'Completed' && req.reportFile && (
                                        <a href={req.reportFile} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">View Report</a>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" className="text-center py-10 text-gray-500">No checkup requests found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderManageTypes = () => (
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">Existing Checkup Types</h3>
                <button onClick={() => handleAction('addType')} className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">
                    <PlusIcon className="h-5 w-5 mr-2" /> Add New
                </button>
            </div>
            <div className="space-y-3">
                {loading ? (
                    <p>Loading types...</p>
                ) : checkupTypes.length > 0 ? (
                    checkupTypes.map(type => (
                        <div key={type._id} className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                                <p className="font-semibold">{type.name}</p>
                                <p className="text-gray-600">{type.price} LKR</p>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => handleAction('editType', type)} className="p-2 text-gray-500 hover:text-blue-600">
                                    <PencilIcon className="h-5 w-5"/>
                                </button>
                                <button onClick={() => handleTypeDelete(type._id)} className="p-2 text-gray-500 hover:text-red-600">
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center py-10 text-gray-500">No checkup types have been added yet.</p>
                )}
            </div>
        </div>
    );

    const renderMedicalAnnouncements = () => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">Medical Announcements</h3>
                <button onClick={() => handleAction('addAnnouncement')} className="flex items-center bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-green-700">
                    <PlusIcon className="h-5 w-5 mr-2" /> Post New Announcement
                </button>
            </div>
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center py-10">Loading announcements...</p>
                ) : medicalAnnouncements.length > 0 ? (
                    medicalAnnouncements.map(announcement => (
                        <div key={announcement._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-lg">{announcement.subject}</p>
                                <p className="text-sm text-gray-700 mt-1">{announcement.notes}</p>
                                <p className="text-xs text-gray-500 mt-2">Posted: {new Date(announcement.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}</p>
                            </div>
                            <div className="space-x-2 flex-shrink-0">
                                <button onClick={() => handleAction('editAnnouncement', announcement)} className="p-2 text-gray-500 hover:text-blue-600">
                                    <PencilIcon className="h-5 w-5"/>
                                </button>
                                <button onClick={() => handleMedicalAnnouncementDelete(announcement._id)} className="p-2 text-gray-500 hover:text-red-600">
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center py-10 text-gray-500">No medical announcements have been posted yet.</p>
                )}
            </div>
        </div>
    );

    const renderResidentMedicalRecords = () => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">Manage Resident Medical Records</h3>
                <button onClick={() => handleAction('addResidentRecord', null)} className="flex items-center bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-purple-700">
                    <PlusIcon className="h-5 w-5 mr-2" /> Add New Record
                </button>
            </div>
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center py-10">Loading resident records...</p>
                ) : allResidents.length === 0 ? ( // Check if allResidents is empty
                    <p className="text-center py-10 text-gray-500">No residents found to add medical records for. Please add residents first.</p>
                ) : residentMedicalRecords.length > 0 ? (
                    residentMedicalRecords.map(record => (
                        <div key={record._id} className="border border-gray-200 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold text-lg">{record.resident?.fullName || 'N/A Resident'}</p>
                                <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${getStatusChip(record.statusLevel)}`}>{record.statusLevel}</span>
                            </div>
                            <p className="text-md font-medium text-gray-800">{record.subject}</p>
                            <p className="text-sm text-gray-700 mt-1">{record.notes}</p>
                            <p className="text-xs text-gray-500 mt-2">Last Updated: {new Date(record.updatedAt).toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}</p>
                            <div className="flex justify-end space-x-2 mt-3">
                                <button onClick={() => handleAction('editResidentRecord', record)} className="p-2 text-gray-500 hover:text-blue-600">
                                    <PencilIcon className="h-5 w-5"/>
                                </button>
                                <button onClick={() => handleResidentMedicalRecordDelete(record._id)} className="p-2 text-gray-500 hover:text-red-600">
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center py-10 text-gray-500">No resident medical records have been added yet for existing residents.</p>
                )}
            </div>
        </div>
    );


    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Medical Management Dashboard</h1>
            <div className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto pb-2">
                        {/* Tab Button for Checkup Requests */}
                        <button onClick={() => setActiveTab('requests')} className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 'requests' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            <ClipboardDocumentListIcon className="h-5 w-5 mr-2" /> Checkup Requests
                        </button>
                        {/* Tab Button for Manage Checkup Types */}
                        <button onClick={() => setActiveTab('manageTypes')} className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 'manageTypes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            <Cog6ToothIcon className="h-5 w-5 mr-2" /> Manage Checkup Types
                        </button>
                        {/* Tab Button for Medical Announcements */}
                        <button onClick={() => setActiveTab('announcements')} className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 'announcements' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            <MegaphoneIcon className="h-5 w-5 mr-2" /> Medical Announcements
                        </button>
                        {/* NEW: Tab Button for Resident Medical Records */}
                        <button onClick={() => setActiveTab('residentRecords')} className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 'residentRecords' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            <UserGroupIcon className="h-5 w-5 mr-2" /> Resident Medical Records
                        </button>
                    </nav>
                </div>
            </div>
            <div>
                {/* Conditional rendering of tab content */}
                {activeTab === 'requests' && renderRequests()}
                {activeTab === 'manageTypes' && renderManageTypes()}
                {activeTab === 'announcements' && renderMedicalAnnouncements()}
                {activeTab === 'residentRecords' && renderResidentMedicalRecords()}
            </div>

            {/* Modal for Add/Edit Checkup Type */}
            <Modal isOpen={modalInfo.type === 'addType' || modalInfo.type === 'editType'} onClose={closeModal} title={modalInfo.type === 'addType' ? 'Add New Checkup Type' : 'Edit Checkup Type'}>
                 <form onSubmit={handleTypeSubmit} className="space-y-4">
                     <div><label className="block text-sm font-medium text-gray-700">Name</label><input name="name" type="text" defaultValue={modalInfo.data?.name || ''} required className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3"/></div>
                     <div><label className="block text-sm font-medium text-gray-700">Price (LKR)</label><input name="price" type="number" step="0.01" defaultValue={modalInfo.data?.price || ''} required className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3"/></div>
                     <div className="mt-6 flex justify-end space-x-3"><button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button><button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Save Changes</button></div>
                 </form>
            </Modal>

            {/* Modal for Upload Report */}
            <Modal isOpen={modalInfo.type === 'upload'} onClose={closeModal} title="Upload Medical Report">
                <form onSubmit={handleReportUploadSubmit} className="space-y-4">
                    <p className="text-gray-700 mb-4">Upload report for: <span className="font-semibold">{modalInfo.data?.resident?.fullName} - {modalInfo.data?.checkupType?.name}</span></p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Report File URL (for simulation)</label>
                        <input name="reportFileUrl" type="text" placeholder="e.g., https://yourdomain.com/reports/report-123.pdf" required className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3"/>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                            <CloudArrowUpIcon className="h-5 w-5 mr-2"/>Upload & Complete
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal for Add/Edit Medical Announcement */}
            <Modal isOpen={modalInfo.type === 'addAnnouncement' || modalInfo.type === 'editAnnouncement'} onClose={closeModal} title={modalInfo.type === 'addAnnouncement' ? 'Post New Medical Announcement' : 'Edit Medical Announcement'}>
                <form onSubmit={handleMedicalAnnouncementSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <input name="subject" type="text" defaultValue={modalInfo.data?.subject || ''} required className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea name="notes" rows="4" defaultValue={modalInfo.data?.notes || ''} required className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3"></textarea>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
                            {modalInfo.type === 'addAnnouncement' ? 'Post Announcement' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* NEW: Modal for Add/Edit Resident Medical Record */}
            <Modal isOpen={modalInfo.type === 'addResidentRecord' || modalInfo.type === 'editResidentRecord'} onClose={closeModal} title={modalInfo.type === 'addResidentRecord' ? 'Add New Resident Medical Record' : 'Edit Resident Medical Record'}>
                <form onSubmit={handleResidentMedicalRecordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Resident</label>
                        <select
                            name="residentId"
                            defaultValue={modalInfo.data?.resident?._id || ''}
                            required
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            disabled={modalInfo.type === 'editResidentRecord'} // Disable selection when editing existing
                        >
                            <option value="">-- Select a Resident --</option>
                            {allResidents.map(resident => (
                                <option key={resident._id} value={resident._id}>
                                    {resident.fullName} {resident.parent ? `(Parent ID: ${resident.parent.parentId})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Record Subject</label>
                        <input name="recordSubject" type="text" defaultValue={modalInfo.data?.subject || ''} required className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Record Notes</label>
                        <textarea name="recordNotes" rows="4" defaultValue={modalInfo.data?.notes || ''} required className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status Level</label>
                        <select name="statusLevel" defaultValue={modalInfo.data?.statusLevel || ''} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                            <option value="">-- Select Status --</option>
                            <option value="Good">Good</option>
                            <option value="Stable">Stable</option>
                            <option value="Needs Attention">Needs Attention</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">
                            {modalInfo.type === 'addResidentRecord' ? 'Add Record' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}