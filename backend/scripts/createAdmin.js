const mongoose = require('mongoose');
require('dotenv').config();
require('../db');
const { UserModel } = require('../models/userModel');

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.username || existingAdmin.email);
      return;
    }

    // Create admin user
    const adminUser = new UserModel({
      username: 'admin',
      email: 'admin@giftrealestate.com',
      password: 'admin123', // Default password - should be changed
      firstName: 'Gift Real Estate',
      lastName: 'Administrator',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdminUser();