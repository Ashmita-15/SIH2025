import Appointment from '../models/Appointment.js';

export const bookAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, datetime, notes } = req.body;
        const appt = await Appointment.create({ patientId, doctorId, datetime, notes });
        res.status(201).json(appt);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export const getAppointmentsForPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const appts = await Appointment.find({ patientId: id }).populate('doctorId', 'name specialization');
        res.json(appts);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export const getAppointmentsForDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const appts = await Appointment.find({ doctorId: id }).populate('patientId', 'name age village');
        res.json(appts);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


