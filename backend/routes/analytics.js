const express = require('express');
const router = express.Router();
const {
    trackEvent,
    getDashboardAnalytics,
    getPropertyAnalytics,
    getUserAnalytics
} = require('../controllers/analyticsController');
// Authentication middleware removed

// Public routes
router.post('/track', trackEvent);

// Public routes (No authentication required)
router.get('/dashboard', getDashboardAnalytics);
router.get('/properties', getPropertyAnalytics);
router.get('/users', getUserAnalytics);

module.exports = router;
