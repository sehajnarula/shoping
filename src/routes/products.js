const express = require('express');
const router = express.Router();
const { protect, adminOrSuperAdmin } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and operations
 */

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Protected routes (Admin/Super Admin only)
router.post('/', protect, adminOrSuperAdmin, uploadSingle, createProduct);
router.put('/:id', protect, adminOrSuperAdmin, uploadSingle, updateProduct);
router.delete('/:id', protect, adminOrSuperAdmin, deleteProduct);

module.exports = router;
