const express = require('express');
const { activateUser, getUserStatusFlagOne, getUserStatusFlagUsers } = require('../controllers/admin.controller.js');


const router = express.Router();

router.post('/activate', activateUser);
router.get('/flag-users', getUserStatusFlagUsers);
router.get('/get-user-status-flag', getUserStatusFlagOne);
module.exports = router;