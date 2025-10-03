// Path: /server/src/routes/authRoutes.js

import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Parent from '../models/Parent.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

const router = express.Router();

// --- Helper function to create a token ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user, link to a parent, and send email
// @route   POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
    const { fullName, email, password, phone, nic, parentId, dateOfBirth } = req.body;

    if (!fullName || !email || !password || !parentId) {
        res.status(400);
        throw new Error('Full name, email, password, and Parent Registration ID are required.');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('A user with this email already exists.');
    }

    const parent = await Parent.findOne({ parentId: parentId });
    if (!parent) {
        res.status(404);
        throw new Error(`Parent with Registration ID #${parentId} not found. Please check the ID and try again.`);
    }

    const user = await User.create({
        fullName,
        email,
        password,
        phone,
        nic,
        dateOfBirth,
        parent: parent._id,
    });

    if (user) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // --- UPDATED EMAIL HTML ---
        // This new HTML structure matches the design in your image.
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #800000;">Welcome to Ayu Arana Care!</h1>
                <p>Dear ${user.fullName},</p>
                <p>Thank you for registering. Your account has been created successfully and linked to your parent/resident.</p>
                
                <h3 style="color: #800000;">Your Registration Details:</h3>
                <ul>
                    <li><strong>Full Name:</strong> ${user.fullName}</li>
                    <li><strong>NIC:</strong> ${user.nic || 'Not provided'}</li>
                    <li><strong>Phone:</strong> ${user.phone || 'Not provided'}</li>
                    <li><strong>Date of Birth:</strong> ${user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-GB') : 'Not provided'}</li>
                </ul>

                <h3 style="color: #800000;">Linked Parent Information:</h3>
                <ul>
                    <li><strong>Parent Registration ID:</strong> ${parent.parentId}</li>
                    <li><strong>Parent Name:</strong> ${parent.fullName}</li>
                </ul>

                <p>If any of the above information is incorrect, please contact our administrators immediately.</p>
                <br>
                <p>Thank you,<br>The Ayu Arana Care Team</p>
            </div>
        `;

        try {
            const mailOptions = {
                from: `"Ayu Arana Care" <${process.env.MAIL_USER}>`,
                to: user.email,
                subject: 'Successful Registration with Ayu Arana Care',
                html: emailHtml // Use the new formatted HTML
            };
            await transporter.sendMail(mailOptions);
            console.log(`Registration email sent successfully to ${user.email}`);
        } catch (emailError) {
            console.error('Error sending registration email:', emailError);
        }

        res.status(201).json({
            message: 'Registration successful! A confirmation email has been sent.',
            user: { id: user._id, fullName: user.fullName, email: user.email },
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data. Registration failed.');
    }
}));

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Please provide both email and password.' });
        return;
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password');
    }
    
    if (!process.env.JWT_SECRET) {
        console.error('FATAL ERROR: JWT_SECRET is not defined!');
        res.status(500);
        throw new Error('Server configuration error.');
    }

    res.json({
        message: 'Login successful!',
        user: { id: user._id, fullName: user.fullName, email: user.email },
        token: generateToken(user._id),
    });
}));

export default router;

