// C:\Users\ASUS\Desktop\ayu arana care\test-app\test-app\test-app\server\src\models\MedicalStatusUpdate.js

import mongoose from 'mongoose';

const medicalStatusUpdateSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'Subject is required for a medical status update.'],
        trim: true,
        minlength: [3, 'Subject must be at least 3 characters long.']
    },
    notes: {
        type: String,
        required: [true, 'Notes are required for a medical status update.'],
        trim: true,
        minlength: [10, 'Notes must be at least 10 characters long.']
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const MedicalStatusUpdate = mongoose.model('MedicalStatusUpdate', medicalStatusUpdateSchema);

export default MedicalStatusUpdate;