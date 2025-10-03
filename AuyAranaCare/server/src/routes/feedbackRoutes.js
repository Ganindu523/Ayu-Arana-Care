// backend/routes/feedbackRoutes.js
import express from 'express';
const router = express.Router();
import { // <-- Named imports
    getAllFeedback,
    getHomePageFeedback,
    createFeedback,
    updateHomeDisplayStatus,
    deleteFeedback
} from '../controllers/feedbackController.js'; // <-- Note .js extension

router.get('/all', getAllFeedback);
router.get('/home', getHomePageFeedback);
router.post('/', createFeedback);
router.put('/update-home-display', updateHomeDisplayStatus);
router.delete('/:id', deleteFeedback);

export default router; // <-- Default export for the router