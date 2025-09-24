const User = require('../models/User');
const Property = require('../models/Property');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search && req.query.search !== 'undefined' ? req.query.search : null;
       

        let filter = {
            role: 'user'
        };

        if (search) {
          
            filter = {
                $and: [
                    { role: 'user' },
                    {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                            { phone: { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            };
        }
        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query
        const users = await User.find(filter)
            .select('-password') // Exclude password
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();



        const total = await User.countDocuments(filter);

        // Get properties count for each user
        const usersWithPropertiesCount = await Promise.all(
            users.map(async (user) => {
                const propertiesCount = await Property.countDocuments({ owner: user._id });
                return {
                    ...user,
                    propertiesCount
                };
            })
        );

        res.json({
            success: true,
            count: users.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: usersWithPropertiesCount
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users'
        });
    }
};


const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get properties count
        const propertiesCount = await Property.countDocuments({ owner: user._id });

        res.json({
            success: true,
            data: {
                ...user.toObject(),
                propertiesCount
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user'
        });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
    try {
        const { name, email, phone, role, isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (role) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;

        await user.save();

        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating user'
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user has properties
        const propertiesCount = await Property.countDocuments({ owner: user._id });
        if (propertiesCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete user with properties. Please transfer properties first.'
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting user'
        });
    }
};

// @desc    Toggle user status
// @route   PATCH /api/users/:id/toggle
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: user
        });
    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while toggling user status'
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleUserStatus
};
