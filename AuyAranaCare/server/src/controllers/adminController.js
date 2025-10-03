import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js'; // For admin login/register
import User from '../models/User.js';   // For managing user memberships
import nodemailer from 'nodemailer';

// --- Nodemailer Transporter Configuration ---
// Used for sending payment reminder emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});


// @desc    Register a new admin (for initial setup)
// @route   POST /api/admin/register
// @access  Public
export const registerAdmin = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if(!fullName || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const adminExists = await Admin.findOne({ email });
    if(adminExists) {
        res.status(400);
        throw new Error('Admin with that email already exists');
    }

    // Create admin user (password will be hashed by the middleware in the Admin model)
    const admin = await Admin.create({
        fullName,
        email,
        password,
    });

    if (admin) {
        res.status(201).json({
            _id: admin._id,
            fullName: admin.fullName,
            email: admin.email,
            message: "Admin registered successfully."
        });
    } else {
        res.status(400);
        throw new Error('Invalid admin data');
    }
});


// @desc    Authenticate admin & get token
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find admin by email and select the password field for comparison
    const admin = await Admin.findOne({ email }).select('+password');

    // Check if admin exists and password is correct
    if (admin && (await admin.comparePassword(password))) {
        res.json({
            message: 'Admin login successful!',
            token: jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            }),
            admin: {
                id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
            }
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});


/**
 * @desc    Get all users with their membership and parent info for the admin panel
 * @route   GET /api/admin/memberships
 * @access  Private/Admin
 */
export const getAllUsersMembershipStatus = asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'user' })
        .populate('parent', 'fullName') // Populate the parent's full name
        .select('fullName email membership')
        .sort({ createdAt: -1 });

    res.json(users);
});


/**
 * @desc    Send a payment reminder email to a specific user
 * @route   POST /api/admin/reminders/:userId
 * @access  Private/Admin
 */
export const sendPaymentReminder = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);

    if (user && user.membership.paymentStatus === 'Unpaid') {
        try {
            const mailOptions = {
                from: `"Ayu Arana Care" <${process.env.MAIL_USER}>`,
                to: user.email,
                subject: `Payment Reminder for Your Ayu Arana Care Membership`,
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2>Payment Reminder</h2>
                        <p>Dear ${user.fullName},</p>
                        <p>This is a friendly reminder that your payment for the <strong>${user.membership.planId}</strong> membership plan is due.</p>
                        <p>Please log in to your account to complete the payment.</p>
                        <br>
                        <p>Thank you,</p>
                        <p><strong>The Ayu Arana Care Team</strong></p>
                    </div>
                `
            };
            await transporter.sendMail(mailOptions);
            res.json({ message: `Reminder sent successfully to ${user.fullName}` });
        } catch (emailError) {
            console.error('Error sending reminder email:', emailError);
            res.status(500);
            throw new Error('Failed to send reminder email.');
        }
    } else {
        res.status(404);
        throw new Error('User not found or payment is already made.');
    }
});
