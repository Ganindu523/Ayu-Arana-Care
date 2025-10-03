// C:\Users\ASUS\Desktop\ayu arana care\test-app\test-app\test-app\server\src\routes\medicalRoutes.js

import express from 'express';
import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';

// Import all necessary models
import CheckupType from '../models/CheckupType.js';
import MedicalRequest from '../models/MedicalRequest.js';
import MedicalStatus from '../models/MedicalStatus.js'; // This is YOUR existing model for resident-specific status
import MedicalStatusUpdate from '../models/MedicalStatusUpdate.js'; // Model for general announcements (if not using separate routes file for it)
import User from '../models/User.js'; // Assuming User is the resident/requestedBy
import Parent from '../models/Parent.js'; // For parent ID lookup

const router = express.Router();

// --- Configure Nodemailer Transporter ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// --- CHECKUP TYPE ROUTES (KEEP AS IS) ---
router.get('/types', asyncHandler(async (req, res) => {
    const types = await CheckupType.find({}).sort({ createdAt: -1 });
    res.json(types);
}));

router.post('/types', asyncHandler(async (req, res) => {
    const { name, price } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ message: 'Name and price are required.' });
    }
    const newType = await CheckupType.create({ name, price });
    res.status(201).json(newType);
}));

router.put('/types/:id', asyncHandler(async (req, res) => {
    const type = await CheckupType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!type) {
        res.status(404); throw new Error('Checkup Type not found');
    }
    res.json(type);
}));

router.delete('/types/:id', asyncHandler(async (req, res) => {
    const type = await CheckupType.findByIdAndDelete(req.params.id);
    if (!type) {
        res.status(404); throw new Error('Checkup Type not found');
    }
    res.json({ message: 'Checkup Type removed' });
}));


// --- MEDICAL CHECKUP REQUEST ROUTES (KEEP AS IS) ---

// GET all medical requests for the Admin Panel
router.get('/request/all', asyncHandler(async (req, res) => {
    const requests = await MedicalRequest.find({})
        .populate({
            path: 'resident',
            select: 'fullName parent',
            populate: {
                path: 'parent',
                select: 'parentId'
            }
        })
        .populate('requestedBy', 'fullName email')
        .populate('checkupType', 'name price');
    res.json(requests);
}));

// GET medical requests by resident ID (for user's page)
router.get('/request/my/:residentId', asyncHandler(async (req, res) => {
    const { residentId } = req.params;
    const requests = await MedicalRequest.find({ resident: residentId })
        .populate('checkupType', 'name price')
        .populate('resident', 'fullName')
        .populate('requestedBy', 'fullName email')
        .sort({ createdAt: -1 }); // Latest first
    res.json(requests);
}));


// POST a new medical checkup request
router.post('/request', asyncHandler(async (req, res) => {
    const { residentId, requestedById, checkupTypeId, notes } = req.body;

    if (!residentId || !requestedById || !checkupTypeId) {
        res.status(400);
        throw new Error('Resident, requester, and checkup type are required.');
    }

    // Verify resident and requester exist
    const resident = await User.findById(residentId);
    const requester = await User.findById(requestedById);
    const checkupType = await CheckupType.findById(checkupTypeId);

    if (!resident || !requester || !checkupType) {
        res.status(404);
        throw new Error('Resident, requester, or checkup type not found.');
    }

    const newRequest = await MedicalRequest.create({
        resident: residentId,
        requestedBy: requestedById,
        checkupType: checkupTypeId,
        notes,
        status: 'Pending', // Default status
        paymentStatus: 'Unpaid' // Default payment status
    });

    res.status(201).json(newRequest);
}));

// PUT (update) status of a medical request (Approve/Reject/Processing/Completed)
router.put('/request/:id/status', asyncHandler(async (req, res) => {
    const { status } = req.body;
    const request = await MedicalRequest.findById(req.params.id).populate('requestedBy checkupType resident');

    if (!request) {
        res.status(404); throw new Error('Medical request not found.');
    }

    request.status = status;
    const updatedRequest = await request.save();

    const emailSubject = `Update on Your Medical Request: ${request.checkupType.name}`;
    let emailBody = '';

    if (status === 'Processing') {
        emailBody = `<p>Dear ${request.requestedBy.fullName},</p><p>Your request for the "<strong>${request.checkupType.name}</strong>" checkup for <strong>${request.resident.fullName}</strong> has been <strong>approved</strong> and is now being processed.</p>`;
    } else if (status === 'Rejected') {
        emailBody = `<p>Dear ${request.requestedBy.fullName},</p><p>Your request for the "<strong>${request.checkupType.name}</strong>" checkup for <strong>${request.resident.fullName}</strong> has been <strong>rejected</strong>.</p><p>Please contact administration for more details.</p>`;
    }

    if (emailBody) {
        try {
            await transporter.sendMail({
                from: `"Ayu Arana Care" <${process.env.MAIL_USER}>`, to: request.requestedBy.email, subject: emailSubject,
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${emailBody}<br><p>Thank you,<br>The Ayu Arana Care Team</p></div>`
            });
        } catch (e) { console.error(`Failed to send status email:`, e); }
    }
    res.json(updatedRequest);
}));

// PUT (update) payment status of a medical request
router.put('/request/:id/paymentStatus', asyncHandler(async (req, res) => {
    const { paymentStatus } = req.body;
    const request = await MedicalRequest.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true });
    if (!request) {
        res.status(404); throw new Error('Request not found');
    }
    res.json(request);
}));

// PUT (upload) report file for a medical request (also sets status to 'Completed')
router.put('/request/:id/upload-report', asyncHandler(async (req, res) => {
    const { reportFileUrl } = req.body;
    const request = await MedicalRequest.findById(req.params.id).populate('requestedBy checkupType resident');

    if (!request) {
        res.status(404); throw new Error('Medical request not found.');
    }

    request.reportFile = reportFileUrl;
    request.status = 'Completed'; // Automatically set to completed
    const updatedRequest = await request.save();

      try {
        await transporter.sendMail({
            from: `"Ayu Arana Care" <${process.env.MAIL_USER}>`, to: request.requestedBy.email,
            subject: `Your Medical Report for "${request.checkupType.name}" is Ready`,
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><p>Dear ${request.requestedBy.fullName},</p><p>The medical report for the "<strong>${request.checkupType.name}</strong>" checkup for <strong>${request.resident.fullName}</strong> is now available. You can view it here: <a href="${reportFileUrl}">View Report</a></p><br><p>Thank you,<br>The Ayu Arana Care Team</p></div>`
        });
    } catch (e) { console.error(`Failed to send report email:`, e); }

    res.json(updatedRequest);
}));

// POST to send a payment reminder
router.post('/request/:id/remind', asyncHandler(async (req, res) => {
    const request = await MedicalRequest.findById(req.params.id).populate('requestedBy checkupType');
    if (request && request.paymentStatus === 'Unpaid') {
          try {
            await transporter.sendMail({
                from: `"Ayu Arana Care" <${process.env.MAIL_USER}>`, to: request.requestedBy.email,
                subject: `Payment Reminder for ${request.checkupType.name}`,
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><p>Dear ${request.requestedBy.fullName},</p><p>This is a reminder that the payment of <strong>${request.checkupType.price} LKR</strong> for the "<strong>${request.checkupType.name}</strong>" checkup is pending. Please make the payment at your earliest convenience.</p><br><p>Thank you,<br>The Ayu Arana Care Team</p></div>`
            });
            res.json({ message: 'Reminder sent successfully.' });
        } catch (e) {
            console.error(`Failed to send reminder email:`, e);
            res.status(500).json({ message: 'Failed to send email.' });
        }
    } else {
        res.status(404).json({ message: 'Request not found or already paid.' });
    }
}));


// --- RESIDENT-SPECIFIC MEDICAL STATUS/RECORD ROUTES (NOW PART OF medicalRoutes.js) ---

// @desc    Get all medical statuses/records for all residents (for admin dropdown)
// @route   GET /api/medical/resident-statuses/all
// @access  Admin
router.get('/resident-statuses/all', asyncHandler(async (req, res) => {
    // We want to get all existing MedicalStatus records,
    // and also allow creating new ones for any User with role 'resident'.
    const users = await User.find({ role: 'resident' }).select('fullName parent'); // Assuming 'resident' role and Parent ref

    // To show existing statuses linked to residents:
    const existingStatuses = await MedicalStatus.find({})
        .populate('resident', 'fullName email') // Populate resident details
        .sort({ updatedAt: -1 });

    res.json({ users, existingStatuses });
}));


// @desc    Get medical statuses/records for a specific resident
// @route   GET /api/medical/resident-statuses/:residentId
// @access  Private (Resident/Admin)
router.get('/resident-statuses/:residentId', asyncHandler(async (req, res) => {
    const statuses = await MedicalStatus.find({ resident: req.params.residentId })
        .populate('resident', 'fullName')
        .sort({ createdAt: -1 });
    res.json(statuses);
}));

// @desc    Create a new medical status/record for a resident
// @route   POST /api/medical/resident-statuses
// @access  Admin
router.post('/resident-statuses', asyncHandler(async (req, res) => {
    const { residentId, subject, notes, statusLevel } = req.body;

    if (!residentId || !subject || !notes || !statusLevel) {
        res.status(400);
        throw new Error('Resident ID, subject, notes, and status level are required.');
    }

    const resident = await User.findById(residentId);
    if (!resident) {
        res.status(404);
        throw new Error('Resident not found.');
    }

    const newMedicalStatus = await MedicalStatus.create({
        resident: residentId,
        subject,
        notes,
        statusLevel
    });
    res.status(201).json(newMedicalStatus);
}));

// @desc    Update an existing medical status/record
// @route   PUT /api/medical/resident-statuses/:id
// @access  Admin
router.put('/resident-statuses/:id', asyncHandler(async (req, res) => {
    const { subject, notes, statusLevel } = req.body;

    const medicalStatus = await MedicalStatus.findById(req.params.id);

    if (medicalStatus) {
        medicalStatus.subject = subject || medicalStatus.subject;
        medicalStatus.notes = notes || medicalStatus.notes;
        medicalStatus.statusLevel = statusLevel || medicalStatus.statusLevel;

        const updatedMedicalStatus = await medicalStatus.save();
        res.json(updatedMedicalStatus);
    } else {
        res.status(404);
        throw new Error('Medical status/record not found');
    }
}));

// @desc    Delete a medical status/record
// @route   DELETE /api/medical/resident-statuses/:id
// @access  Admin
router.delete('/resident-statuses/:id', asyncHandler(async (req, res) => {
    const medicalStatus = await MedicalStatus.findByIdAndDelete(req.params.id);

    if (medicalStatus) {
        res.json({ message: 'Medical status/record removed' });
    } else {
        res.status(404);
        throw new Error('Medical status/record not found');
    }
}));

export default router;