// src/pages/AdminPages/AdminCareersPage.jsx
import React, { useState, useEffect } from 'react';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/UserContext'; // Using useAuth from your context

const AdminCareersPage = () => {
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openBranch, setOpenBranch] = useState(null);
    const [openRole, setOpenRole] = useState(null);

    const [showAddBranchModal, setShowAddBranchModal] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');

    const [showAddRoleModal, setShowAddRoleModal] = useState(false);
    const [selectedBranchForRole, setSelectedBranchForRole] = useState(null);
    const [newRole, setNewRole] = useState({
        title: '',
        description: '',
        requirements: '', // Comma separated string
        status: 'Open',
    });

    const [showEditRoleModal, setShowEditRoleModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null); // { branchId, roleData }
    const [editedRoleData, setEditedRoleData] = useState({
        title: '',
        description: '',
        requirements: '',
        status: 'Open',
    });

    const navigate = useNavigate();
    const { isAdminAuthenticated, loading: authLoading } = useAuth(); // Get admin auth status and loading state

    const fetchCareers = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken'); // <--- IMPORTANT: Get adminToken
            if (!token) {
                setError('Authentication token not found. Please log in.');
                setLoading(false);
                navigate('/auth'); // Redirect to login if no token
                return;
            }

            const res = await fetch('/api/careers/admin', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    setError('Unauthorized access. Please log in as an administrator.');
                    navigate('/auth'); // Redirect to login if unauthorized or forbidden
                    return;
                }
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to fetch careers');
            }

            const data = await res.json();
            setCareers(data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching careers:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) { // Wait until auth status is determined
            if (isAdminAuthenticated) {
                fetchCareers();
            } else {
                // If auth loaded and not admin, redirect
                navigate('/auth'); // Redirect if not authenticated as admin
            }
        }
    }, [isAdminAuthenticated, authLoading, navigate]);

    const toggleBranch = (id) => {
        setOpenBranch(openBranch === id ? null : id);
        setOpenRole(null);
    };

    const toggleRole = (id) => {
        setOpenRole(openRole === id ? null : id);
    };

    const handleAddBranch = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken'); // <--- IMPORTANT: Use adminToken
            const res = await fetch('/api/careers/admin/branch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newBranchName })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to add branch');
            }
            await fetchCareers();
            setShowAddBranchModal(false);
            setNewBranchName('');
        } catch (err) { setError(err.message); console.error("Error adding branch:", err); }
    };

    const handleDeleteBranch = async (branchId) => {
        if (!window.confirm('Are you sure you want to delete this branch and all its roles? This action cannot be undone.')) { return; }
        try {
            const token = localStorage.getItem('adminToken'); // <--- IMPORTANT: Use adminToken
            const res = await fetch(`/api/careers/admin/branch/${branchId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to delete branch');
            }
            await fetchCareers();
        } catch (err) { setError(err.message); console.error("Error deleting branch:", err); }
    };

    const handleAddRole = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken'); // <--- IMPORTANT: Use adminToken
            const res = await fetch(`/api/careers/admin/${selectedBranchForRole}/role`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...newRole, requirements: newRole.requirements.split(',').map(req => req.trim()).filter(req => req !== '') })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to add role');
            }
            await fetchCareers();
            setShowAddRoleModal(false);
            setNewRole({ title: '', description: '', requirements: '', status: 'Open' });
            setSelectedBranchForRole(null);
        } catch (err) { setError(err.message); console.error("Error adding role:", err); }
    };

    const handleEditRole = async (e) => {
        e.preventDefault();
        if (!editingRole) return;
        try {
            const token = localStorage.getItem('adminToken'); // <--- IMPORTANT: Use adminToken
            const res = await fetch(`/api/careers/admin/${editingRole.branchId}/role/${editingRole.role._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...editedRoleData, requirements: editedRoleData.requirements.split(',').map(req => req.trim()).filter(req => req !== '') })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update role');
            }
            await fetchCareers();
            setShowEditRoleModal(false);
            setEditingRole(null);
            setEditedRoleData({ title: '', description: '', requirements: '', status: 'Open' });
        } catch (err) { setError(err.message); console.error("Error updating role:", err); }
    };

    const handleDeleteRole = async (branchId, roleId) => {
        if (!window.confirm('Are you sure you want to delete this role?')) { return; }
        try {
            const token = localStorage.getItem('adminToken'); // <--- IMPORTANT: Use adminToken
            const res = await fetch(`/api/careers/admin/${branchId}/role/${roleId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to delete role');
            }
            await fetchCareers();
        } catch (err) { setError(err.message); console.error("Error deleting role:", err); }
    };

    const openAddRoleModal = (branchId) => { setSelectedBranchForRole(branchId); setNewRole({ title: '', description: '', requirements: '', status: 'Open' }); setShowAddRoleModal(true); };
    const openEditRoleModal = (branchId, role) => { setEditingRole({ branchId, role }); setEditedRoleData({ title: role.title, description: role.description, requirements: role.requirements.join(', '), status: role.status, }); setShowEditRoleModal(true); };

    if (loading || authLoading) { return <div className="text-center p-10 text-gray-700">Loading career data for admin...</div>; }
    if (!isAdminAuthenticated) { return <div className="text-center p-10 text-red-600">You are not authorized to view this page.</div>; }
    if (error) { return <div className="text-center p-10 text-red-600">Error: {error}. Please try again.</div>; }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Career Opportunities</h1>
                <button onClick={() => setShowAddBranchModal(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <PlusCircleIcon className="h-5 w-5 mr-2" /> Add New Branch
                </button>
            </header>
            {careers.length === 0 && !loading && (<p className="text-center text-gray-500">No career branches found. Add a new branch to get started!</p>)}
            <div className="space-y-6">
                {careers.map((branch) => (
                    <div key={branch._id} className="border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white">
                        <button onClick={() => toggleBranch(branch._id)} className="w-full flex justify-between items-center p-5 bg-blue-50 hover:bg-blue-100 focus:outline-none">
                            <h2 className="text-2xl font-semibold text-blue-800">{branch.name}</h2>
                            <ChevronDownIcon className={`h-7 w-7 text-blue-700 transform transition-transform duration-300 ${openBranch === branch._id ? 'rotate-180' : ''}`} />
                        </button>
                        <Transition show={openBranch === branch._id} enter="transition-all duration-300 ease-out" enterFrom="max-h-0 opacity-0" enterTo="max-h-screen opacity-100" leave="transition-all duration-200 ease-in" leaveFrom="max-h-screen opacity-100" leaveTo="max-h-0 opacity-0">
                            <div className="bg-gray-50 border-t border-gray-200 p-4 sm:p-6">
                                <div className="flex justify-end gap-2 mb-4">
                                    <button onClick={() => openAddRoleModal(branch._id)} className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                                        <PlusCircleIcon className="h-4 w-4 mr-1" /> Add Role
                                    </button>
                                    <button onClick={() => handleDeleteBranch(branch._id)} className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
                                        <TrashIcon className="h-4 w-4 mr-1" /> Delete Branch
                                    </button>
                                </div>
                                {branch.roles.length === 0 ? (<p className="text-center text-gray-500 py-4">No roles available for this branch. Click "Add Role" to create one.</p>) : (
                                    <div className="space-y-3">
                                        {branch.roles.map((role) => (
                                            <div key={role._id} className="border bg-white border-gray-200 rounded-md shadow-sm">
                                                <button onClick={() => toggleRole(role._id)} className="w-full flex justify-between items-center p-4 text-left">
                                                    <span className={`font-medium ${role.status === 'Open' ? 'text-gray-800' : 'text-red-500 line-through'}`}>{role.title} ({role.status})</span>
                                                    <ChevronDownIcon className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${openRole === role._id ? 'rotate-180' : ''}`} />
                                                </button>
                                                <Transition show={openRole === role._id}>
                                                    <div className="px-4 pb-4 border-t border-gray-100">
                                                        <p className="mt-3 text-gray-600">{role.description}</p>
                                                        <div className="mt-4">
                                                            <h4 className="font-semibold text-gray-700 flex items-center">Requirements</h4>
                                                            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                                                                {role.requirements.map((req, index) => (<li key={index}>{req}</li>))}
                                                            </ul>
                                                        </div>
                                                        <div className="mt-4 flex justify-end space-x-2">
                                                            <button onClick={() => openEditRoleModal(branch._id, role)} className="flex items-center px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600">
                                                                <PencilSquareIcon className="h-4 w-4 mr-1" /> Edit
                                                            </button>
                                                            <button onClick={() => handleDeleteRole(branch._id, role._id)} className="flex items-center px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">
                                                                <TrashIcon className="h-4 w-4 mr-1" /> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Transition>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Transition>
                    </div>
                ))}
            </div>

            {/* Add Branch Modal */}
            {showAddBranchModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Add New Career Branch</h3>
                        <form onSubmit={handleAddBranch}>
                            <div className="mb-4">
                                <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                                <input type="text" id="branchName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)} required />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowAddBranchModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Branch</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Role Modal */}
            {showAddRoleModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Add New Role to {careers.find(b => b._id === selectedBranchForRole)?.name}</h3>
                        <form onSubmit={handleAddRole}>
                            <div className="mb-4">
                                <label htmlFor="roleTitle" className="block text-sm font-medium text-gray-700 mb-1">Role Title</label>
                                <input type="text" id="roleTitle" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" value={newRole.title} onChange={(e) => setNewRole({ ...newRole, title: e.target.value })} required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="roleDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea id="roleDescription" rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" value={newRole.description} onChange={(e) => setNewRole({ ...newRole, description: e.target.value })} required ></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="roleRequirements" className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma-separated)</label>
                                <input type="text" id="roleRequirements" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" value={newRole.requirements} onChange={(e) => setNewRole({ ...newRole, requirements: e.target.value })} placeholder="e.g., BSc in Nursing, Valid RN License" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="roleStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select id="roleStatus" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" value={newRole.status} onChange={(e) => setNewRole({ ...newRole, status: e.target.value })} >
                                    <option value="Open">Open</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowAddRoleModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Role</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Role Modal */}
            {showEditRoleModal && editingRole && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Edit Role: {editingRole.role.title}</h3>
                        <form onSubmit={handleEditRole}>
                            <div className="mb-4">
                                <label htmlFor="editRoleTitle" className="block text-sm font-medium text-gray-700 mb-1">Role Title</label>
                                <input type="text" id="editRoleTitle" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" value={editedRoleData.title} onChange={(e) => setEditedRoleData({ ...editedRoleData, title: e.target.value })} required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="editRoleDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea id="editRoleDescription" rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" value={editedRoleData.description} onChange={(e) => setEditedRoleData({ ...editedRoleData, description: e.target.value })} required ></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="editRoleRequirements" className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma-separated)</label>
                                <input type="text" id="editRoleRequirements" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" value={editedRoleData.requirements} onChange={(e) => setEditedRoleData({ ...editedRoleData, requirements: e.target.value })} placeholder="e.g., BSc in Nursing, Valid RN License" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="editRoleStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select id="editRoleStatus" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" value={editedRoleData.status} onChange={(e) => setEditedRoleData({ ...editedRoleData, status: e.target.value })} >
                                    <option value="Open">Open</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowEditRoleModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCareersPage;