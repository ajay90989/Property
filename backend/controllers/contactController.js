const Contact = require('../models/Contact');
const User = require('../models/User');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
    try {
        const contactData = {
            ...req.body,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        };

        const contact = await Contact.create(contactData);

        res.status(201).json({
            success: true,
            message: 'Contact form submitted successfully',
            data: contact
        });
    } catch (error) {
        console.error('Submit contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while submitting contact form'
        });
    }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private (Admin)
const getContacts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            priority,
            type,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (type) filter.type = type;

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const contacts = await Contact.find(filter)
            .populate('propertyId', 'title location')
            .populate('assignedTo', 'name email')
            .populate('response.respondedBy', 'name email')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count for pagination
        const total = await Contact.countDocuments(filter);

        res.json({
            success: true,
            count: contacts.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: contacts
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching contacts'
        });
    }
};

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private (Admin)
const getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id)
            .populate('propertyId', 'title location')
            .populate('assignedTo', 'name email')
            .populate('response.respondedBy', 'name email');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching contact'
        });
    }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Private (Admin)
const updateContactStatus = async (req, res) => {
    try {
        const { status, priority, assignedTo } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status, priority, assignedTo },
            { new: true, runValidators: true }
        ).populate('assignedTo', 'name email');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact status updated successfully',
            data: contact
        });
    } catch (error) {
        console.error('Update contact status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating contact status'
        });
    }
};

// @desc    Respond to contact
// @route   POST /api/contact/:id/respond
// @access  Private (Admin)
const respondToContact = async (req, res) => {
    try {
        const { message } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                response: {
                    message,
                    respondedBy: req.user?.id || '507f1f77bcf86cd799439011',
                    respondedAt: new Date()
                },
                status: 'resolved'
            },
            { new: true, runValidators: true }
        ).populate('response.respondedBy', 'name email');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Response sent successfully',
            data: contact
        });
    } catch (error) {
        console.error('Respond to contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while responding to contact'
        });
    }
};

// @desc    Get contact statistics
// @route   GET /api/contact/stats
// @access  Private (Admin)
const getContactStats = async (req, res) => {
    try {
        const stats = await Contact.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
                    resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                    closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
                }
            }
        ]);

        const typeStats = await Contact.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityStats = await Contact.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                overview: stats[0] || { total: 0, new: 0, inProgress: 0, resolved: 0, closed: 0 },
                byType: typeStats,
                byPriority: priorityStats
            }
        });
    } catch (error) {
        console.error('Get contact stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching contact statistics'
        });
    }
};

module.exports = {
    submitContact,
    getContacts,
    getContact,
    updateContactStatus,
    respondToContact,
    getContactStats
};
