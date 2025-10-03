// C:\Users\ASUS\Desktop\ayu arana care\test-app\test-app\test-app\frontend\src\pages\AdminPages\AdminFeedbackPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon, CheckCircleIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function AdminFeedbackPage() {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // State to hold IDs of feedbacks selected to be displayed on home
    const [selectedFeedbackIds, setSelectedFeedbackIds] = useState([]);
    // State to track if there are pending changes to save
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);


    const fetchFeedback = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/feedback/all');
            setFeedback(response.data);
            // Initialize selectedFeedbackIds based on current displayOnHome status
            const initiallySelected = response.data
                .filter(item => item.displayOnHome)
                .map(item => item._id);
            setSelectedFeedbackIds(initiallySelected);
            setLoading(false);
            setHasUnsavedChanges(false); // Reset changes when data is fetched
        } catch (err) {
            console.error('Error fetching feedback for admin:', err);
            setError('Failed to load feedback. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedFeedbackIds(prevSelectedIds => {
            if (prevSelectedIds.includes(id)) {
                return prevSelectedIds.filter(feedbackId => feedbackId !== id);
            } else {
                return [...prevSelectedIds, id];
            }
        });
        setHasUnsavedChanges(true); // Mark that there are unsaved changes
    };

    const handleSaveDisplayOnHome = async () => {
        if (!window.confirm('Are you sure you want to update the feedbacks displayed on the home page? This will update ALL feedback\'s display status.')) {
            return;
        }

        setLoading(true); // Show loading while saving
        try {
            // Send the array of selected IDs to the backend
            // You will need a new or modified backend endpoint for this.
            // Example: PUT /api/feedback/update-home-display
            const response = await axios.put('http://localhost:5000/api/feedback/update-home-display', {
                feedbackIdsToDisplay: selectedFeedbackIds
            });

            if (response.status === 200) {
                alert('Feedbacks displayed on home page updated successfully!');
                fetchFeedback(); // Re-fetch to confirm changes
            }
        } catch (err) {
            console.error('Error updating display status:', err.response?.data || err.message);
            alert(`Failed to update display status: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false); // Hide loading
        }
    };

    const handleDeleteFeedback = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:5000/api/feedback/${id}`);
            if (response.status === 200) {
                alert('Feedback deleted successfully!');
                fetchFeedback(); // Re-fetch to update the list and selected IDs
            }
        } catch (err) {
            console.error('Error deleting feedback:', err.response?.data || err.message);
            alert(`Failed to delete feedback: ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading feedback...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Manage Feedback</h1>

            <div className="mb-6 flex justify-end">
                <button
                    onClick={handleSaveDisplayOnHome}
                    disabled={loading || !hasUnsavedChanges} // Disable if loading or no changes
                    className={`px-6 py-3 rounded-md text-white font-semibold transition-colors duration-200
                                ${hasUnsavedChanges && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    {loading ? 'Saving...' : 'Save Displayed Feedback'}
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                {feedback.length === 0 ? (
                    <p className="text-center py-10 text-gray-500">No feedback submitted yet.</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                        onChange={() => {
                                            if (selectedFeedbackIds.length === feedback.length) {
                                                setSelectedFeedbackIds([]);
                                            } else {
                                                setSelectedFeedbackIds(feedback.map(item => item._id));
                                            }
                                            setHasUnsavedChanges(true);
                                        }}
                                        checked={selectedFeedbackIds.length === feedback.length && feedback.length > 0}
                                        title="Select/Deselect All"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Home Display Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {feedback.map((item) => (
                                <tr key={item._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                            checked={selectedFeedbackIds.includes(item._id)}
                                            onChange={() => handleCheckboxChange(item._id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.message}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString('en-US', { timeZone: 'Asia/Colombo' })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {item.displayOnHome ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircleIcon className="h-4 w-4 mr-1"/> Yes
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                <XMarkIcon className="h-4 w-4 mr-1"/> No
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* The individual toggle button is removed as we are now using checkboxes and a save button */}
                                        {/* You can add an "Edit" button if you want to allow full message edits from here */}
                                        {/* <button onClick={() => handleEditFeedback(item)} className="text-indigo-600 hover:text-indigo-900 ml-4"><PencilIcon className="h-5 w-5"/></button> */}
                                        <button onClick={() => handleDeleteFeedback(item._id)} className="text-red-600 hover:text-red-900 ml-4">
                                            <TrashIcon className="h-5 w-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}