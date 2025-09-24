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
            isActive
        } = req.query;

        // Clean up undefined values
        const cleanQuery = {};
        Object.keys(req.query).forEach(key => {
            if (req.query[key] !== 'undefined' && req.query[key] !== undefined) {
                cleanQuery[key] = req.query[key];
            }
        });

       

        // Build filter object
        const filter = {};

        // Handle isActive parameter properly
        if (isActive !== undefined && isActive !== 'undefined') {
            filter.isActive = isActive === 'true' || isActive === true;
        }
        // If isActive is not provided, don't filter by it (show all properties)
        // This is useful for admin users who want to see both active and inactive properties

        if (propertyType && propertyType !== 'undefined') filter.propertyType = propertyType;
        if (listingType && listingType !== 'undefined') filter.listingType = listingType;
        if (city && city !== 'undefined') filter['location.city'] = new RegExp(city, 'i');
        if (state && state !== 'undefined') filter['location.state'] = new RegExp(state, 'i');
        if (bedrooms && bedrooms !== 'undefined') filter.bedrooms = { $gte: parseInt(bedrooms) };
        if (bathrooms && bathrooms !== 'undefined') filter.bathrooms = { $gte: parseInt(bathrooms) };
        if (facing && facing !== 'undefined') filter.facing = facing;
        if (furnished && furnished !== 'undefined') filter.furnished = furnished;

        // Price range filter
        if ((minPrice && minPrice !== 'undefined') || (maxPrice && maxPrice !== 'undefined')) {
            filter.price = {};
            if (minPrice && minPrice !== 'undefined') filter.price.$gte = parseInt(minPrice);
            if (maxPrice && maxPrice !== 'undefined') filter.price.$lte = parseInt(maxPrice);
        }

        // Area range filter
        if ((minArea && minArea !== 'undefined') || (maxArea && maxArea !== 'undefined')) {
            filter['area.value'] = {};
            if (minArea && minArea !== 'undefined') filter['area.value'].$gte = parseInt(minArea);
            if (maxArea && maxArea !== 'undefined') filter['area.value'].$lte = parseInt(maxArea);
        }

        // Text search - use regex instead of $text for better compatibility
        if (search && search !== 'undefined') {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'location.city': { $regex: search, $options: 'i' } },
                { 'location.address': { $regex: search, $options: 'i' } }
            ];
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

       

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
      

        // Test if Property model is working
        try {
            const testCount = await Property.countDocuments();
           
        } catch (testError) {
            console.error('Property model test error:', testError);
            throw testError;
        }

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
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Server error while fetching properties',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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


        // Use default owner ID if no user is authenticated
        const ownerId = req.user?.id || '507f1f77bcf86cd799439011'; // Default ObjectId

        // Validate required fields
        const requiredFields = ['title', 'description', 'propertyType', 'listingType', 'price'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Parse nested objects from form data
        const propertyData = {
            title: req.body.title,
            description: req.body.description,
            propertyType: req.body.propertyType,
            listingType: req.body.listingType,
            price: parseFloat(req.body.price),
            area: {
                value: parseFloat(req.body['area.value']),
                unit: req.body['area.unit']
            },
            bedrooms: parseInt(req.body.bedrooms) || 0,
            bathrooms: parseInt(req.body.bathrooms) || 0,
            floors: parseInt(req.body.floors) || 1,
            facing: req.body.facing || undefined,
            age: parseInt(req.body.age) || 0,
            furnished: req.body.furnished || 'unfurnished',
            parking: parseInt(req.body.parking) || 0,
            balcony: parseInt(req.body.balcony) || 0,
            amenities: req.body.amenities ? JSON.parse(req.body.amenities) : [],
            location: {
                address: req.body['location.address'],
                city: req.body['location.city'],
                state: req.body['location.state'],
                pincode: req.body['location.pincode'],
                landmark: req.body['location.landmark'] || undefined
            },
            contact: {
                name: req.body['contact.name'],
                phone: req.body['contact.phone'],
                email: req.body['contact.email'],
                whatsapp: req.body['contact.whatsapp'] || undefined
            },
            owner: ownerId,
            isActive: true
        };

        // Handle images if uploaded
       
        if (req.files && req.files.images && req.files.images.length > 0) {
           
            propertyData.images = req.files.images.map((file, index) => ({
                url: `/uploads/${file.filename}`,
                alt: `Property image ${index + 1}`,
                isPrimary: index === 0
            }));
           
        } else {
            console.log('No images provided or images array is empty');
        }

       

        // Validate the data before creating
        try {
            const property = new Property(propertyData);
            const validationError = property.validateSync();
            if (validationError) {
                console.error('Validation error:', validationError);
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: validationError.errors
                });
            }
        } catch (validationError) {
            console.error('Validation error:', validationError);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: validationError.message
            });
        }

        const property = await Property.create(propertyData);

        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: property
        });
    } catch (error) {
        console.error('Create property error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Server error while creating property',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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

        // Hard delete - actually remove from database
        await Property.findByIdAndDelete(req.params.id);

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

// @desc    Test property toggle (for debugging)
// @route   GET /api/properties/:id/test-toggle
// @access  Private (Admin)
const testToggleProperty = async (req, res) => {
    try {
       
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        res.json({
            success: true,
            message: 'Property found',
            data: {
                id: property._id,
                title: property.title,
                isActive: property.isActive,
                owner: property.owner
            }
        });
    } catch (error) {
        console.error('Test toggle error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
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
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Server error while toggling property status',
            error: error.message
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
            isActive: true
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

// @desc    Get filter options for properties
// @route   GET /api/properties/filter-options
// @access  Public
const getFilterOptions = async (req, res) => {
    try {

        //Get unique cities
        const cities = await Property.distinct('location.city', { isActive: true });

        // Get unique property types
        const propertyTypes = await Property.distinct('propertyType', { isActive: true });

        // Get unique listing types
        const listingTypes = await Property.distinct('listingType', { isActive: true });

        // Get price ranges (min and max)
        const priceStats = await Property.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }
        ]);

        // Create budget ranges
        const budgetRanges = [];
        if (priceStats.length > 0) {
            const { minPrice, maxPrice } = priceStats[0];
          
            const range = maxPrice - minPrice;
         

            if (range > 0) {
                // If we have a proper range, create 5 ranges
                const step = Math.ceil(range / 5);

                for (let i = 0; i < 5; i++) {
                    const start = minPrice + (i * step);
                    const end = minPrice + ((i + 1) * step);
                    budgetRanges.push({
                        label: `₹${(start / 100000).toFixed(1)}L - ₹${(end / 100000).toFixed(1)}L`,
                        minPrice: start,
                        maxPrice: end
                    });
                }
            } else {
                // If all properties have the same price, create ranges around that price
                const basePrice = minPrice;
                const step = Math.max(basePrice * 0.2, 100000); // 20% of price or 1L minimum

                // Create 5 ranges starting from 0 and going up
                for (let i = 0; i < 5; i++) {
                    const start = i * step;
                    const end = (i + 1) * step;
                    budgetRanges.push({
                        label: `₹${(start / 100000).toFixed(1)}L - ₹${(end / 100000).toFixed(1)}L`,
                        minPrice: start,
                        maxPrice: end
                    });
                }
            }
        } else {
            // Default ranges if no price data
            budgetRanges.push(
                { label: 'Under ₹10L', minPrice: 0, maxPrice: 1000000 },
                { label: '₹10L - ₹25L', minPrice: 1000000, maxPrice: 2500000 },
                { label: '₹25L - ₹50L', minPrice: 2500000, maxPrice: 5000000 },
                { label: '₹50L - ₹1Cr', minPrice: 5000000, maxPrice: 10000000 },
                { label: 'Above ₹1Cr', minPrice: 10000000, maxPrice: 999999999 }
            );
        }

        res.json({
            success: true,
            data: {
                cities: cities.filter(city => city).sort(),
                propertyTypes: propertyTypes.filter(type => type).sort(),
                listingTypes: listingTypes.filter(type => type).sort(),
                budgetRanges: budgetRanges.filter(range => range).sort()
            }
        });
    } catch (error) {
        console.error('Get filter options error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching filter options'
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
    testToggleProperty,
    getFeaturedProperties,
    getPropertiesByOwner,
    getFilterOptions
};
