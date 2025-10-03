import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
    // req.user is attached by the 'protect' middleware
    // We find the user and populate the 'parent' field to get the parent's details
    const user = await User.findById(req.user.id).populate('parent', 'fullName address phone nic');

    if (user) {
        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            nic: user.nic,
            dateOfBirth: user.dateOfBirth,
            membership: user.membership,
            parent: user.parent, // This will now contain the parent's details
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.fullName = req.body.fullName || user.fullName;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.nic = req.body.nic || user.nic;
        user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;

        // Optionally, handle password updates
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            nic: updatedUser.nic,
            dateOfBirth: updatedUser.dateOfBirth,
            membership: updatedUser.membership,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
