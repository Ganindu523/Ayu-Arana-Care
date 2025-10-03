import React, { useState, useEffect } from 'react';
import { UserPlusIcon, UserGroupIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, CakeIcon, ShieldCheckIcon, IdentificationIcon } from '@heroicons/react/24/outline';

// A reusable input component for our form
const FormInput = ({ icon, label, name, type = 'text', value, onChange, required = true }) => {
    const Icon = icon;
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type={type}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                    autoComplete="off"
                />
            </div>
        </div>
    );
};

export default function AdminParentRegistrationPage() {
    const initialFormState = {
        fullName: '',
        address: '',
        phone: '',
        nic: '',
        email: '',
        dateOfBirth: '',
        emergencyContact: {
            name: '',
            phone: '',
            relationship: '',
        },
    };

    const [formData, setFormData] = useState(initialFormState);
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch all parents when the component mounts
    useEffect(() => {
        const fetchParents = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/parents');
                if (!response.ok) {
                    throw new Error('Failed to fetch parents');
                }
                const data = await response.json();
                setParents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchParents();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEmergencyChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            emergencyContact: {
                ...prev.emergencyContact,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/parents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to register parent.');
            }

            setSuccess(`Successfully registered ${data.fullName} with Parent ID: ${data.parentId}`);
            // Add new parent to the list, sorted by parentId
            setParents(prev => [...prev, data].sort((a, b) => a.parentId - b.parentId));
            setFormData(initialFormState); // Reset the form

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Registration Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center mb-6">
                                <UserPlusIcon className="h-8 w-8 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">Register New Parent</h2>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                                <FormInput icon={UserGroupIcon} label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                                <FormInput icon={MapPinIcon} label="Address" name="address" value={formData.address} onChange={handleChange} />
                                <FormInput icon={IdentificationIcon} label="NIC Number" name="nic" value={formData.nic} onChange={handleChange} />
                                <FormInput icon={CakeIcon} label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                                
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-4">Contact Details</h3>
                                <FormInput icon={PhoneIcon} label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                                <FormInput icon={EnvelopeIcon} label="Email (Optional)" name="email" type="email" value={formData.email} onChange={handleChange} required={false} />

                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-4">Emergency Contact</h3>
                                <FormInput icon={UserGroupIcon} label="Contact Name" name="name" value={formData.emergencyContact.name} onChange={handleEmergencyChange} />
                                <FormInput icon={PhoneIcon} label="Contact Phone" name="phone" value={formData.emergencyContact.phone} onChange={handleEmergencyChange} />
                                <FormInput icon={ShieldCheckIcon} label="Relationship" name="relationship" value={formData.emergencyContact.relationship} onChange={handleEmergencyChange} />
                                
                                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
                                {success && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{success}</p>}

                                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors">
                                    {loading ? 'Registering...' : 'Register Parent'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Registered Parents List Section */}
                    <div className="lg:col-span-2">
                         <div className="bg-white p-6 rounded-2xl shadow-lg">
                             <div className="flex items-center mb-6">
                                <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">Registered Parents</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIC</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading ? (
                                            <tr><td colSpan="4" className="text-center py-10 text-gray-500">Loading...</td></tr>
                                        ) : parents.length === 0 ? (
                                            <tr><td colSpan="4" className="text-center py-10 text-gray-500">No parents have been registered yet.</td></tr>
                                        ) : (
                                            parents.map((parent) => (
                                                <tr key={parent._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{String(parent.parentId).padStart(4, '0')}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parent.fullName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parent.phone}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parent.nic}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
