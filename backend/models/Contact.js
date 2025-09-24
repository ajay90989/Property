const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        maxlength: [200, 'Subject cannot be more than 200 characters']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        maxlength: [2000, 'Message cannot be more than 2000 characters']
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },
    type: {
        type: String,
        enum: ['general', 'property-inquiry', 'support', 'feedback', 'complaint'],
        default: 'general'
    },
    status: {
        type: String,
        enum: ['new', 'in-progress', 'resolved', 'closed'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    response: {
        message: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        respondedAt: Date
    },
    source: {
        type: String,
        enum: ['website', 'phone', 'email', 'social-media', 'referral'],
        default: 'website'
    },
    ipAddress: String,
    userAgent: String
}, {
    timestamps: true
});

// Index for better query performance
contactSchema.index({ status: 1, priority: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Contact', contactSchema);
