import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Pharmacy from './models/Pharmacy.js';
import MedicineStock from './models/MedicineStock.js';

dotenv.config();

const run = async () => {
    await connectDB();
    await User.deleteMany({});
    await Pharmacy.deleteMany({});
    await MedicineStock.deleteMany({});

    const pw = await bcrypt.hash('password123', 10);

    // Create users
    const patient = await User.create({ 
        name: 'Ravi Kumar', 
        email: 'ravi@example.com', 
        passwordHash: pw, 
        role: 'patient', 
        age: 35, 
        village: 'Sundarpur',
        phone: '+91-9876543210'
    });
    
    const doctor = await User.create({ 
        name: 'Dr. Meera Sharma', 
        email: 'meera@example.com', 
        passwordHash: pw, 
        role: 'doctor', 
        specialization: 'General Medicine', 
        qualification: 'MBBS', 
        availability: '9am-1pm' 
    });
    
    const pharmacyOwner = await User.create({ 
        name: 'Rajesh Pharmacy Owner', 
        email: 'rajesh@pharmacy.com', 
        passwordHash: pw, 
        role: 'pharmacy',
        phone: '+91-9999999999'
    });

    // Create pharmacy with enhanced details
    const pharmacy = await Pharmacy.create({ 
        name: 'Gram Pharmacy & Medical Store', 
        location: 'Sundarpur', 
        address: 'Main Bazaar, Sundarpur Village, District Ludhiana, Punjab - 141001',
        contact: '+91-9999999999',
        email: 'gram.pharmacy@example.com',
        description: 'Your trusted neighborhood pharmacy providing quality medicines at affordable prices. We stock all essential medicines and provide home delivery within 5km radius.',
        deliveryAvailable: true,
        deliveryRadius: 5,
        openingHours: { open: '08:00', close: '22:00' },
        ownerId: pharmacyOwner._id
    });

    // Create sample medicines with detailed information
    const medicines = [
        {
            medicineName: 'Paracetamol 500mg',
            genericName: 'Paracetamol',
            brand: 'Crocin',
            category: 'General',
            dosage: '500mg',
            form: 'Tablet',
            price: 25,
            mrp: 30,
            discount: 16.67,
            quantity: 100,
            minQuantity: 10,
            manufacturer: 'GSK Pharmaceuticals',
            prescriptionRequired: false,
            description: 'Pain relief and fever reducer. Safe for adults and children above 6 years.',
            expiryDate: new Date('2026-12-31')
        },
        {
            medicineName: 'ORS Powder',
            genericName: 'Oral Rehydration Salts',
            brand: 'Electral',
            category: 'General',
            dosage: '21.8g',
            form: 'Powder',
            price: 15,
            mrp: 18,
            discount: 16.67,
            quantity: 200,
            minQuantity: 20,
            manufacturer: 'FDC Limited',
            prescriptionRequired: false,
            description: 'For treatment of dehydration due to diarrhea and vomiting.',
            expiryDate: new Date('2025-08-30')
        },
        {
            medicineName: 'Amoxicillin 250mg',
            genericName: 'Amoxicillin',
            brand: 'Novamox',
            category: 'Prescription',
            dosage: '250mg',
            form: 'Capsule',
            price: 45,
            mrp: 52,
            discount: 13.46,
            quantity: 50,
            minQuantity: 5,
            manufacturer: 'Cipla Ltd',
            prescriptionRequired: true,
            description: 'Antibiotic for bacterial infections. Complete the full course as prescribed.',
            expiryDate: new Date('2025-10-15')
        },
        {
            medicineName: 'Cetirizine 10mg',
            genericName: 'Cetirizine Hydrochloride',
            brand: 'Zyrtec',
            category: 'General',
            dosage: '10mg',
            form: 'Tablet',
            price: 18,
            mrp: 22,
            discount: 18.18,
            quantity: 80,
            minQuantity: 8,
            manufacturer: 'Dr. Reddy\'s Labs',
            prescriptionRequired: false,
            description: 'Antihistamine for allergy relief. Non-drowsy formula.',
            expiryDate: new Date('2025-06-20')
        },
        {
            medicineName: 'Vitamin D3 60000 IU',
            genericName: 'Cholecalciferol',
            brand: 'Uprise-D3',
            category: 'Vitamins',
            dosage: '60000 IU',
            form: 'Capsule',
            price: 35,
            mrp: 42,
            discount: 16.67,
            quantity: 30,
            minQuantity: 3,
            manufacturer: 'Alkem Laboratories',
            prescriptionRequired: false,
            description: 'High strength Vitamin D3 supplement for bone health.',
            expiryDate: new Date('2026-02-28')
        },
        {
            medicineName: 'Cough Syrup 100ml',
            genericName: 'Dextromethorphan + Chlorpheniramine',
            brand: 'Benadryl DR',
            category: 'General',
            dosage: '100ml',
            form: 'Syrup',
            price: 65,
            mrp: 75,
            discount: 13.33,
            quantity: 25,
            minQuantity: 3,
            manufacturer: 'Johnson & Johnson',
            prescriptionRequired: false,
            description: 'Relief from dry cough and throat irritation.',
            expiryDate: new Date('2025-09-12')
        },
        {
            medicineName: 'Aspirin 75mg',
            genericName: 'Acetylsalicylic Acid',
            brand: 'Ecosprin',
            category: 'Prescription',
            dosage: '75mg',
            form: 'Tablet',
            price: 12,
            mrp: 15,
            discount: 20,
            quantity: 0, // Out of stock
            minQuantity: 10,
            manufacturer: 'USV Ltd',
            prescriptionRequired: true,
            description: 'Low dose aspirin for cardiovascular protection.',
            expiryDate: new Date('2025-11-30')
        },
        {
            medicineName: 'Antacid Tablets',
            genericName: 'Magnesium Hydroxide + Aluminum Hydroxide',
            brand: 'ENO',
            category: 'General',
            dosage: '500mg',
            form: 'Tablet',
            price: 28,
            mrp: 32,
            discount: 12.5,
            quantity: 60,
            minQuantity: 6,
            manufacturer: 'GSK Consumer Healthcare',
            prescriptionRequired: false,
            description: 'Fast relief from acidity and gas.',
            expiryDate: new Date('2025-07-15')
        }
    ];

    // Create medicine stocks
    for (const med of medicines) {
        await MedicineStock.create({ ...med, pharmacyId: pharmacy._id });
    }

    console.log('Seeded successfully:');
    console.log('- Patient:', patient.email, '(password: password123)');
    console.log('- Doctor:', doctor.email, '(password: password123)');
    console.log('- Pharmacy Owner:', pharmacyOwner.email, '(password: password123)');
    console.log('- Pharmacy:', pharmacy.name);
    console.log('- Medicines:', medicines.length, 'items created');
    console.log('');
    console.log('You can now:');
    console.log('1. Login as pharmacy owner to manage inventory');
    console.log('2. Login as patient to browse and order medicines');
    console.log('3. Test the complete e-commerce flow');
    
    process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });


