import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import { bookAppointment, getAppointmentsForPatient, getAppointmentsForDoctor, confirmAppointment, rejectAppointment, completeAppointment } from '../controllers/appointmentController.js';

const router = Router();

router.post('/book', authRequired, bookAppointment);
router.get('/patient/:id', authRequired, getAppointmentsForPatient);
router.get('/doctor/:id', authRequired, getAppointmentsForDoctor);
router.put('/:id/confirm', authRequired, confirmAppointment);
router.put('/:id/reject', authRequired, rejectAppointment);
router.put('/:id/complete', authRequired, completeAppointment);

export default router;


