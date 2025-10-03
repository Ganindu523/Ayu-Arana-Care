import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * @desc    Get the current user's membership details
 * @route   GET /api/membership
 * @access  Private
 */
export const getUserMembership = asyncHandler(async (req, res) => {
    // req.user is attached by the 'protect' middleware
    const user = await User.findById(req.user.id);

    if (user) {
        res.json({
            planId: user.membership.planId,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc    Update the current user's membership plan
 * @route   PUT /api/membership
 * @access  Private
 */
export const updateUserMembership = asyncHandler(async (req, res) => {
    const { newPlanId } = req.body;
    const validPlans = ['basic', 'enhanced', 'premium'];

    if (!newPlanId || !validPlans.includes(newPlanId)) {
        res.status(400);
        throw new Error('Invalid plan ID provided.');
    }

    const user = await User.findById(req.user.id);

    if (user) {
        user.membership.planId = newPlanId;
        user.membership.lastUpdated = Date.now();
        const updatedUser = await user.save();

        res.json({
            message: 'Membership updated successfully!',
            planId: updatedUser.membership.planId,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
