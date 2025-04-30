const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const dotenv = require('dotenv');

dotenv.config();

// Konfigurasi koneksi MariaDB
const mariaDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345678',
  database: process.env.DB_NAME || 'db_cms',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0

};

// Membuat pool koneksi
const pool = mysql.createPool(mariaDbConfig);

// Membuka koneksi ke database MariaDB
 const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    // console.log('Database connected');
    return connection;
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  } finally {
    // Jangan lupa untuk melepaskan koneksi ketika selesai menggunakannya
    // Ini harus dilakukan di tempat di mana Anda menggunakan koneksi
  }
};

// getConnection();
 const dbPromise = async () =>{
  try {
    const db = await open({
      filename: './src/database/kodepos.db',
      driver:sqlite3.Database
    })
    // console.log('Database connected');
    return db;
  } catch (error) {
    console.error('Database connection error:', err);
    throw error;
  }
}

 module.exports = {
  getConnection,
  dbPromise
 };
