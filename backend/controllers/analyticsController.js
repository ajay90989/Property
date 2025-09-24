const Analytics = require('../models/Analytics');
const Property = require('../models/Property');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Contact = require('../models/Contact');

// @desc    Track analytics event
// @route   POST /api/analytics/track
// @access  Public
const trackEvent = async (req, res) => {
    try {
        const analyticsData = {
            ...req.body,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        };

        const analytics = await Analytics.create(analyticsData);

        res.status(201).json({
            success: true,
            message: 'Event tracked successfully',
            data: analytics
        });
    } catch (error) {
        console.error('Track analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while tracking analytics'
        });
    }
};

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
const getDashboardAnalytics = async (req, res) => {
    try {
        const { period = '30d' } = req.query;

        // Calculate date range
        const now = new Date();
        let startDate;

        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Get basic counts
        const [
            totalProperties,
            activeProperties,
            totalUsers,
            totalContacts,
            totalBlogs
        ] = await Promise.all([
            Property.countDocuments(),
            Property.countDocuments({ isActive: true }),
            User.countDocuments(),
            Contact.countDocuments(),
            Blog.countDocuments({ status: 'published' })
        ]);

        // Get analytics data
        const analyticsData = await Analytics.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: now }
                }
            },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get page views over time
        const pageViews = await Analytics.aggregate([
            {
                $match: {
                    type: 'page-view',
                    date: { $gte: startDate, $lte: now }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        day: { $dayOfMonth: '$date' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
            }
        ]);

        // Get property views
        const propertyViews = await Analytics.aggregate([
            {
                $match: {
                    type: 'property-view',
                    date: { $gte: startDate, $lte: now }
                }
            },
            {
                $group: {
                    _id: '$entityId',
                    views: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'properties',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'property'
                }
            },
            {
                $unwind: '$property'
            },
            {
                $project: {
                    propertyId: '$_id',
                    title: '$property.title',
                    views: 1
                }
            },
            {
                $sort: { views: -1 }
            },
            {
                $limit: 10
            }
        ]);

        // Get user registrations over time
        const userRegistrations = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: now }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
            }
        ]);

        // Get device statistics
        const deviceStats = await Analytics.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: now }
                }
            },
            {
                $group: {
                    _id: '$device',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get location statistics
        const locationStats = await Analytics.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: now },
                    'location.city': { $exists: true }
                }
            },
            {
                $group: {
                    _id: '$location.city',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalProperties,
                    activeProperties,
                    totalUsers,
                    totalContacts,
                    totalBlogs
                },
                analytics: analyticsData,
                pageViews,
                propertyViews,
                userRegistrations,
                deviceStats,
                locationStats
            }
        });
    } catch (error) {
        console.error('Get dashboard analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching dashboard analytics'
        });
    }
};

// @desc    Get property analytics
// @route   GET /api/analytics/properties
// @access  Private (Admin)
const getPropertyAnalytics = async (req, res) => {
    try {
        const { propertyId, period = '30d' } = req.query;

        // Calculate date range
        const now = new Date();
        let startDate;

        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        const matchFilter = {
            type: 'property-view',
            date: { $gte: startDate, $lte: now }
        };

        if (propertyId) {
            matchFilter.entityId = propertyId;
        }

        const analytics = await Analytics.aggregate([
            {
                $match: matchFilter
            },
            {
                $group: {
                    _id: '$entityId',
                    views: { $sum: 1 },
                    uniqueViews: { $addToSet: '$userId' }
                }
            },
            {
                $lookup: {
                    from: 'properties',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'property'
                }
            },
            {
                $unwind: '$property'
            },
            {
                $project: {
                    propertyId: '$_id',
                    title: '$property.title',
                    views: 1,
                    uniqueViews: { $size: '$uniqueViews' }
                }
            },
            {
                $sort: { views: -1 }
            }
        ]);

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error('Get property analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching property analytics'
        });
    }
};

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private (Admin)
const getUserAnalytics = async (req, res) => {
    try {
        const { period = '30d' } = req.query;

        // Calculate date range
        const now = new Date();
        let startDate;

        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Get user registrations over time
        const userRegistrations = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: now }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
            }
        ]);

        // Get user activity
        const userActivity = await Analytics.aggregate([
            {
                $match: {
                    userId: { $exists: true },
                    date: { $gte: startDate, $lte: now }
                }
            },
            {
                $group: {
                    _id: '$userId',
                    activityCount: { $sum: 1 },
                    lastActivity: { $max: '$date' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    userId: '$_id',
                    name: '$user.name',
                    email: '$user.email',
                    activityCount: 1,
                    lastActivity: 1
                }
            },
            {
                $sort: { activityCount: -1 }
            },
            {
                $limit: 20
            }
        ]);

        res.json({
            success: true,
            data: {
                userRegistrations,
                userActivity
            }
        });
    } catch (error) {
        console.error('Get user analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user analytics'
        });
    }
};

module.exports = {
    trackEvent,
    getDashboardAnalytics,
    getPropertyAnalytics,
    getUserAnalytics
};
