import express from 'express';
import { registerParent, getParents } from '../controllers/parentController.js';
// import { admin } from '../middleware/authMiddleware.js'; // Import this when auth is restored

const router = express.Router();

// We have removed the 'admin' middleware for now to simplify debugging.
// Remember to add it back to protect these routes.
// Example: router.route('/').post(admin, registerParent);

router.route('/')
    .post(registerParent) // Route to register a new parent
    .get(getParents);      // Route to get all parents

export default router;
