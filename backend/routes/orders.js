// backend/routes/orders.js
const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// Create order (customer)
router.post('/', verifyToken, checkRole('customer'), async (req, res) => {
  try {
    const { items, total, address, paymentMethod } = req.body;
    const order = new Order({
      userId: req.user.id,
      items,
      total,
      address,
      paymentMethod,
      status: 'Pending'
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get orders based on role
router.get('/', verifyToken, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'manager') {
      orders = await Order.find().populate('userId', 'name email').populate('assignedTo', 'name');
    } else if (req.user.role === 'employee') {
      orders = await Order.find({ assignedTo: req.user.id }).populate('userId', 'name email');
    } else {
      orders = await Order.find({ userId: req.user.id });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (employee/manager)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (req.user.role === 'employee' && order.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not assigned to you' });
    }
    
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign order to employee (manager only)
router.put('/:id/assign', verifyToken, checkRole('manager'), async (req, res) => {
  try {
    const { employeeId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== 'employee') {
      return res.status(400).json({ message: 'Invalid employee' });
    }
    
    order.assignedTo = employeeId;
    order.status = 'Assigned';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assigned orders for employee
router.get('/assigned', verifyToken, checkRole('employee'), async (req, res) => {
  try {
    const orders = await Order.find({ assignedTo: req.user.id }).populate('userId', 'name email address');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;