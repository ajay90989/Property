const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['page-view', 'property-view', 'user-registration', 'property-created', 'contact-form', 'search']
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'entityType'
    },
    entityType: {
        type: String,
        enum: ['Property', 'Blog', 'User', 'Contact']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sessionId: String,
    ipAddress: String,
    userAgent: String,
    referrer: String,
    location: {
        country: String,
        state: String,
        city: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    device: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet']
    },
    browser: String,
    os: String,
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Compound indexes for better query performance
analyticsSchema.index({ date: 1, type: 1 });
analyticsSchema.index({ entityId: 1, entityType: 1 });
analyticsSchema.index({ userId: 1, date: 1 });
analyticsSchema.index({ type: 1, date: -1 });

// TTL index to automatically delete old analytics data (keep for 1 year)
analyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

module.exports = mongoose.model('Analytics', analyticsSchema);
