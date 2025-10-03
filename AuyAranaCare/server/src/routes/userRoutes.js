import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; // This is crucial for security

const router = express.Router();

// The 'protect' middleware ensures only a logged-in user can access these routes.
router.route('/profile')
    .get(protect, getUserProfile)   // Get the logged-in user's profile
    .put(protect, updateUserProfile);  // Update the logged-in user's profile

export default router;
