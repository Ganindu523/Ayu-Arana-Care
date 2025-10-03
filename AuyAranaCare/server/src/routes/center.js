import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import CenterInfo from '../models/CenterInfo.js';
import { admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads', 'centers');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// POST route is now protected and handles the description
router.post("/", admin, upload.single("image"), async (req, res) => {
    try {
        const { branchName, address, email, description } = req.body; // <-- ADD 'description'

        // Updated validation
        if (!branchName || !address || !email || !description || !req.file) {
            if (req.file) fs.unlinkSync(req.file.path); // Cleanup uploaded file if validation fails
            return res.status(400).json({ message: "All fields including image and description are required" });
        }

        const newCenter = new CenterInfo({
            branchName,
            address,
            email,
            description, // <-- ADD 'description'
            image: `centers/${req.file.filename}`,
        });

        await newCenter.save();
        res.status(201).json({ message: "Center added successfully" });
    } catch (err) {
        if (req.file) fs.unlinkSync(req.file.path); // Cleanup on error
        res.status(500).json({ message: "Error saving center information", error: err.message });
    }
});

// GET route remains the same
router.get("/", async (req, res) => {
    try {
        const centers = await CenterInfo.find();
        res.json(centers);
    } catch (err) {
        res.status(500).json({ message: "Error fetching center information" });
    }
});

export default router;


