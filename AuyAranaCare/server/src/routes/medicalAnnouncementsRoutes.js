// C:\Users\ASUS\Desktop\ayu arana care\test-app\test-app\test-app\server\src\routes\medicalAnnouncementsRoutes.js

import express from 'express';
import asyncHandler from 'express-async-handler';
import MedicalStatusUpdate from '../models/MedicalStatusUpdate.js';

const router = express.Router();

// @desc    Get all general medical announcements
// @route   GET /api/medical/status-updates (frontend calls this, mapped in server.js)
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const updates = await MedicalStatusUpdate.find().sort({ createdAt: -1 });
    res.status(200).json(updates);
}));

// @desc    Create a new general medical announcement
// @route   POST /api/medical/status-updates
// @access  Admin
router.post('/', asyncHandler(async (req, res) => {
    const { subject, notes } = req.body;

    if (!subject || !notes) {
        res.status(400); // Bad Request
        throw new Error('Subject and notes are required for the medical announcement.');
    }

    try { // Add try-catch around save operation for more specific error handling
        const newAnnouncement = new MedicalStatusUpdate({ subject, notes });
        const createdAnnouncement = await newAnnouncement.save();
        res.status(201).json({ message: 'Medical announcement posted successfully!', announcement: createdAnnouncement });
    } catch (error) {
        // If it's a Mongoose validation error, provide a more user-friendly message
        if (error.name === 'ValidationError') {
            res.status(400); // Bad Request for validation errors
            throw new Error(error.message); // Mongoose validation messages are usually good
        } else {
            res.status(500); // Internal Server Error for other issues
            throw new Error('Failed to create medical announcement due to an internal server error.');
        }
    }
}));

// @desc    Update an existing general medical announcement
// @route   PUT /api/medical/status-updates/:id
// @access  Admin
router.put('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { subject, notes } = req.body;

    if (!subject || !notes) {
        res.status(400);
        throw new Error('Subject and notes are required for updating the medical announcement.');
    }

    try { // Add try-catch around update operation
        const announcementToEdit = await MedicalStatusUpdate.findById(id);

        if (!announcementToEdit) {
            res.status(404);
            throw new Error('Medical announcement not found.');
        }

        announcementToEdit.subject = subject; // Use provided subject
        announcementToEdit.notes = notes;     // Use provided notes

        const updatedAnnouncement = await announcementToEdit.save(); // .save() will run validators
        res.status(200).json({ message: 'Medical announcement updated successfully!', announcement: updatedAnnouncement });
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400);
            throw new Error(error.message);
        } else {
            res.status(500);
            throw new Error('Failed to update medical announcement due to an internal server error.');
        }
    }
}));

// @desc    Delete a general medical announcement
// @route   DELETE /api/medical/status-updates/:id
// @access  Admin
router.delete('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedAnnouncement = await MedicalStatusUpdate.findByIdAndDelete(id);

    if (deletedAnnouncement) {
        res.status(200).json({ message: 'Medical announcement deleted successfully!' });
    } else {
        res.status(404);
        throw new Error('Medical announcement not found.');
    }
}));

export default router;