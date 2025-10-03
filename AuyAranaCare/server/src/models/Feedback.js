// backend/models/Feedback.js
import mongoose from 'mongoose'; // <-- CHANGED from require

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    displayOnHome: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback; // <-- CHANGED from module.exports