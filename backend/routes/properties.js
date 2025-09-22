const express = require('express');
const router = express.Router();
const {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    togglePropertyStatus,
    getFeaturedProperties,
    getPropertiesByOwner
} = require('../controllers/propertyController');
const { protect, isAdmin } = require('../middleware/auth');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/owner/:ownerId', getPropertiesByOwner);
router.get('/:id', getProperty);

// Protected routes (Admin only)
router.post('/', protect, isAdmin, uploadMultiple, handleUploadError, createProperty);
router.put('/:id', protect, isAdmin, uploadMultiple, handleUploadError, updateProperty);
router.delete('/:id', protect, isAdmin, deleteProperty);
router.patch('/:id/toggle', protect, isAdmin, togglePropertyStatus);

module.exports = router;
