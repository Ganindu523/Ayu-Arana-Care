// server/models/MedicalRequest.js
import mongoose from 'mongoose'; // <-- Make sure this is 'import'
import User from './User.js'; // <-- Example: if MedicalRequest needs to reference User
import CheckupType from './CheckupType.js'; // <-- Example: if MedicalRequest needs to reference CheckupType

const medicalRequestSchema = new mongoose.Schema({
    resident: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (e.g., admin or another user)
        required: true,
    },
    checkupType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CheckupType', // Reference to the CheckupType model
        required: true,
    },
    notes: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Rejected'],
        default: 'Pending',
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid',
    },
    reportFile: {
        type: String, // Path or URL to the uploaded report file
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt field on save
medicalRequestSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the model using 'export default'
export default mongoose.model('MedicalRequest', medicalRequestSchema); // <-- Make sure this is 'export default'