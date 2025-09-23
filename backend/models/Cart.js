import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicineStock', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // Store price at time of adding to cart
    finalPrice: { type: Number, required: true } // Price after discount
}, { _id: false });

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure one cart per user per pharmacy
cartSchema.index({ userId: 1, pharmacyId: 1 }, { unique: true });

// Method to calculate total amount
cartSchema.methods.calculateTotal = function() {
    this.totalAmount = this.items.reduce((total, item) => {
        return total + (item.finalPrice * item.quantity);
    }, 0);
    return this.totalAmount;
};

// Update lastUpdated before save
cartSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    this.calculateTotal();
    next();
});

export default mongoose.model('Cart', cartSchema);