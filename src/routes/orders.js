const express = require('express');
const router = express.Router();
const { protect, adminOrSuperAdmin } = require('../middleware/auth');
const {
  getUserOrders,
  createOrder,
  getOrderById,
  updateOrder
} = require('../controllers/orderController');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and operations
 */

// Protected routes
router.get('/', protect, getUserOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, updateOrder);

module.exports = router;
