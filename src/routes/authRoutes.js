import express from 'express';
import { register, login, logout, verifyOTP } from '../controllers/authController.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

router.post('/register', upload.single('avatar'), register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-otp', verifyOTP);

export default router;