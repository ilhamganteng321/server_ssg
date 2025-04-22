import express from 'express';
import { activateUser } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/activate', activateUser);

export default router;