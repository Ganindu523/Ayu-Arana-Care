// models/CheckupType.js
import mongoose from 'mongoose'; // Use import for mongoose

const checkupTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Export the model using 'export default'
export default mongoose.model('CheckupType', checkupTypeSchema);