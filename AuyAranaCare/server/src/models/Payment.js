import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    planId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        default: 'LKR',
    },
    // In a real app, you would store a transaction ID from the payment gateway
    transactionId: {
        type: String,
        required: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
