import express from 'express';
import { getUserMembership, updateUserMembership } from '../controllers/membershipController.js';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have this middleware

const router = express.Router();

// This single route will handle both getting and updating the membership
// The 'protect' middleware ensures only logged-in users can access it.
router.route('/')
    .get(protect, getUserMembership)
    .put(protect, updateUserMembership);

export default router;
