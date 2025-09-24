const Blog = require('../models/Blog');
const User = require('../models/User');

// @desc    Get all blogs with filtering and pagination
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            status,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            featured,
            isActive
        } = req.query;

        // Build filter object
        const filter = {};

        // Handle status filter - if not provided, show all for admin
        if (status && status !== 'undefined') {
            filter.status = status;
        }

        // Handle isActive parameter for admin
        if (isActive !== undefined && isActive !== 'undefined') {
            filter.isActive = isActive === 'true' || isActive === true;
        }

        if (category && category !== 'undefined') filter.category = category;
        if (featured === 'true') filter.isFeatured = true;

        // Text search - use regex instead of $text for better compatibility
        if (search && search !== 'undefined') {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const blogs = await Blog.find(filter)
            .populate('author', 'name email')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count for pagination
        const total = await Blog.countDocuments(filter);

        res.json({
            success: true,
            count: blogs.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: blogs
        });
    } catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching blogs'
        });
    }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' })
            .populate('author', 'name email');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        // Increment view count
        blog.views += 1;
        await blog.save();

        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Get blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching blog'
        });
    }
};

// @desc    Get single blog by ID (for admin)
// @route   GET /api/blogs/admin/:id
// @access  Private (Admin)
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name email');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Get blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching blog'
        });
    }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private (Admin)
const createBlog = async (req, res) => {
    try {
        console.log('Create blog request received:', {
            body: req.body,
            file: req.file,
            user: req.user
        });

        // Validate required fields
        if (!req.body.title) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        if (!req.body.content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        // Use default author ID if no user is authenticated
        const authorId = req.user?.id || '507f1f77bcf86cd799439011'; // Default ObjectId

        // Generate slug from title
        const baseSlug = req.body.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
        const slug = baseSlug + '-' + Date.now();

        const blogData = {
            ...req.body,
            author: authorId,
            slug: slug,
            // Set default values for required fields
            excerpt: req.body.content ? req.body.content.substring(0, 200) + '...' : 'Blog excerpt',
            category: req.body.category || 'tips',
            status: req.body.status || 'published',
            isActive: true
        };

        console.log('Blog data prepared:', blogData);

        // Handle featured image if uploaded
        if (req.file) {
            console.log('Featured image uploaded:', req.file);
            blogData.featuredImage = {
                url: `/uploads/${req.file.filename}`,
                alt: req.body.imageAlt || 'Blog featured image'
            };
        }

        // Set published date if status is published
        if (blogData.status === 'published' && !blogData.publishedAt) {
            blogData.publishedAt = new Date();
        }

        console.log('Final blog data before creation:', blogData);

        const blog = await Blog.create(blogData);
        console.log('Blog created successfully:', blog);

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: blog
        });
    } catch (error) {
        console.error('Create blog error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Server error while creating blog',
            error: error.message
        });
    }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (Admin)
const updateBlog = async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Handle new featured image if uploaded
        if (req.file) {
            blog.featuredImage = {
                url: `/uploads/${req.file.filename}`,
                alt: req.body.imageAlt || 'Blog featured image'
            };
        }

        // Set published date if status is being changed to published
        if (req.body.status === 'published' && blog.status !== 'published') {
            req.body.publishedAt = new Date();
        }

        // Update blog data
        blog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('author', 'name email');

        res.json({
            success: true,
            message: 'Blog updated successfully',
            data: blog
        });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating blog'
        });
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (Admin)
const deleteBlog = async (req, res) => {
    try {
        console.log('Delete blog request:', {
            id: req.params.id,
            user: req.user
        });

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            console.log('Blog not found for ID:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        console.log('Blog found for deletion:', {
            id: blog._id,
            title: blog.title
        });

        // Hard delete - permanently remove from database
        await Blog.findByIdAndDelete(req.params.id);
        console.log('Blog permanently deleted:', req.params.id);

        res.json({
            success: true,
            message: 'Blog deleted permanently'
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting blog'
        });
    }
};

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
// @access  Public
const getFeaturedBlogs = async (req, res) => {
    try {
        const { limit = 3 } = req.query;

        const blogs = await Blog.find({
            status: 'published',
            isFeatured: true
        })
            .populate('author', 'name email')
            .select('-content')
            .sort({ publishedAt: -1 })
            .limit(parseInt(limit))
            .lean();

        res.json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        console.error('Get featured blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching featured blogs'
        });
    }
};

// @desc    Toggle blog active status
// @route   PATCH /api/blogs/:id/toggle
// @access  Private (Admin)
const toggleBlogStatus = async (req, res) => {
    try {
        console.log('Toggle blog status request:', {
            id: req.params.id,
            user: req.user,
            headers: req.headers
        });

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            console.log('Blog not found for ID:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        console.log('Blog found:', {
            id: blog._id,
            title: blog.title,
            currentStatus: blog.isActive
        });

        blog.isActive = !blog.isActive;
        await blog.save();

        console.log('Blog status toggled:', {
            id: blog._id,
            newStatus: blog.isActive
        });

        res.json({
            success: true,
            message: `Blog ${blog.isActive ? 'activated' : 'deactivated'} successfully`,
            data: {
                id: blog._id,
                isActive: blog.isActive
            }
        });
    } catch (error) {
        console.error('Toggle blog status error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Server error while toggling blog status',
            error: error.message
        });
    }
};

// @desc    Get blog categories
// @route   GET /api/blogs/categories
// @access  Public
const getBlogCategories = async (req, res) => {
    try {
        const categories = await Blog.distinct('category', { status: 'published' });

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Get blog categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching blog categories'
        });
    }
};

module.exports = {
    getBlogs,
    getBlogBySlug,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    toggleBlogStatus,
    getFeaturedBlogs,
    getBlogCategories
};
