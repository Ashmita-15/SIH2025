import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    datetime: { type: Date, required: true },
    status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' },
    notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);


