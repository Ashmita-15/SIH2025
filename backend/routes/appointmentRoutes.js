import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import { bookAppointment, getAppointmentsForPatient, getAppointmentsForDoctor } from '../controllers/appointmentController.js';

const router = Router();

router.post('/book', authRequired, bookAppointment);
router.get('/patient/:id', authRequired, getAppointmentsForPatient);
router.get('/doctor/:id', authRequired, getAppointmentsForDoctor);

export default router;


