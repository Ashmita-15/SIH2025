import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    openingHours: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '21:00' }
    },
    deliveryAvailable: { type: Boolean, default: true },
    deliveryRadius: { type: Number, default: 5 }, // in kilometers
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

pharmacySchema.index({ location: 1 });
pharmacySchema.index({ isActive: 1 });

export default mongoose.model('Pharmacy', pharmacySchema);


