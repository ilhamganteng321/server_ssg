// src/app.js
import express from 'express';
import userRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import quranRoutes from './routes/quran.route.js';

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

export default app;
