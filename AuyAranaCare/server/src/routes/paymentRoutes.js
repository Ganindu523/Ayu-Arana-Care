import express from 'express';
import { processMembershipPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js'; // This is crucial for security

const router = express.Router();

// This route will be protected, so only logged-in users can access it.
router.route('/membership').post(protect, processMembershipPayment);

export default router;
