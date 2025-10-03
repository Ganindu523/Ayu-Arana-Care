// server/src/routes/careerRoutes.js

// --- CHANGE: Use ES Module 'import' syntax for all dependencies ---
import express from 'express';
const router = express.Router();

import {
    getAllAdminCareers,
    getOpenCareers,
    addCareerBranch,
    addRoleToBranch,
    updateRoleInBranch,
    deleteRoleFromBranch,
    deleteCareerBranch,
} from '../controllers/careerController.js'; // IMPORTANT: Use .js extension for local import

// --- IMPORTANT CHANGE: Import the 'admin' middleware, not 'protect' and 'authorizeRoles' ---
// Based on your authMiddleware.js, you have a dedicated 'admin' middleware.
import { admin } from '../middleware/authMiddleware.js'; // IMPORTANT: Use .js extension and named import for 'admin'

// Public routes for the frontend CareersPage
router.get('/', getOpenCareers);

// Admin routes - protected by the 'admin' middleware
// --- CHANGE: Use 'admin' middleware directly for admin routes ---
router.route('/admin')
    .get(admin, getAllAdminCareers); // Use 'admin' middleware

router.route('/admin/branch')
    .post(admin, addCareerBranch); // Use 'admin' middleware

router.route('/admin/branch/:branchId')
    .delete(admin, deleteCareerBranch); // Use 'admin' middleware

router.route('/admin/:branchId/role')
    .post(admin, addRoleToBranch); // Use 'admin' middleware

router.route('/admin/:branchId/role/:roleId')
    .put(admin, updateRoleInBranch) // Use 'admin' middleware
    .delete(admin, deleteRoleFromBranch); // Use 'admin' middleware


// --- THIS IS THE CRUCIAL LINE for ES Modules: Export the router as a DEFAULT export ---
export default router;