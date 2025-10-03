import React, { useState, useEffect } from 'react';
import { 
    UserCircleIcon, 
    PencilSquareIcon, 
    EnvelopeIcon, 
    PhoneIcon, 
    IdentificationIcon, 
    CakeIcon, 
    ShieldCheckIcon, 
    StarIcon,
    UserIcon // <-- THIS IS THE FIX: Added the missing icon import
} from '@heroicons/react/24/solid';

// Reusable component for displaying a piece of information
const InfoField = ({ icon, label, value }) => {
    const Icon = icon;
    return (
        <div className="flex items-center">
            <Icon className="h-6 w-6 text-gray-400 mr-4" />
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-md font-semibold text-gray-900">{value || 'Not Provided'}</p>
            </div>
        </div>
    );
};

// Reusable component for an editable input field
const EditField = ({ label, name, type, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
    </div>
);

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setError("You must be logged in to view this page.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch profile data.');
                const data = await response.json();
                setProfile(data);
                setFormData({
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone || '',
                    nic: data.nic || '',
                    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('userToken');
        setLoading(true);
        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Failed to update profile.');
            const updatedProfile = await response.json();
            setProfile(prev => ({...prev, ...updatedProfile}));
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            setError(err.message);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-12">Loading Profile...</div>;
    if (error) return <div className="text-center p-12 text-red-500">{error}</div>;
    if (!profile) return <div className="text-center p-12">No profile data found.</div>;

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <UserCircleIcon className="h-24 w-24 text-blue-500" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{profile.fullName}</h1>
                        <p className="text-md text-gray-600">{profile.email}</p>
                    </div>
                </div>

                {/* Profile Details Grid */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User & Parent Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* User Details Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Your Information</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    <PencilSquareIcon className="h-5 w-5 mr-1" />
                                    {isEditing ? 'Cancel' : 'Edit'}
                                </button>
                            </div>
                            
                            {isEditing ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <EditField label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                                    <EditField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                                    <EditField label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} />
                                    <EditField label="NIC Number" name="nic" value={formData.nic} onChange={handleInputChange} />
                                    <EditField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
                                    <div className="flex justify-end">
                                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Changes</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <InfoField icon={EnvelopeIcon} label="Email Address" value={profile.email} />
                                    <InfoField icon={PhoneIcon} label="Phone Number" value={profile.phone} />
                                    <InfoField icon={IdentificationIcon} label="NIC Number" value={profile.nic} />
                                    <InfoField icon={CakeIcon} label="Date of Birth" value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-GB') : 'N/A'} />
                                </div>
                            )}
                        </div>

                        {/* Parent Details Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                             <h2 className="text-xl font-bold text-gray-800 mb-4">Linked Parent Information</h2>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <InfoField icon={UserIcon} label="Parent's Name" value={profile.parent.fullName} />
                                <InfoField icon={PhoneIcon} label="Parent's Phone" value={profile.parent.phone} />
                                <InfoField icon={IdentificationIcon} label="Parent's NIC" value={profile.parent.nic} />
                                <InfoField icon={UserCircleIcon} label="Parent's Address" value={profile.parent.address} />
                             </div>
                        </div>
                    </div>

                    {/* Right Column: Membership Status */}
                    <div className="lg:col-span-1">
                         <div className="bg-white rounded-2xl shadow-lg p-6">
                             <h2 className="text-xl font-bold text-gray-800 mb-4">Membership Status</h2>
                             <div className="space-y-4">
                                <InfoField icon={StarIcon} label="Current Plan" value={<span className="font-bold uppercase text-blue-600">{profile.membership.planId}</span>} />
                                <InfoField icon={ShieldCheckIcon} label="Payment Status" value={<span className={`px-2 py-1 text-xs font-semibold rounded-full ${profile.membership.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{profile.membership.paymentStatus}</span>} />
                             </div>
                             <button onClick={() => navigate('/membership')} className="w-full mt-6 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Manage Membership</button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
