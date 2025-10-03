import React, { useState, useEffect } from 'react';
import { EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/UserContext'; // We can still use this for other context values if needed

const getStatusChip = (status) => {
    const styles = {
        'Paid': 'bg-green-100 text-green-800',
        'Unpaid': 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
};

export default function AdminMembershipPaymentsPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sending, setSending] = useState(null); // Tracks which reminder is being sent

    useEffect(() => {
        const fetchMembers = async () => {
            // --- THIS IS THE ROBUST FIX ---
            // Get the token directly from localStorage to bypass any context timing issues.
            const adminToken = localStorage.getItem('adminToken');

            // If the token does not exist in storage, then the user is truly not logged in as an admin.
            if (!adminToken) {
                setError("You must be logged in as an admin to view this page.");
                setLoading(false);
                return;
            }

            // If a token exists, we can proceed to fetch the data.
            setError('');

            try {
                const response = await fetch('/api/admin/memberships', {
                    headers: { 'Authorization': `Bearer ${adminToken}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch membership data.');
                }
                const data = await response.json();
                setMembers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []); // The empty dependency array ensures this effect runs only once when the component mounts.

    const handleSendReminder = async (userId) => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            alert("Your admin session has expired. Please log in again.");
            return;
        }

        setSending(userId);
        try {
            const response = await fetch(`/api/admin/reminders/${userId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reminder.');
            }
            alert(data.message); // Show success message
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setSending(null);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading payment history...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Membership Payment History</h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent/Resident</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {members.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10 text-gray-500">No membership data found.</td>
                                    </tr>
                                ) : (
                                    members.map((member) => (
                                        <tr key={member._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{member.fullName}</div>
                                                <div className="text-sm text-gray-500">{member.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.parent?.fullName || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 uppercase">{member.membership.planId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {member.membership.lastUpdated ? new Date(member.membership.lastUpdated).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChip(member.membership.paymentStatus)}`}>
                                                    {member.membership.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {member.membership.paymentStatus === 'Unpaid' && (
                                                    <button
                                                        onClick={() => handleSendReminder(member._id)}
                                                        disabled={sending === member._id}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400"
                                                    >
                                                        {sending === member._id ? <ClockIcon className="animate-spin h-4 w-4 mr-2" /> : <EnvelopeIcon className="h-4 w-4 mr-2" />}
                                                        {sending === member._id ? 'Sending...' : 'Send Reminder'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
