// src/pages/AdminPages/AdminContactMessages.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// You might also need useAuth here if you want to check isAdminAuthenticated from context
// import { useAuth } from '../../context/UserContext'; 

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // If you want to use context's isAdminAuthenticated for initial check:
  // const { isAdminAuthenticated, loading: authLoading } = useAuth(); 

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        // --- FIX: Get adminToken from localStorage ---
        const token = localStorage.getItem('adminToken'); // Changed from 'token' to 'adminToken'

        // Optional: Check context's auth status if you imported useAuth
        // if (authLoading) return; // Wait for auth context to load
        // if (!isAdminAuthenticated || !token) { ... } // More robust check

        if (!token) {
            setError('Authentication token not found. Please log in as an administrator.');
            setLoading(false);
            // Consider redirecting here if the AdminLayoutWrapper doesn't catch it
            // navigate('/auth'); 
            return;
        }

        const res = await axios.get('http://localhost:5000/api/contact', {
          headers: {
            Authorization: `Bearer ${token}`, // Use the correct adminToken
          },
        });
        setMessages(res.data);
      } catch (err) {
        if (err.response) {
            console.error('Error fetching contact messages (server response):', err.response.data);
            setError(err.response.data.message || 'Failed to fetch messages.');
        } else if (err.request) {
            console.error('Error fetching contact messages (no response):', err.request);
            setError('No response from server. Check network connection.');
        } else {
            console.error('Error fetching contact messages:', err.message);
            setError(err.message || 'An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []); // Depend on authLoading, isAdminAuthenticated if you add useAuth

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center text-gray-700">
        Loading messages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">📨 Contact Messages</h2>
      {messages.length === 0 ? (
        <p className="text-gray-600">No messages yet.</p>
      ) : (
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div
              key={msg._id || index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all border border-gray-200"
            >
              <h4 className="text-xl font-semibold text-blue-800">{msg.fullName}</h4>
              <p className="text-gray-700 text-sm mb-1">📧 {msg.email}</p>
              <p className="text-gray-700 text-sm mb-2">📞 {msg.phone}</p>
              <p className="text-gray-900 whitespace-pre-wrap">{msg.message}</p>
              <p className="text-xs text-gray-500 mt-2">📅 {new Date(msg.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;