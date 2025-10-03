// C:\Users\ASUS\Desktop\ayu arana care\test-app\test-app\test-app\server\src\models\User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide your full name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address',
        ],
    },
    phone: {
        type: String,
        trim: true,
    },
    nic: {
        type: String,
        trim: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent',
        required: false, // <--- CHANGED TO FALSE FOR FLEXIBILITY
    },
    dateOfBirth: {
        type: Date,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user', // Ensure your test user has this role
    },
    membership: {
        planId: {
            type: String,
            enum: ['basic', 'enhanced', 'premium', 'none'],
            default: 'none',
        },
        paymentStatus: {
            type: String,
            enum: ['Paid', 'Unpaid'],
            default: 'Unpaid',
        },
        lastUpdated: {
            type: Date,
        },
    }
}, {
    timestamps: true
});

// Middleware to hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);