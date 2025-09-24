const express = require('express');
const router = express.Router();
const {
    getBlogs,
    getBlogBySlug,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    toggleBlogStatus,
    getFeaturedBlogs,
    getBlogCategories
} = require('../controllers/blogController');
// Authentication middleware removed
const { uploadSingle, handleUploadError } = require('../middleware/upload');

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/categories', getBlogCategories);

// Test route for debugging
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Blog routes working' });
});

// Public routes - must come before /:slug to avoid conflicts
router.get('/admin/:id', (req, res, next) => {
  
    next();
}, getBlogById);

// Public routes (must come after admin routes)
router.get('/:slug', (req, res, next) => {
   
    next();
}, getBlogBySlug);
router.post('/', uploadSingle, handleUploadError, createBlog);
router.put('/:id', (req, res, next) => {
    next();
}, uploadSingle, handleUploadError, updateBlog);
router.delete('/:id', deleteBlog);
router.patch('/:id/toggle', toggleBlogStatus);

module.exports = router;
