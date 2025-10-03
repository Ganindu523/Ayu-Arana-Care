import React, { useState } from 'react';
import axios from 'axios'; // Import axios for HTTP requests

export default function Feedback() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'submitting'

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('submitting');
        try {
            const response = await axios.post('http://localhost:5000/api/feedback', formData);
            if (response.status === 201) { // 201 Created
                setSubmitStatus('success');
                alert('Thank you for your feedback!');
                setFormData({ name: '', email: '', message: '' }); // Clear form
            } else {
                throw new Error('Failed to submit feedback.');
            }
        } catch (error) {
            setSubmitStatus('error');
            console.error('Feedback submission error:', error.response?.data || error.message);
            alert(`Error submitting feedback: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="max-w-md mx-auto my-8 bg-white shadow p-6 rounded-lg">
            {/* Main heading color changed to maroon */}
            <h2 className="text-2xl font-semibold mb-4 text-center" style={{ color: '#800000' }}>Submit Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="sr-only">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        // Focus ring and border color changed to maroon
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-[#800000] focus:border-[#800000]"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        // Focus ring and border color changed to maroon
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-[#800000] focus:border-[#800000]"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="sr-only">Your feedback</label>
                    <textarea
                        name="message"
                        id="message"
                        placeholder="Your feedback"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        min-length="10" // Frontend validation hint
                        // Focus ring and border color changed to maroon
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-[#800000] focus:border-[#800000]"
                    />
                </div>
                <button
                    type="submit"
                    // Button background and hover color changed to maroon theme
                    className={`w-full bg-[#800000] text-white py-2 rounded-md font-semibold hover:bg-[#660000] transition-colors ${submitStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={submitStatus === 'submitting'}
                >
                    {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
                </button>
                {submitStatus === 'success' && (
                    <p className="text-center text-green-600 mt-2">Feedback sent successfully!</p>
                )}
                {submitStatus === 'error' && (
                    <p className="text-center text-red-600 mt-2">Failed to send feedback.</p>
                )}
            </form>
        </div>
    );
}