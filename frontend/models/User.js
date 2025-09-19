import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor', 'pharmacy'], required: true },
    age: { type: Number },
    village: { type: String },
    specialization: { type: String },
    qualification: { type: String },
    availability: { type: String },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String }
}, { timestamps: true });

export default mongoose.model('User', userSchema);


