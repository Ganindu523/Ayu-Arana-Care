// backend/controllers/feedbackController.js
import Feedback from '../models/Feedback.js'; // <-- CHANGED from require, and added .js extension

// Use named exports for each function
export const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json(feedback);
    } catch (error) {
        console.error('Error fetching all feedback:', error);
        res.status(500).json({ message: 'Server error while fetching all feedback.', error: error.message });
    }
};

export const getHomePageFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ displayOnHome: true }).sort({ createdAt: -1 });
        res.status(200).json(feedback);
    } catch (error) {
        console.error('Error fetching home page feedback:', error);
        res.status(500).json({ message: 'Server error while fetching home page feedback.', error: error.message });
    }
};

export const createFeedback = async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Please provide name, email, and message.' });
    }
    try {
        const newFeedback = new Feedback({ name, email, message });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully!', feedback: newFeedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Server error while submitting feedback.', error: error.message });
    }
};

export const updateHomeDisplayStatus = async (req, res) => {
    const { feedbackIdsToDisplay } = req.body;

    if (!Array.isArray(feedbackIdsToDisplay)) {
        return res.status(400).json({ message: 'feedbackIdsToDisplay must be an array of feedback IDs.' });
    }

    try {
        await Feedback.updateMany({}, { $set: { displayOnHome: false } });

        if (feedbackIdsToDisplay.length > 0) {
            await Feedback.updateMany(
                { _id: { $in: feedbackIdsToDisplay } },
                { $set: { displayOnHome: true } }
            );
        }

        res.status(200).json({ message: 'Home page display status updated successfully.' });
    } catch (error) {
        console.error('Error updating home display status:', error);
        res.status(500).json({ message: 'Server error while updating display status.', error: error.message });
    }
};

export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Feedback.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Feedback not found.' });
        }
        res.status(200).json({ message: 'Feedback deleted successfully.' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ message: 'Server error while deleting feedback.', error: error.message });
    }
};