// backend/routes/users.js
const express = require('express');
const User = require('../models/User');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// Get all users (manager only)
router.get('/', verifyToken, checkRole('manager'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user addresses (customer)
router.put('/addresses', verifyToken, checkRole('customer'), async (req, res) => {
  try {
    const { addresses } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { addresses }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;