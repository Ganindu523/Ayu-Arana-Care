// server/src/controllers/careerController.js

// --- CHANGE: Use ES Module 'import' syntax for all dependencies ---
import Career from '../models/Career.js'; // IMPORTANT: Add .js extension for local imports, and ensure Career.js has 'export default'
import asyncHandler from 'express-async-handler'; // For handling async errors

// @desc    Get all career branches and roles (for admin)
// @route   GET /api/careers/admin
// @access  Private (Admin only - handled by authMiddleware.js admin)
const getAllAdminCareers = asyncHandler(async (req, res) => {
    const careers = await Career.find({});
    res.status(200).json(careers);
});

// @desc    Get all open career branches and roles (for public display)
// @route   GET /api/careers
// @access  Public
const getOpenCareers = asyncHandler(async (req, res) => {
    const openCareers = await Career.aggregate([
        {
            $unwind: '$roles'
        },
        {
            $match: { 'roles.status': 'Open' }
        },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                roles: { $push: '$roles' }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                roles: 1
            }
        }
    ]);
    res.status(200).json(openCareers);
});


// @desc    Add a new career branch
// @route   POST /api/careers/admin/branch
// @access  Private (Admin only)
const addCareerBranch = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400);
        throw new Error('Branch name is required');
    }

    const branchExists = await Career.findOne({ name });
    if (branchExists) {
        res.status(400);
        throw new Error('Branch with that name already exists');
    }

    const newBranch = await Career.create({ name });
    res.status(201).json(newBranch);
});


// @desc    Add a new role to an existing branch
// @route   POST /api/careers/admin/:branchId/role
// @access  Private (Admin only)
const addRoleToBranch = asyncHandler(async (req, res) => {
    const { branchId } = req.params;
    const { title, description, requirements, status } = req.body;

    if (!title || !description) {
        res.status(400);
        throw new Error('Role title and description are required');
    }

    const branch = await Career.findById(branchId);

    if (!branch) {
        res.status(404);
        throw new Error('Career branch not found');
    }

    const roleExists = branch.roles.some(role => role.title === title);
    if (roleExists) {
        res.status(400);
        throw new Error('Role with this title already exists in this branch');
    }

    const newRole = {
        title,
        description,
        requirements: requirements || [],
        status: status || 'Open',
    };

    branch.roles.push(newRole);
    await branch.save();

    res.status(201).json(branch);
});

// @desc    Update an existing role within a branch
// @route   PUT /api/careers/admin/:branchId/role/:roleId
// @access  Private (Admin only)
const updateRoleInBranch = asyncHandler(async (req, res) => {
    const { branchId, roleId } = req.params;
    const { title, description, requirements, status } = req.body;

    const branch = await Career.findById(branchId);

    if (!branch) {
        res.status(404);
        throw new Error('Career branch not found');
    }

    const role = branch.roles.id(roleId);

    if (!role) {
        res.status(404);
        throw new Error('Role not found in this branch');
    }

    if (title !== undefined) role.title = title;
    if (description !== undefined) role.description = description;
    if (requirements !== undefined) role.requirements = requirements;
    if (status !== undefined) role.status = status;

    await branch.save();
    res.status(200).json(branch);
});

// @desc    Delete a role from a branch
// @route   DELETE /api/careers/admin/:branchId/role/:roleId
// @access  Private (Admin only)
const deleteRoleFromBranch = asyncHandler(async (req, res) => {
    const { branchId, roleId } = req.params;

    const branch = await Career.findById(branchId);

    if (!branch) {
        res.status(404);
        throw new Error('Career branch not found');
    }

    branch.roles.pull({ _id: roleId });
    await branch.save();

    res.status(200).json({ message: 'Role removed successfully', branch });
});

// @desc    Delete a career branch (and all its roles)
// @route   DELETE /api/careers/admin/branch/:branchId
// @access  Private (Admin only)
const deleteCareerBranch = asyncHandler(async (req, res) => {
    const { branchId } = req.params;

    const branch = await Career.findByIdAndDelete(branchId);

    if (!branch) {
        res.status(404);
        throw new Error('Career branch not found');
    }

    res.status(200).json({ message: 'Career branch deleted successfully' });
});


// IMPORTANT: Export all functions as NAMED EXPORTS for ES Modules
export {
    getAllAdminCareers,
    getOpenCareers,
    addCareerBranch, // <--- This function needs to be explicitly exported by name
    addRoleToBranch,
    updateRoleInBranch,
    deleteRoleFromBranch,
    deleteCareerBranch,
};