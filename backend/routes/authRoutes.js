const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/userModel');

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    // Find admin user by username
    const user = await UserModel.findOne({ 
      username: username,
      role: 'admin',
      isActive: true
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ 
        error: 'Invalid username or password' 
      });
    }

    // Set session
    req.session.adminId = user._id.toString();
    req.session.isAdmin = true;

    res.json({ 
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin Logout
router.post('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// Verify Admin Session
router.get('/admin/verify', async (req, res) => {
  try {
    if (!req.session.adminId || !req.session.isAdmin) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await UserModel.findById(req.session.adminId);
    if (!user || user.role !== 'admin' || !user.isActive) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    res.json({ 
      authenticated: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;