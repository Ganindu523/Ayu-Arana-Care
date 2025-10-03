/*
================================================================================
FILE: /server/controllers/loginController.js (or wherever your user login logic is)
PURPOSE: Contains the logic for user login.
================================================================================
*/
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
        // --- THIS IS THE FIX ---
        // Upon successful login, send back a JSON object containing
        // a success message, the user's details, and a JWT token.
        res.json({
            message: 'Login successful!',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                // Add any other user fields you need on the frontend
            },
            token: jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '1d', // Token expires in 1 day
            }),
        });
    } else {
        // If login fails, send an error status and message
        res.status(401);
        throw new Error('Invalid email or password');
    }
});


