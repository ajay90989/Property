const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    bio: {
        type: String,
        maxlength: [1000, 'Bio cannot be more than 1000 characters']
    },
    specialties: [{
        type: String,
        enum: ['residential', 'commercial', 'luxury', 'investment', 'rental', 'first-time-buyers']
    }],
    experience: {
        years: {
            type: Number,
            min: 0,
            default: 0
        },
        description: String
    },
    languages: [{
        type: String,
        trim: true
    }],
    certifications: [{
        name: String,
        issuer: String,
        date: Date,
        expiryDate: Date
    }],
    socialMedia: {
        linkedin: String,
        facebook: String,
        instagram: String,
        twitter: String,
        website: String
    },
    contactInfo: {
        officePhone: String,
        mobilePhone: String,
        email: String,
        officeAddress: {
            street: String,
            city: String,
            state: String,
            pincode: String,
            country: {
                type: String,
                default: 'India'
            }
        }
    },
    workingHours: {
        monday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
        tuesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
        wednesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
        thursday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
        friday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
        saturday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
        sunday: { start: String, end: String, isWorking: { type: Boolean, default: false } }
    },
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    propertiesSold: {
        type: Number,
        default: 0
    },
    propertiesRented: {
        type: Number,
        default: 0
    },
    totalValueSold: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    profileImage: {
        url: String,
        alt: String
    },
    coverImage: {
        url: String,
        alt: String
    },
    testimonials: [{
        clientName: String,
        clientEmail: String,
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property'
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    achievements: [{
        title: String,
        description: String,
        year: Number,
        organization: String
    }]
}, {
    timestamps: true
});

// Index for better search performance
agentSchema.index({ specialties: 1, isActive: 1 });
agentSchema.index({ 'rating.average': -1 });
agentSchema.index({ isFeatured: 1, isActive: 1 });
agentSchema.index({ propertiesSold: -1 });

module.exports = mongoose.model('Agent', agentSchema);
