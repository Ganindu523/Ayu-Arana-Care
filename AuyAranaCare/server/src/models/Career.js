// C:\Users\Ganindu\Desktop\medical\test-app\test-app\server\src\models\Career.js
// This file MUST use ES Module syntax for exports to be correctly imported.

import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Role title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Role description is required'],
    },
    requirements: {
        type: [String], // Array of strings
        default: [],
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open',
    },
}, { _id: true });

const careerBranchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Branch name is required'],
        trim: true,
        unique: true,
    },
    roles: [roleSchema], // Array of roles within this branch
}, {
    timestamps: true
});

const Career = mongoose.model('Career', careerBranchSchema);

// THIS IS THE CRUCIAL LINE:
export default Career; // <-- It MUST be exactly this.