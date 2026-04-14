// backend/routes/attendance.js
const express = require('express');
const Attendance = require('../models/Attendance');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// Check-in (employee)
router.post('/checkin', verifyToken, checkRole('employee'), async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const existing = await Attendance.findOne({ employeeId: req.user.id, date: today });
    
    if (existing && existing.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }
    
    if (existing) {
      existing.checkIn = new Date();
      await existing.save();
      return res.json(existing);
    }
    
    const attendance = new Attendance({
      employeeId: req.user.id,
      date: today,
      checkIn: new Date()
    });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check-out (employee)
router.post('/checkout', verifyToken, checkRole('employee'), async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await Attendance.findOne({ employeeId: req.user.id, date: today });
    
    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ message: 'Must check-in first' });
    }
    
    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }
    
    attendance.checkOut = new Date();
    await attendance.save();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get employee attendance
router.get('/me', verifyToken, checkRole('employee'), async (req, res) => {
  try {
    const attendance = await Attendance.find({ employeeId: req.user.id }).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;