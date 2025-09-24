const Agent = require('../models/Agent');
const User = require('../models/User');
const Property = require('../models/Property');

// @desc    Get all agents with filtering and pagination
// @route   GET /api/agents
// @access  Public
const getAgents = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            specialty,
            city,
            minRating,
            search,
            sortBy = 'rating.average',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { isActive: true };

        if (specialty) filter.specialties = specialty;
        if (city) filter['contactInfo.officeAddress.city'] = new RegExp(city, 'i');
        if (minRating) filter['rating.average'] = { $gte: parseFloat(minRating) };
        if (search) {
            filter.$or = [
                { 'user.name': new RegExp(search, 'i') },
                { bio: new RegExp(search, 'i') }
            ];
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const agents = await Agent.find(filter)
            .populate('user', 'name email phone avatar')
            .select('-testimonials -achievements')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count for pagination
        const total = await Agent.countDocuments(filter);

        res.json({
            success: true,
            count: agents.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: agents
        });
    } catch (error) {
        console.error('Get agents error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching agents'
        });
    }
};

// @desc    Get single agent by ID
// @route   GET /api/agents/:id
// @access  Public
const getAgent = async (req, res) => {
    try {
        const agent = await Agent.findOne({ _id: req.params.id, isActive: true })
            .populate('user', 'name email phone avatar');

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: 'Agent not found'
            });
        }

        // Get agent's properties
        const properties = await Property.find({
            owner: agent.user._id,
            isActive: true
        })
            .select('title price location images status')
            .limit(6)
            .lean();

        res.json({
            success: true,
            data: {
                ...agent,
                properties
            }
        });
    } catch (error) {
        console.error('Get agent error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching agent'
        });
    }
};

// @desc    Create agent profile
// @route   POST /api/agents
// @access  Private (Admin)
const createAgent = async (req, res) => {
    try {
        // Check if user already has an agent profile
        const existingAgent = await Agent.findOne({ user: req.body.userId });
        if (existingAgent) {
            return res.status(400).json({
                success: false,
                message: 'Agent profile already exists for this user'
            });
        }

        const agentData = {
            ...req.body,
            user: req.body.userId
        };

        // Handle profile images if uploaded
        if (req.files) {
            if (req.files.profileImage) {
                agentData.profileImage = {
                    url: `/uploads/${req.files.profileImage[0].filename}`,
                    alt: 'Agent profile image'
                };
            }
            if (req.files.coverImage) {
                agentData.coverImage = {
                    url: `/uploads/${req.files.coverImage[0].filename}`,
                    alt: 'Agent cover image'
                };
            }
        }

        const agent = await Agent.create(agentData);

        res.status(201).json({
            success: true,
            message: 'Agent profile created successfully',
            data: agent
        });
    } catch (error) {
        console.error('Create agent error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating agent profile'
        });
    }
};

// @desc    Update agent profile
// @route   PUT /api/agents/:id
// @access  Private (Admin or Agent Owner)
const updateAgent = async (req, res) => {
    try {
        let agent = await Agent.findById(req.params.id);

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: 'Agent not found'
            });
        }

        // Skip authorization check - allow all updates

        // Handle profile images if uploaded
        if (req.files) {
            if (req.files.profileImage) {
                agent.profileImage = {
                    url: `/uploads/${req.files.profileImage[0].filename}`,
                    alt: 'Agent profile image'
                };
            }
            if (req.files.coverImage) {
                agent.coverImage = {
                    url: `/uploads/${req.files.coverImage[0].filename}`,
                    alt: 'Agent cover image'
                };
            }
        }

        // Update agent data
        agent = await Agent.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user', 'name email phone avatar');

        res.json({
            success: true,
            message: 'Agent profile updated successfully',
            data: agent
        });
    } catch (error) {
        console.error('Update agent error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating agent profile'
        });
    }
};

// @desc    Delete agent profile
// @route   DELETE /api/agents/:id
// @access  Private (Admin)
const deleteAgent = async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: 'Agent not found'
            });
        }

        // Soft delete - set isActive to false
        agent.isActive = false;
        await agent.save();

        res.json({
            success: true,
            message: 'Agent profile deleted successfully'
        });
    } catch (error) {
        console.error('Delete agent error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting agent profile'
        });
    }
};

// @desc    Get featured agents
// @route   GET /api/agents/featured
// @access  Public
const getFeaturedAgents = async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const agents = await Agent.find({
            isActive: true,
            isFeatured: true
        })
            .populate('user', 'name email phone avatar')
            .select('-testimonials -achievements')
            .sort({ 'rating.average': -1 })
            .limit(parseInt(limit))
            .lean();

        res.json({
            success: true,
            count: agents.length,
            data: agents
        });
    } catch (error) {
        console.error('Get featured agents error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching featured agents'
        });
    }
};

// @desc    Add testimonial to agent
// @route   POST /api/agents/:id/testimonials
// @access  Public
const addTestimonial = async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: 'Agent not found'
            });
        }

        const testimonial = {
            ...req.body,
            createdAt: new Date()
        };

        agent.testimonials.push(testimonial);

        // Update rating
        const totalRating = agent.testimonials.reduce((sum, t) => sum + t.rating, 0);
        agent.rating.average = totalRating / agent.testimonials.length;
        agent.rating.count = agent.testimonials.length;

        await agent.save();

        res.status(201).json({
            success: true,
            message: 'Testimonial added successfully',
            data: agent.testimonials[agent.testimonials.length - 1]
        });
    } catch (error) {
        console.error('Add testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding testimonial'
        });
    }
};

// @desc    Get agent statistics
// @route   GET /api/agents/:id/stats
// @access  Public
const getAgentStats = async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: 'Agent not found'
            });
        }

        // Get agent's properties count
        const propertiesCount = await Property.countDocuments({
            owner: agent.user,
            isActive: true
        });

        // Get properties by status
        const propertiesByStatus = await Property.aggregate([
            {
                $match: {
                    owner: agent.user,
                    isActive: true
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                rating: agent.rating,
                propertiesSold: agent.propertiesSold,
                propertiesRented: agent.propertiesRented,
                totalValueSold: agent.totalValueSold,
                totalProperties: propertiesCount,
                propertiesByStatus
            }
        });
    } catch (error) {
        console.error('Get agent stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching agent statistics'
        });
    }
};

module.exports = {
    getAgents,
    getAgent,
    createAgent,
    updateAgent,
    deleteAgent,
    getFeaturedAgents,
    addTestimonial,
    getAgentStats
};
