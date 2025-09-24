const express = require('express');
const router = express.Router();
const {
    submitContact,
    getContacts,
    getContact,
    updateContactStatus,
    respondToContact,
    getContactStats
} = require('../controllers/contactController');
// Authentication middleware removed

// Public routes
router.post('/', submitContact);

// Public routes (No authentication required)
router.get('/', getContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContact);
router.put('/:id/status', updateContactStatus);
router.post('/:id/respond', respondToContact);

module.exports = router;
