const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order } = require('../models');

/**
 * @swagger
 * /api/payments/create-payment-intent:
 *   post:
 *     summary: Create payment intent for Stripe
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: integer
 *                 description: ID of the order to pay for
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 clientSecret:
 *                   type: string
 *                 orderId:
 *                   type: integer
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Find the order
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id.toString(),
        userId: req.user.id.toString()
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: order.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent'
    });
  }
};

/**
 * @swagger
 * /api/payments/confirm-payment:
 *   post:
 *     summary: Confirm payment and update order status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - paymentIntentId
 *             properties:
 *               orderId:
 *                 type: integer
 *               paymentIntentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    if (!orderId || !paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and Payment Intent ID are required'
      });
    }

    // Find the order
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order payment status
      await order.update({
        paymentStatus: 'paid',
        paymentId: paymentIntentId,
        status: 'processing'
      });

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment'
    });
  }
};

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Stripe webhook endpoint for payment events
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentFailure(failedPayment);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

const handlePaymentSuccess = async (paymentIntent) => {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    if (orderId) {
      const order = await Order.findByPk(orderId);
      if (order) {
        await order.update({
          paymentStatus: 'paid',
          paymentId: paymentIntent.id,
          status: 'processing'
        });
      }
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
};

const handlePaymentFailure = async (paymentIntent) => {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    if (orderId) {
      const order = await Order.findByPk(orderId);
      if (order) {
        await order.update({
          paymentStatus: 'failed',
          paymentId: paymentIntent.id
        });
      }
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
};

/**
 * @swagger
 * /api/payments/refund:
 *   post:
 *     summary: Process refund for an order (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - reason
 *             properties:
 *               orderId:
 *                 type: integer
 *               reason:
 *                 type: string
 *               amount:
 *                 type: number
 *                 description: Amount to refund (optional, defaults to full amount)
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 refund:
 *                   type: object
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
const processRefund = async (req, res) => {
  try {
    const { orderId, reason, amount } = req.body;

    if (!orderId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and reason are required'
      });
    }

    // Find the order
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is not paid'
      });
    }

    if (!order.paymentId) {
      return res.status(400).json({
        success: false,
        message: 'No payment ID found for this order'
      });
    }

    // Process refund with Stripe
    const refundAmount = amount ? Math.round(amount * 100) : Math.round(order.totalAmount * 100);
    
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentId,
      amount: refundAmount,
      reason: 'requested_by_customer',
      metadata: {
        orderId: order.id.toString(),
        reason: reason
      }
    });

    // Update order status
    await order.update({
      paymentStatus: 'refunded',
      status: 'cancelled'
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund'
    });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
  processRefund
};

