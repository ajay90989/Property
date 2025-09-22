const Property = require('../models/Property');
const path = require('path');

// @desc    Get all properties with filtering and pagination
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            propertyType,
            listingType,
            minPrice,
            maxPrice,
            city,
            state,
            bedrooms,
            bathrooms,
            minArea,
            maxArea,
            facing,
            furnished,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            isActive = true
        } = req.query;

        // Build filter object
        const filter = { isActive };

        if (propertyType) filter.propertyType = propertyType;
        if (listingType) filter.listingType = listingType;
        if (city) filter['location.city'] = new RegExp(city, 'i');
        if (state) filter['location.state'] = new RegExp(state, 'i');
        if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms) };
        if (bathrooms) filter.bathrooms = { $gte: parseInt(bathrooms) };
        if (facing) filter.facing = facing;
        if (furnished) filter.furnished = furnished;

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseInt(minPrice);
            if (maxPrice) filter.price.$lte = parseInt(maxPrice);
        }

        // Area range filter
        if (minArea || maxArea) {
            filter['area.value'] = {};
            if (minArea) filter['area.value'].$gte = parseInt(minArea);
            if (maxArea) filter['area.value'].$lte = parseInt(maxArea);
        }

        // Text search
        if (search) {
            filter.$text = { $search: search };
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const properties = await Property.find(filter)
            .populate('owner', 'name email phone')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count for pagination
        const total = await Property.countDocuments(filter);

        res.json({
            success: true,
            count: properties.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: properties
        });
    } catch (error) {
        console.error('Get properties error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching properties'
        });
    }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('owner', 'name email phone');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Increment view count
        property.views += 1;
        await property.save();

        res.json({
            success: true,
            data: property
        });
    } catch (error) {
        console.error('Get property error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching property'
        });
    }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Admin)
const createProperty = async (req, res) => {
    try {
        const propertyData = {
            ...req.body,
            owner: req.user.id
        };

        // Handle images if uploaded
        if (req.files && req.files.length > 0) {
            propertyData.images = req.files.map((file, index) => ({
                url: `/uploads/${file.filename}`,
                alt: `Property image ${index + 1}`,
                isPrimary: index === 0
            }));
        }

        const property = await Property.create(propertyData);

        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: property
        });
    } catch (error) {
        console.error('Create property error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating property'
        });
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Admin)
const updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Handle new images if uploaded
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file, index) => ({
                url: `/uploads/${file.filename}`,
                alt: `Property image ${index + 1}`,
                isPrimary: false
            }));

            // Add new images to existing ones
            property.images = [...property.images, ...newImages];
        }

        // Update property data
        property = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Property updated successfully',
            data: property
        });
    } catch (error) {
        console.error('Update property error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating property'
        });
    }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Admin)
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Soft delete - set isActive to false
        property.isActive = false;
        await property.save();

        res.json({
            success: true,
            message: 'Property deleted successfully'
        });
    } catch (error) {
        console.error('Delete property error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting property'
        });
    }
};

// @desc    Toggle property active status
// @route   PATCH /api/properties/:id/toggle
// @access  Private (Admin)
const togglePropertyStatus = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        property.isActive = !property.isActive;
        await property.save();

        res.json({
            success: true,
            message: `Property ${property.isActive ? 'activated' : 'deactivated'} successfully`,
            data: {
                id: property._id,
                isActive: property.isActive
            }
        });
    } catch (error) {
        console.error('Toggle property status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while toggling property status'
        });
    }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const properties = await Property.find({
            isActive: true,
            isFeatured: true
        })
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

        res.json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error) {
        console.error('Get featured properties error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching featured properties'
        });
    }
};

// @desc    Get properties by owner
// @route   GET /api/properties/owner/:ownerId
// @access  Public
const getPropertiesByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const properties = await Property.find({
            owner: ownerId,
            isActive: true
        })
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Property.countDocuments({
            owner: ownerId,
            isActive: true
        });

        res.json({
            success: true,
            count: properties.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: properties
        });
    } catch (error) {
        console.error('Get properties by owner error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching properties by owner'
        });
    }
};

module.exports = {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    togglePropertyStatus,
    getFeaturedProperties,
    getPropertiesByOwner
};
