import express from 'express';
import { activateUser, getUserStatusFlagOne, getUserStatusFlagUsers } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/activate', activateUser);
router.get('/flag-users', getUserStatusFlagUsers);
router.get('/get-user-status-flag', getUserStatusFlagOne);
export default router;