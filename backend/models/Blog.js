const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    excerpt: {
        type: String,
        maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    content: {
        type: String,
        required: [true, 'Blog content is required']
    },
    featuredImage: {
        url: {
            type: String
        },
        alt: {
            type: String,
            default: 'Blog featured image'
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        default: 'tips',
        enum: ['real-estate', 'investment', 'market-trends', 'home-decor', 'legal', 'tips', 'news']
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    readTime: {
        type: Number, // in minutes
        default: 5
    },
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
    },
    publishedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Generate slug from title
blogSchema.pre('save', function (next) {
    if (!this.slug) {
        let baseSlug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');

        // Add timestamp to make it unique
        this.slug = baseSlug + '-' + Date.now();
    }
    next();
});

// Calculate read time
blogSchema.pre('save', function (next) {
    if (this.isModified('content')) {
        const wordsPerMinute = 200;
        const wordCount = this.content.split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / wordsPerMinute);
    }
    next();
});

// Index for better search performance
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ isFeatured: 1, status: 1 });

module.exports = mongoose.model('Blog', blogSchema);
