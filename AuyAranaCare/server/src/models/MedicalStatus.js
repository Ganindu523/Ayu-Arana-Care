// C:\Users\ASUS\Desktop\ayu arana care\test-app\backend\src\models\MedicalStatus.js

import mongoose from 'mongoose';

const medicalStatusSchema = new mongoose.Schema({
    resident: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming 'User' model represents the resident
        required: true
    },
    subject: {
        type: String,
        required: [true, 'Subject is required for the medical status.'],
        trim: true,
        minlength: [3, 'Subject must be at least 3 characters long.']
    },
    notes: {
        type: String,
        required: [true, 'Notes are required for the medical status.'],
        trim: true,
        minlength: [10, 'Notes must be at least 10 characters long.']
    },
    // Example: A status field for the dropdown
    statusLevel: {
        type: String,
        enum: ['Good', 'Stable', 'Needs Attention', 'Critical'], // Define your dropdown options
        default: 'Stable',
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

const MedicalStatus = mongoose.model('MedicalStatus', medicalStatusSchema);

export default MedicalStatus;