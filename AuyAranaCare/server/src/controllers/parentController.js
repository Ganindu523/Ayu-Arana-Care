import asyncHandler from 'express-async-handler';
import Parent from '../models/Parent.js';

/**
 * @desc    Get the next available Parent ID
 * @returns {number} The next sequential parent ID
 */
const getNextParentId = async () => {
    // Find the parent with the highest parentId
    const lastParent = await Parent.findOne().sort({ parentId: -1 });
    
    // If a parent exists, increment their ID. Otherwise, start from 1.
    if (lastParent) {
        return lastParent.parentId + 1;
    } else {
        return 1;
    }
};

/**
 * @desc    Register a new parent
 * @route   POST /api/parents
 * @access  Private/Admin (currently public for debugging)
 */
export const registerParent = asyncHandler(async (req, res) => {
    const { fullName, address, phone, nic, email, dateOfBirth, emergencyContact } = req.body;

    // Basic validation
    if (!fullName || !address || !phone || !nic || !dateOfBirth || !emergencyContact || !emergencyContact.name || !emergencyContact.phone || !emergencyContact.relationship) {
        res.status(400);
        throw new Error('Please fill out all required fields, including emergency contact details.');
    }

    // Check if a parent with the same NIC already exists
    const nicExists = await Parent.findOne({ nic });
    if (nicExists) {
        res.status(400);
        throw new Error('A parent with this NIC already exists.');
    }

    // Generate the next sequential parent ID
    const parentId = await getNextParentId();

    const parent = new Parent({
        parentId,
        fullName,
        address,
        phone,
        nic,
        email,
        dateOfBirth,
        emergencyContact,
        // registeredBy: req.admin._id // This should be enabled when admin auth is restored
    });

    const createdParent = await parent.save();
    res.status(201).json(createdParent);
});

/**
 * @desc    Get all registered parents
 * @route   GET /api/parents
 * @access  Private/Admin (currently public for debugging)
 */
export const getParents = asyncHandler(async (req, res) => {
    const parents = await Parent.find({}).sort({ parentId: 'asc' });
    res.json(parents);
});
