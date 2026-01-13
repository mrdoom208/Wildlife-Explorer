const express = require('express');
const { login, createAdmin } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/admin/register', createAdmin); // One-time use

module.exports = router;
