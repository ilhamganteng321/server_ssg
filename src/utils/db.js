// src/utils/db.js
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Create a database connection
const createDbConnection = () => {
    // List of possible database paths to try
    const possiblePaths = [
        // Path from environment variable (if set)
        process.env.QURAN_DB_PATH,

        // Common paths relative to current directory
        path.join(process.cwd(), 'database', 'quran.db'),
        path.join(process.cwd(), 'src', 'database', 'quran.db'),
        path.join(process.cwd(), 'data', 'quran.db'),

        // Common paths relative to file location
        path.join(__dirname, '../../database/quran.db'),
        path.join(__dirname, '../../../database/quran.db'),
        path.join(__dirname, '../../data/quran.db'),

        // Common absolute paths
        'D:\\PKL\\server\\src\\database\\quran.db',
        'D:\\PKL\\server\\database\\quran.db',
        'D:\\PKL\\database\\quran.db'
    ].filter(Boolean); // Remove undefined entries (in case env var isn't set)

    // Find first existing database file
    let dbPath = null;
    for (const potentialPath of possiblePaths) {
        try {
            if (fs.existsSync(potentialPath)) {
                dbPath = potentialPath;
                console.log(`Found database at: ${dbPath}`);
                break;
            }
        } catch (e) {
            // Ignore errors checking file existence
        }
    }

    if (!dbPath) {
        console.error('Could not find quran.db file. Searched in:');
        possiblePaths.forEach(path => console.error(`- ${path}`));
        throw new Error('Database file not found. Please check the paths above and ensure quran.db exists.');
    }

    try {
        const db = new Database(dbPath, {
            readonly: true,
            fileMustExist: true
        });

        // Test the connection
        try {
            const statement = db.prepare("SELECT COUNT(*) as count FROM m_quran_t");
            const result = statement.get();
            console.log(`Successfully connected to database. Found ${result.count} surahs.`);
        } catch (error) {
            console.error('Database exists but query failed:', error.message);
            console.log('This might indicate the database structure is different than expected.');

            // Try to get the list of tables to help with debugging
            try {
                const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
                console.log('Available tables:', tables.map(t => t.name));
            } catch (e) {
                console.error('Could not query table list:', e.message);
            }
        }

        return db;
    } catch (error) {
        console.error(`Error connecting to database at ${dbPath}:`, error.message);
        throw new Error(`Failed to connect to the database at ${dbPath}. Error: ${error.message}`);
    }
};

export default createDbConnection;