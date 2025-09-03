import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI must be set. Did you forget to set your MongoDB connection string?",
  );
}

// Connect to MongoDB with specific database name
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI!;
    await mongoose.connect(uri, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB().then(async () => {
  // Import and run data seeding after connection is established
  const { seedInitialData } = await import('./seedData');
  await seedInitialData();
});

export default mongoose;