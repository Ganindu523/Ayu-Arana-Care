// C:\Users\ASUS\Desktop\ayu arana care\test-app\test-app\test-app\server\src\server.js

// --- THIS MUST BE THE VERY FIRST IMPORT ---
// This file loads all environment variables from your .env file
// before any other part of the application runs.
import './config/envLoader.js'; // Assuming this correctly loads process.env variables

// Now, we can safely import everything else
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";
// import fileUpload from "express-fileupload"; // <--- REMOVED: Conflicts with Multer

// Middleware imports (relative to server.js in src folder)
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports (relative to server.js in src folder)
import careerRoutes from './routes/careerRoutes.js';
import centerRoutes from "./routes/center.js";
import contactRoutes from "./routes/contact.js";
import residentMedicalRoutes from './routes/residentMedicalRoutes.js'; // Corrected import
import medicalAnnouncementsRoutes from './routes/medicalAnnouncementsRoutes.js'; // NEW import
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import parentRoutes from './routes/parentRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- CORS Configuration ---
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Added PATCH for completeness
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data
// app.use(fileUpload()); // <--- REMOVED: This causes conflict with Multer in center.js


// --- API Routes Setup ---
// Use the specific admin routes for the /api/admin path
app.use('/api/admin', adminAuthRoutes);

// Use the general user auth routes for the /api/auth path
app.use('/api/auth', authRoutes);

// Use the other routes for their specific paths
app.use('/api/careers', careerRoutes);

// app.use("/api/center", centerRoutes); // <--- REMOVED DUPLICATE
app.use("/api/contact", contactRoutes);
app.use("/api/center", centerRoutes); // <--- Kept one instance, as per your desired mounting point

// Corrected: Use residentMedicalRoutes for the main /api/medical base path
app.use('/api/medical', residentMedicalRoutes);

// NEW: Use medicalAnnouncementsRoutes for the specific /api/medical/status-updates path
app.use('/api/medical/status-updates', medicalAnnouncementsRoutes);

app.use('/api/parents', parentRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);


// --- File System and Static Folders ---
// Corrected uploadDir path calculation
// __dirname: C:\Users\ASUS\Desktop\ayu arana care\test-app\test-app\test-app\server\src
// To reach project root (test-app/test-app/test-app): go up 2 levels (src -> server -> test-app)
const projectRootForUploads = path.resolve(__dirname, '..', '..');
const uploadDir = path.join(projectRootForUploads, "uploads"); // This will be .../test-app/test-app/test-app/uploads

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created uploads directory at: ${uploadDir}`);
}
app.use("/uploads", express.static(uploadDir));


// --- Root route for testing ---
app.get("/", (req, res) => {
    res.send("Ayu Arana Care backend server is alive and running!");
});


// --- Custom Error Handling Middleware ---
// This must be after all the API routes
app.use(notFound);
app.use(errorHandler);


// --- MongoDB connection ---
const MONGO_URI = process.env.MONGO_URI; // Value should be loaded by envLoader.js
if (!MONGO_URI) {
    console.error("❌ MONGO_URI not found in .env file. Please check your configuration.");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully.");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });