const express = require('express');
const router = express.Router();
const { protect, adminOrSuperAdmin, superAdmin } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllOrders,
  getDashboardStats
} = require('../controllers/adminController');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin panel and super admin operations
 */

// Dashboard
router.get('/dashboard', protect, adminOrSuperAdmin, getDashboardStats);

// User management
router.get('/users', protect, adminOrSuperAdmin, getAllUsers);
router.get('/users/:id', protect, adminOrSuperAdmin, getUserById);
router.put('/users/:id', protect, adminOrSuperAdmin, updateUser);
router.delete('/users/:id', protect, superAdmin, deleteUser);

// Order management
router.get('/orders', protect, adminOrSuperAdmin, getAllOrders);

module.exports = router;
