const express = require('express');
const router = express.Router();
const { protect, adminOrSuperAdmin } = require('../middleware/auth');
const {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
  processRefund
} = require('../controllers/paymentController');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing and management
 */

// Public routes (webhook doesn't need authentication)
router.post('/webhook', handleWebhook);

// Protected routes
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm-payment', protect, confirmPayment);
router.post('/refund', protect, adminOrSuperAdmin, processRefund);

module.exports = router;
