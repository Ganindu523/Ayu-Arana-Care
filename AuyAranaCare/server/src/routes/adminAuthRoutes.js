import express from 'express';
import { 
    loginAdmin, 
    registerAdmin,
    getAllUsersMembershipStatus, // For fetching payment history
    sendPaymentReminder          // For sending reminder emails
} from '../controllers/adminController.js';

// When you are ready to re-enable security, you can uncomment the line below
// import { admin } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// --- Admin Authentication Routes ---
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

// --- Membership Management Routes for Admin Panel ---

// GET /api/admin/memberships - Fetches all users' membership status
// To re-enable security: router.get('/memberships', admin, getAllUsersMembershipStatus);
router.get('/memberships', getAllUsersMembershipStatus);

// POST /api/admin/reminders/:userId - Sends a payment reminder email
// To re-enable security: router.post('/reminders/:userId', admin, sendPaymentReminder);
router.post('/reminders/:userId', sendPaymentReminder);

export default router;
