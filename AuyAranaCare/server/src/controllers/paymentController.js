import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose'; // <-- THIS IS THE FIX: Added the missing import

// --- Configure Nodemailer Transporter ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

/**
 * @desc    Process a (simulated) membership payment
 * @route   POST /api/payments/membership
 * @access  Private
 */
export const processMembershipPayment = asyncHandler(async (req, res) => {
    const { planId, amount, currency } = req.body;
    const user = await User.findById(req.user.id); // req.user comes from 'protect' middleware

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // --- 1. Update User's Membership ---
    user.membership.planId = planId;
    user.membership.paymentStatus = 'Paid';
    user.membership.lastUpdated = Date.now();
    await user.save();

    // --- 2. Create a Payment Record ---
    const payment = await Payment.create({
        userId: user._id,
        planId: planId,
        amount: amount,
        currency: currency,
        transactionId: `sim_${new mongoose.Types.ObjectId()}`, // This line now works correctly
    });

    // --- 3. Send Confirmation Email ---
    try {
        const mailOptions = {
            from: `"Ayu Arana Care" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject: 'Your Membership Payment was Successful!',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #28a745;">Payment Confirmation</h2>
                    <p>Dear ${user.fullName},</p>
                    <p>Thank you for your payment. Your membership plan has been successfully updated to the <strong>${planId}</strong> plan.</p>
                    <hr>
                    <h3 style="color: #0056b3;">Payment Details:</h3>
                    <ul>
                        <li><strong>Plan:</strong> ${planId.charAt(0).toUpperCase() + planId.slice(1)}</li>
                        <li><strong>Amount Paid:</strong> ${amount} ${currency}</li>
                        <li><strong>Transaction ID:</strong> ${payment.transactionId}</li>
                        <li><strong>Date:</strong> ${new Date(payment.paymentDate).toLocaleString('en-LK')}</li>
                    </ul>
                    <hr>
                    <p>You now have access to all the features included in your new plan.</p>
                    <br>
                    <p>Thank you,</p>
                    <p><strong>The Ayu Arana Care Team</strong></p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    } catch (emailError) {
        console.error('Error sending payment confirmation email:', emailError);
        // Don't throw an error here, as the payment itself was successful.
    }

    res.status(200).json({
        message: 'Payment successful and membership updated!',
        planId: user.membership.planId,
    });
});
