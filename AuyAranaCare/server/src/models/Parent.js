import mongoose from 'mongoose';

const ParentSchema = new mongoose.Schema({
    // This will be our auto-incrementing ID, starting from 1
    parentId: {
        type: Number,
        required: true,
        unique: true,
        index: true, // Add an index for faster lookups
    },
    fullName: {
        type: String,
        required: [true, 'Please provide the parent\'s full name'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Please provide an address'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
        trim: true,
    },
    nic: {
        type: String,
        required: [true, 'Please provide the National Identity Card number'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        // Email is not required, but if provided, it must be unique
        // 'sparse' allows multiple documents to have a null value for this field
        sparse: true, 
        unique: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    emergencyContact: {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        relationship: { type: String, required: true, trim: true },
    },
    // This will store which admin registered the parent
    registeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        // required: true, // We'll disable this until auth is re-enabled
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

// Create the model from the schema
const Parent = mongoose.model('Parent', ParentSchema);

export default Parent;
