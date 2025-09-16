const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
require('dotenv').config();
// Try to connect to MongoDB (optional for now)
try {
  require('./db');
} catch (error) {
  console.warn('⚠️  Database connection failed, running without database:', error.message);
}

const app = express();

// Session store - fallback to memory store if MongoDB is unavailable
let store = null; // Default to memory store
if (process.env.MONGODB_URI) {
  console.log('⚠️  MongoDB URI found but connection issues exist. Using memory store for sessions.');
} else {
  console.warn('⚠️  No MongoDB URI, using memory store for sessions');
}

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'gift-realestate-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  store: store, // Will use memory store if null
  name: 'admin.sid',
  cookie: {
    secure: false, // Set to true only in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Session-based admin authentication middleware
const adminAuth = (req, res, next) => {
  if (!req.session.adminId || !req.session.isAdmin) {
    return res.status(401).json({ 
      error: 'Unauthorized. Admin login required.' 
    });
  }
  
  next();
};

// Request logging middleware (secure - no response body logging)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      console.log(logLine);
    }
  });

  next();
});

// Routes
const propertyRoutes = require('./routes/propertyRoutes');
const projectRoutes = require('./routes/projectRoutes');
const teamRoutes = require('./routes/teamRoutes');
const leadRoutes = require('./routes/leadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

// Public routes
app.use('/api', propertyRoutes);
app.use('/api', projectRoutes);
app.use('/api', teamRoutes);
app.use('/api', leadRoutes);

// Authentication routes
app.use('/api/auth', authRoutes);

// Protected admin routes
app.use('/api/admin', adminAuth, adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React Router - send all non-API requests to React app
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  // Serve React app for all other routes
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
});

module.exports = app;