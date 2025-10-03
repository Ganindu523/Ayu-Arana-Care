// server/src/routes/contact.js
import express from 'express';
import Contact from '../models/Contact.js'; // Ensure .js extension
import { admin } from '../middleware/authMiddleware.js'; // IMPORTANT: Import the admin middleware

const router = express.Router();

// @desc    Send a new contact message
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
    try {
        const newContactMessage = new Contact(req.body);
        await newContactMessage.save();
        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error("Error sending contact message:", error); // Log the actual error
        res.status(500).json({ message: 'Failed to send message.', error: error.message });
    }
});

// @desc    Get all contact messages (for admin panel)
// @route   GET /api/contact
// @access  Private/Admin
router.get('/', admin, async (req, res) => { // ADDED: GET route, protected by 'admin' middleware
    try {
        const messages = await Contact.find().sort({ createdAt: -1 }); // Get all messages, sorted by newest first
        res.json(messages);
    } catch (error) {
        console.error("Error fetching contact messages:", error); // Log the actual error
        res.status(500).json({ message: 'Failed to fetch messages.', error: error.message });
    }
});


export default router;