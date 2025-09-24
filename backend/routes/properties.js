const express = require('express');
const router = express.Router();
const {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    togglePropertyStatus,
    testToggleProperty,
    getFeaturedProperties,
    getPropertiesByOwner,
    getFilterOptions
} = require('../controllers/propertyController');
// const { protect, isAdmin } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

// Public routes
router.get('/', getProperties);
router.get('/filter-options', getFilterOptions);
router.get('/featured', getFeaturedProperties);
router.get('/owner/:ownerId', getPropertiesByOwner);
router.get('/:id', getProperty);

// Public routes (No authentication required)
router.post('/', uploadMultiple, createProperty);
router.put('/:id', uploadMultiple, updateProperty);
router.delete('/:id', deleteProperty);
router.get('/:id/test-toggle', testToggleProperty);
router.patch('/:id/toggle', togglePropertyStatus);

module.exports = router;
