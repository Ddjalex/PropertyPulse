const express = require("express");
const cors = require("cors");
require('dotenv').config();
require('./db'); // Connect to MongoDB

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Simple admin authentication middleware
const adminAuth = (req, res, next) => {
  const adminKey = req.headers['x-admin-key']
  const validAdminKey = process.env.ADMIN_API_KEY
  
  if (!validAdminKey) {
    console.error('ADMIN_API_KEY environment variable is not set!')
    return res.status(500).json({ 
      error: 'Server configuration error. Admin access unavailable.' 
    })
  }
  
  if (!adminKey || adminKey !== validAdminKey) {
    return res.status(401).json({ 
      error: 'Unauthorized. Admin access required.' 
    })
  }
  
  next()
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

// Public routes
app.use('/api', propertyRoutes);
app.use('/api', projectRoutes);
app.use('/api', teamRoutes);
app.use('/api', leadRoutes);

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