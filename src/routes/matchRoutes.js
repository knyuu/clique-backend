import express from 'express';
import {
    toggleLike,
    submitAvailability,
    finalizeMatch,
    getActionRequired,
    getPendingSchedules,
    getMyDates,
    getPendingLikes
} from '../controllers/matchController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.post('/toggle-like', toggleLike);
router.post('/submit-availability', submitAvailability);
router.post('/finalize', finalizeMatch);

router.get('/action-required', getActionRequired);
router.get('/pending-schedules', getPendingSchedules);
router.get('/my-dates', getMyDates);
router.get('/pending', getPendingLikes);

export default router;