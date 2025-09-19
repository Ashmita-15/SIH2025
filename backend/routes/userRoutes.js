import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile, updatePassword, getDoctors, getDoctorsBySpecialization } from '../controllers/userController.js';

const router = Router();

// Get user profile
router.get('/:id', authRequired, getUserProfile);

// Update user profile
router.put('/:id', authRequired, updateUserProfile);

// Update password
router.put('/:id/password', authRequired, updatePassword);

// Get doctors grouped by specialization
router.get('/doctors/specialization', authRequired, getDoctorsBySpecialization);

// Get all doctors
router.get('/doctors', authRequired, getDoctors);

export default router;