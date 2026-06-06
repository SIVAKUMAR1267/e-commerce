import express from 'express';
import { authUser, registerUser, getUserProfile, getUserData, syncUserData } from '../controllers/userController.js';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
router.post('/', registerUser);
router.post('/login', authUser);
router.route('/sync').get(protect, getUserData).post(protect, syncUserData);
export default router;