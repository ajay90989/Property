const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const blogRoutes = require('./routes/blogs');
const contactRoutes = require('./routes/contacts');
const analyticsRoutes = require('./routes/analytics');
const agentRoutes = require('./routes/agents');
const userRoutes = require('./routes/users');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Environment variables for allowed origins
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
// Example in .env: ALLOWED_ORIGINS=http://localhost:3000,https://myfrontend.vercel.app

// Security middleware with dynamic domains
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "*"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'"]
        }
    }
}));

// CORS configuration - dynamic domains
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
}));

// Body parser
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '10000mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
}));

// Debug static file serving
app.get('/uploads/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'uploads', req.path.replace('/uploads/', '')));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Test static file serving
app.get('/api/test-uploads', (req, res) => {
    const fs = require('fs');
    const uploadsDir = path.join(__dirname, 'uploads');

    try {
        const files = fs.readdirSync(uploadsDir);
        res.json({
            success: true,
            message: 'Uploads directory accessible',
            files,
            count: files.length
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Uploads directory not accessible',
            error: error.message
        });
    }
});

// Test image serving
app.get('/api/test-image/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'uploads', filename);

    if (require('fs').existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).json({
            success: false,
            message: 'Image not found',
            path: imagePath
        });
    }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

module.exports = app;
