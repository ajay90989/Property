const express = require('express');
const router = express.Router();
const {
    getAgents,
    getAgent,
    createAgent,
    updateAgent,
    deleteAgent,
    getFeaturedAgents,
    addTestimonial,
    getAgentStats
} = require('../controllers/agentController');
// Authentication middleware removed
const { uploadSingle, uploadMultiple, handleUploadError } = require('../middleware/upload');

// Public routes
router.get('/', getAgents);
router.get('/featured', getFeaturedAgents);
router.get('/:id', getAgent);
router.get('/:id/stats', getAgentStats);
router.post('/:id/testimonials', addTestimonial);

// Public routes (No authentication required)
router.post('/', uploadMultiple, createAgent);

router.put('/:id', uploadMultiple, updateAgent);

router.delete('/:id', deleteAgent);

module.exports = router;
