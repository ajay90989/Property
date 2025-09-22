const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Property title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Property description is required'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    propertyType: {
        type: String,
        required: [true, 'Property type is required'],
        enum: ['apartment', 'house', 'villa', 'plot', 'commercial', 'office', 'shop', 'warehouse']
    },
    listingType: {
        type: String,
        required: [true, 'Listing type is required'],
        enum: ['sale', 'rent']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    area: {
        value: {
            type: Number,
            required: [true, 'Area value is required'],
            min: [0, 'Area cannot be negative']
        },
        unit: {
            type: String,
            required: [true, 'Area unit is required'],
            enum: ['sqft', 'sqm', 'acre', 'hectare']
        }
    },
    bedrooms: {
        type: Number,
        min: [0, 'Bedrooms cannot be negative'],
        default: 0
    },
    bathrooms: {
        type: Number,
        min: [0, 'Bathrooms cannot be negative'],
        default: 0
    },
    floors: {
        type: Number,
        min: [0, 'Floors cannot be negative'],
        default: 1
    },
    facing: {
        type: String,
        enum: ['north', 'south', 'east', 'west', 'north-east', 'north-west', 'south-east', 'south-west']
    },
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        default: 0
    },
    furnished: {
        type: String,
        enum: ['furnished', 'semi-furnished', 'unfurnished'],
        default: 'unfurnished'
    },
    parking: {
        type: Number,
        min: [0, 'Parking cannot be negative'],
        default: 0
    },
    balcony: {
        type: Number,
        min: [0, 'Balcony count cannot be negative'],
        default: 0
    },
    amenities: [{
        type: String,
        trim: true
    }],
    images: [{
        url: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            default: 'Property image'
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    location: {
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode']
        },
        coordinates: {
            latitude: {
                type: Number,
                min: -90,
                max: 90
            },
            longitude: {
                type: Number,
                min: -180,
                max: 180
            }
        },
        landmark: String
    },
    contact: {
        name: {
            type: String,
            required: [true, 'Contact name is required'],
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Contact phone is required'],
            match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
        },
        email: {
            type: String,
            required: [true, 'Contact email is required'],
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        whatsapp: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'rented', 'under-negotiation'],
        default: 'available'
    }
}, {
    timestamps: true
});

// Index for better search performance
propertySchema.index({ title: 'text', description: 'text', 'location.city': 'text', 'location.address': 'text' });
propertySchema.index({ propertyType: 1, listingType: 1, price: 1 });
propertySchema.index({ 'location.city': 1, 'location.state': 1 });
propertySchema.index({ isActive: 1, status: 1 });

module.exports = mongoose.model('Property', propertySchema);
