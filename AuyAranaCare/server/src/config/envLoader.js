import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// This file's only job is to ensure that environment variables are loaded
// correctly and as early as possible in the application's lifecycle.

// Recreate __dirname for ES Modules to find the root of the 'server' project
const __filename = fileURLToPath(import.meta.url);        // Gets the path to this exact file
const __dirname = path.dirname(__filename);             // Gets the directory of this file (e.g., /src/config)
const serverProjectRoot = path.resolve(__dirname, '..', '..'); // Goes up two levels to the main 'server' folder

// Load the .env file located at the root of the 'server' project
dotenv.config({ path: path.join(serverProjectRoot, '.env') });
