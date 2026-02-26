import express from 'express';
import { updateUserProfile, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../config/cloudinary.js';

const router = express.Router();
router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', upload.single('avatar'), updateUserProfile);

export default router;