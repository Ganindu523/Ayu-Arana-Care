import React, { useState } from 'react';
import axios from 'axios';

export default function Registration() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    parentRegId: '',
    dob: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/register', formData);
      setMessage('Registration successful!');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        nic: '',
        parentRegId: '',
        dob: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error(err);
      setMessage('Registration failed.');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-8 mt-10 rounded-lg border">
      <h2 className="text-3xl font-bold text-center mb-6">Register for Ayu Arana Care</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="nic" placeholder="NIC" value={formData.nic} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="parentRegId" placeholder="Parent Registration ID" value={formData.parentRegId} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full border p-2 rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
      </form>
      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
}
