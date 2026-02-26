import express from 'express';
import { getAllUser } from '../controllers/homeController.js';
import { toggleLike } from '../controllers/interactionController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllUser);
router.post('/like/:toUserId', protect, toggleLike);

export default router;