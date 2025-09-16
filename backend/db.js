const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

if (!process.env.MONGODB_URI) {
  console.warn("⚠️  MONGODB_URI not set. Running without database connection.");
  module.exports = null;
  return;
}

// Connect to MongoDB with optimized settings
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Don't exit process in development, retry connection
    setTimeout(connectDB, 5000);
  }
};

connectDB();

module.exports = mongoose;