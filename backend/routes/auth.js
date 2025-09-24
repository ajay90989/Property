const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    updateProfile,
    changePassword
} = require('../controllers/authController');
// Authentication middleware removed

// Public routes
router.post('/register', register);
router.post('/login', login);

// Public routes (No authentication required)
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
