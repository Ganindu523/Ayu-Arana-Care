// C:\Users\ASUS\Desktop\ayu arana care\test-app\test-app\test-app\server\src\routes\residentMedicalRoutes.js

import express from 'express';
import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer'; // Already here

// Import all necessary models
import CheckupType from '../models/CheckupType.js';
import MedicalRequest from '../models/MedicalRequest.js';
import MedicalStatus from '../models/MedicalStatus.js';
import User from '../models/User.js';
import Parent from '../models/Parent.js';

const router = express.Router();

// --- Configure Nodemailer Transporter (VERIFY YOUR .ENV SETTINGS) ---
const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail', 'outlook', 'sendgrid' etc.
    auth: {
        user: process.env.MAIL_USER, // Your email address
        pass: process.env.MAIL_PASS, // Your email password or App Password
    },
});

// --- CHECKUP TYPE ROUTES (No changes, copied for completeness) ---
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


// --- MEDICAL CHECKUP REQUEST ROUTES ---

// GET all medical requests for the Admin Panel (No changes, copied for completeness)
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

// GET medical requests by resident ID (for user's page) (No changes, copied for completeness)
router.get('/request/my/:residentId', asyncHandler(async (req, res) => {
    const { residentId } = req.params;
    const requests = await MedicalRequest.find({ resident: residentId })
        .populate('checkupType', 'name price')
        .populate('resident', 'fullName')
        .populate('requestedBy', 'fullName email')
        .sort({ createdAt: -1 });
    res.json(requests);
}));


// POST a new medical checkup request (No changes, copied for completeness)
router.post('/request', asyncHandler(async (req, res) => {
    const { residentId, requestedById, checkupTypeId, notes } = req.body;

    if (!residentId || !requestedById || !checkupTypeId) {
        res.status(400);
        throw new Error('Resident, requester, and checkup type are required.');
    }

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
        status: 'Pending',
        paymentStatus: 'Unpaid'
    });

    res.status(201).json(newRequest);
}));

// PUT (update) status of a medical request (Approve/Reject)
router.put('/request/:id/status', asyncHandler(async (req, res) => {
    const { status } = req.body;
    // Populate requestedBy, checkupType, and resident for email content
    const request = await MedicalRequest.findById(req.params.id)
                                        .populate('requestedBy', 'fullName email') // Need email for sending
                                        .populate('checkupType', 'name price')
                                        .populate('resident', 'fullName'); // Need resident fullName for email content

    if (!request) {
        res.status(404); throw new Error('Medical request not found.');
    }

    // Only update if status is valid
    if (!['Processing', 'Rejected', 'Completed'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status provided.');
    }

    request.status = status;
    const updatedRequest = await request.save();

    const emailSubject = `Update on Your Medical Checkup Request: ${request.checkupType.name}`;
    let emailBody = '';

    if (status === 'Processing') {
        emailBody = `<p>Dear ${request.requestedBy.fullName},</p>
                     <p>Your request for the "<strong>${request.checkupType.name}</strong>" checkup for <strong>${request.resident.fullName}</strong> has been <strong>APPROVED</strong> and is now being processed.</p>
                     <p>Further updates, including report availability and payment instructions, will be sent to you shortly.</p>`;
    } else if (status === 'Rejected') {
        emailBody = `<p>Dear ${request.requestedBy.fullName},</p>
                     <p>Your request for the "<strong>${request.checkupType.name}</strong>" checkup for <strong>${request.resident.fullName}</strong> has been <strong>REJECTED</strong>.</p>
                     <p>Reason: can't contact doctors </p>
                     <p>Please contact administration for more details.</p>`;
    } else if (status === 'Completed' && request.reportFile) {
        // If status is set to 'Completed' here, and a report exists, this is redundant with upload-report route
        // This case is primarily for 'Approve/Reject' action.
        // The upload-report route also sets to 'Completed' and sends email.
        // Consider removing this `else if` for 'Completed' here to avoid duplicate emails.
        emailBody = `<p>Dear ${request.requestedBy.fullName},</p>
                     <p>The status of your "<strong>${request.checkupType.name}</strong>" checkup for <strong>${request.resident.fullName}</strong> has been updated to <strong>COMPLETED</strong>.</p>
                     <p>Please check your medical portal for the report.</p>`;
    }

    if (emailBody && request.requestedBy.email) {
        try {
            await transporter.sendMail({
                from: `"Ayu Arana Care" <${process.env.MAIL_USER}>`,
                to: request.requestedBy.email,
                subject: emailSubject,
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${emailBody}<br><p>Thank you,<br>The Ayu Arana Care Team</p></div>`
            });
            console.log(`Email sent for request ${request._id} status update to ${status}.`);
        } catch (e) {
            console.error(`Failed to send status update email for request ${request._id}:`, e);
            // Optionally, you might want to return a 200 OK but add a message that email sending failed.
            // For now, it will just log the error and continue.
        }
    }
    res.json(updatedRequest);
}));

// PUT (update) payment status of a medical request
router.put('/request/:id/paymentStatus', asyncHandler(async (req, res) => {
    const { paymentStatus } = req.body;
    // Populate requestedBy for email sending
    const request = await MedicalRequest.findById(req.params.id)
                                        .populate('requestedBy', 'fullName email')
                                        .populate('checkupType', 'name price'); // For email content

    if (!request) {
        res.status(404); throw new Error('Request not found');
    }

    // Only allow specific payment status updates
    if (!['Paid', 'Unpaid'].includes(paymentStatus)) {
        res.status(400);
        throw new Error('Invalid payment status provided.');
    }

    request.paymentStatus = paymentStatus;
    const updatedRequest = await request.save();

    // Send email only if status is marked Paid here
    if (paymentStatus === 'Paid' && request.requestedBy.email) {
        const emailSubject = `Payment Confirmation for Your Medical Checkup: ${request.checkupType.name}`;
        const emailBody = `<p>Dear ${request.requestedBy.fullName},</p>
                           <p>This is to confirm that your payment for the "<strong>${request.checkupType.name}</strong>" checkup has been successfully processed.</p>
                           <p>Thank you for your timely payment.</p>`;
        try {
            await transporter.sendMail({
                from: `"Ayu Arana Care" <${process.env.MAIL_USER}>`,
                to: request.requestedBy.email,
                subject: emailSubject,
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${emailBody}<br><p>Best regards,<br>The Ayu Arana Care Team</p></div>`
            });
            console.log(`Email sent for payment confirmation for request ${request._id}.`);
        } catch (e) {
            console.error(`Failed to send payment confirmation email for request ${request._id}:`, e);
        }
    }
    res.json(updatedRequest);
}));


// PUT (upload) report file for a medical request
router.put('/request/:id/upload-report', asyncHandler(async (req, res) => {
    const { reportFileUrl } = req.body;
    const request = await MedicalRequest.findById(req.params.id)
                                        .populate('requestedBy', 'fullName email') // For email sending
                                        .populate('checkupType', 'name')
                                        .populate('resident', 'fullName'); // For email content

    if (!request) {
        res.status(404); throw new Error('Medical request not found.');
    }

    request.reportFile = reportFileUrl;
    request.status = 'Completed'; // Automatically set to completed
    const updatedRequest = await request.save();

    // Send email notifying report is ready
    if (request.requestedBy.email && reportFileUrl) { // Only send if email exists and report URL is provided
        try {
            await transporter.sendMail({
                from: `"Ayu Arana Care" <${process.env.MAIL_USER}>`,
                to: request.requestedBy.email,
                subject: `Your Medical Report for "${request.checkupType.name}" is Ready`,
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                           <p>Dear ${request.requestedBy.fullName},</p>
                           <p>The medical report for the "<strong>${request.checkupType.name}</strong>" checkup for <strong>${request.resident.fullName}</strong> is now available.</p>
                           <p>You can view it here: <a href="${reportFileUrl}" style="color: #1a73e8; text-decoration: none;">View Report</a></p>
                           <p>Please log in to your portal to access the full details.</p>
                       </div>`
            });
            console.log(`Email sent for report upload for request ${request._id}.`);
        } catch (e) {
            console.error(`Failed to send report email for request ${request._id}:`, e);
        }
    }
    res.json(updatedRequest);
}));

// POST to send a payment reminder
router.post('/request/:id/remind', asyncHandler(async (req, res) => {
    // Populate requestedBy for email sending
    const request = await MedicalRequest.findById(req.params.id)
                                        .populate('requestedBy', 'fullName email')
                                        .populate('checkupType', 'name price'); // For email content

    if (request && request.paymentStatus === 'Unpaid' && request.requestedBy.email) { // Only send if request exists, unpaid, and email is available
        try {
            await transporter.sendMail({
                from: `"Ayu Arana Care" <${process.env.MAIL_USER}>`,
                to: request.requestedBy.email,
                subject: `Gentle Reminder: Payment Pending for Medical Checkup (${request.checkupType.name})`,
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                           <p>Dear ${request.requestedBy.fullName},</p>
                           <p>This is a gentle reminder that the payment of <strong>${request.checkupType.price} LKR</strong> for the "<strong>${request.checkupType.name}</strong>" checkup is still pending.</p>
                           <p>Please make the payment at your earliest convenience to avoid any delays in processing your request or accessing your report.</p>
                           <p>Thank you for your cooperation.</p>
                       </div>`
            });
            console.log(`Payment reminder email sent for request ${request._id}.`);
            res.json({ message: 'Reminder sent successfully.' });
        } catch (e) {
            console.error(`Failed to send reminder email for request ${request._id}:`, e);
            res.status(500).json({ message: 'Failed to send email.' });
        }
    } else {
        res.status(404).json({ message: 'Request not found, already paid, or no email to send reminder.' });
    }
}));


// --- RESIDENT-SPECIFIC MEDICAL STATUS/RECORD ROUTES (No changes, copied for completeness) ---

// @desc    Get all medical statuses/records for all residents (for admin dropdown)
// @route   GET /api/medical/resident-statuses/all
// @access  Admin
router.get('/resident-statuses/all', asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'user' }) // Filter by 'user' role
                            .select('fullName parent')
                            .populate('parent', 'parentId');

    const existingStatuses = await MedicalStatus.find({})
        .populate('resident', 'fullName email')
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

    try {
        const newMedicalStatus = await MedicalStatus.create({
            resident: residentId,
            subject,
            notes,
            statusLevel
        });
        res.status(201).json(newMedicalStatus);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400);
            throw new Error(error.message);
        }
        res.status(500);
        throw new Error('Failed to create medical status record.');
    }
}));

// @desc    Update an existing medical status/record
// @route   PUT /api/medical/resident-statuses/:id
// @access  Admin
router.put('/resident-statuses/:id', asyncHandler(async (req, res) => {
    const { subject, notes, statusLevel } = req.body;

    if (!subject || !notes || !statusLevel) {
        res.status(400);
        throw new Error('Subject, notes, and status level are required for updating.');
    }

    try {
        const medicalStatus = await MedicalStatus.findById(req.params.id);

        if (!medicalStatus) {
            res.status(404);
            throw new Error('Medical status/record not found');
        }

        medicalStatus.subject = subject;
        medicalStatus.notes = notes;
        medicalStatus.statusLevel = statusLevel;

        const updatedMedicalStatus = await medicalStatus.save();
        res.json(updatedMedicalStatus);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400);
            throw new Error(error.message);
        }
        res.status(500);
        throw new Error('Failed to update medical status record.');
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