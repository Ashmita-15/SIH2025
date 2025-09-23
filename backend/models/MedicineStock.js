import mongoose from 'mongoose';

const medicineStockSchema = new mongoose.Schema({
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    medicineName: { type: String, required: true },
    genericName: { type: String, default: '' },
    brand: { type: String, default: '' },
    category: { type: String, default: 'General' },
    description: { type: String, default: '' },
    dosage: { type: String, default: '' },
    form: { type: String, enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Powder', 'Other'], default: 'Tablet' },
    price: { type: Number, required: true, default: 0 },
    mrp: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 }, // percentage
    quantity: { type: Number, default: 0 },
    minQuantity: { type: Number, default: 5 }, // minimum stock alert
    expiryDate: { type: Date },
    batchNumber: { type: String, default: '' },
    manufacturer: { type: String, default: '' },
    prescriptionRequired: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    image: { type: String, default: '' },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

medicineStockSchema.index({ pharmacyId: 1, medicineName: 1 }, { unique: true });
medicineStockSchema.index({ medicineName: 'text', genericName: 'text', brand: 'text' });
medicineStockSchema.index({ category: 1 });
medicineStockSchema.index({ isActive: 1 });

// Virtual for stock status
medicineStockSchema.virtual('stockStatus').get(function() {
    if (this.quantity === 0) return 'out-of-stock';
    if (this.quantity <= this.minQuantity) return 'low-stock';
    return 'in-stock';
});

// Virtual for final price after discount
medicineStockSchema.virtual('finalPrice').get(function() {
    if (!this.price) return 0;
    const discountAmount = (this.price * (this.discount || 0)) / 100;
    return Math.round((this.price - discountAmount) * 100) / 100; // Round to 2 decimal places
});

medicineStockSchema.set('toJSON', { virtuals: true });
medicineStockSchema.set('toObject', { virtuals: true });

export default mongoose.model('MedicineStock', medicineStockSchema);


