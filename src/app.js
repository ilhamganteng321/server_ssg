// src/app.js
const express = require('express');
const userRoutes = require('./routes/user.route.js');
const adminRoutes = require('./routes/admin.route.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const quranRoutes = require('./routes/quran.route.js');

// import upload from '../dummy.js';

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // izinkan frontend kamu
    credentials: true // jika kamu pakai cookie atau session
  }));
// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quran', quranRoutes);
// app.use('/api/user', upload);

module.exports = app;
