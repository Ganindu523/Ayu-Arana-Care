import React, { useState } from "react";
import axios from "axios";
import { useAuth } from '../../context/UserContext';

export default function AddCenterForm() {
    const [form, setForm] = useState({ branchName: "", address: "", email: "", description: "" }); // <-- ADD description
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { isAdminAuthenticated } = useAuth();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleFileChange = (e) => setImageFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (!imageFile) {
            setError("Please select an image file.");
            setLoading(false);
            return;
        }

        const adminToken = localStorage.getItem('adminToken');
        if (!isAdminAuthenticated || !adminToken) {
            setError("You are not authorized. Please log in as an admin.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("branchName", form.branchName);
        formData.append("address", form.address);
        formData.append("email", form.email);
        formData.append("description", form.description); // <-- ADD description
        formData.append("image", imageFile);

        try {
            const response = await axios.post("http://localhost:5000/api/center", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${adminToken}`,
                },
            });
            setMessage(response.data.message || "Center added successfully!");
            setForm({ branchName: "", address: "", email: "", description: "" }); // <-- Reset description
            setImageFile(null);
        } catch (err) {
            setError(err.response?.data?.message || "Error adding center.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add New Center</h2>
            {message && <p className="text-center text-green-600 mb-4">{message}</p>}
            {error && <p className="text-center text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                    <input name="branchName" value={form.branchName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" disabled={loading} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input name="address" value={form.address} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" disabled={loading} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" disabled={loading} />
                </div>

                {/* --- NEW: Description Textarea --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} required rows="4" className="w-full px-4 py-2 border rounded-lg" disabled={loading}></textarea>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Center Image</label>
                    <input type="file" onChange={handleFileChange} accept="image/*" required className="w-full border p-2 rounded-lg" disabled={loading} />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold" disabled={loading}>
                    {loading ? 'Adding Center...' : 'Add Center'}
                </button>
            </form>
        </div>
    );
}


