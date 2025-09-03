import { UserModel } from "@shared/models";

export async function ensureAdminUser(userId: string, email?: string) {
  try {
    // Check if user exists
    let user = await UserModel.findById(userId);
    
    if (!user) {
      // Create new admin user
      user = new UserModel({
        _id: userId,
        email: email,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await user.save();
      console.log('✅ Admin user created:', userId);
    } else if (user.role !== 'admin') {
      // Update existing user to admin
      user.role = 'admin';
      user.updatedAt = new Date();
      await user.save();
      console.log('✅ User promoted to admin:', userId);
    }
    
    return user;
  } catch (error) {
    console.error('Error ensuring admin user:', error);
    throw error;
  }
}