import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Database file path
const dbPath = path.join(dataDir, 'payroll.db');

// Initialize database connection
async function initializeDatabase() {
    try {
        // Open database connection
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        
        console.log('SQLite database connected successfully');
        
        // Enable foreign keys
        await db.exec('PRAGMA foreign_keys = ON');
        
        return db;
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
}

// Create a singleton database connection
let dbInstance = null;

async function getDatabase() {
    if (!dbInstance) {
        dbInstance = await initializeDatabase();
    }
    return dbInstance;
}

export default getDatabase;