// src/utils/db.js
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');


// Create a database connection
const createDbConnection = async () => {
   try {
     const db = await open({
          filename: './src/database/quran.db',
          driver:sqlite3.Database
        })
        // console.log('Database quran connected');
        return db;
   } catch (error) {
    console.error('Database connection error:', err);
    throw error;
   }
};

createDbConnection();

module.exports = createDbConnection;
