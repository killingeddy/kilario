const express = require('express');
const webhookController = require('../controllers/webhook.controller');
const logger = require('../utils/logger');

const router = express.Router();

// Webhook signature verification middleware (optional but recommended)
const verifyWebhookSignature = (req, res, next) => {
  const signature = req.headers['x-infinite-pay-signature'];
  const webhookSecret = process.env.INFINITE_PAY_WEBHOOK_SECRET;
  
  // If no secret configured, skip verification (development mode)
  if (!webhookSecret) {
    logger.warn('Webhook signature verification skipped - no secret configured');
    return next();
  }
  
  // If signature header is missing
  if (!signature) {
    logger.warn('Webhook received without signature');
    // In production, you might want to reject this
    // return res.status(401).json({ error: 'Missing signature' });
    return next();
  }
  
  // TODO: Implement actual signature verification based on Infinite Pay's documentation
  // This is a placeholder for the actual verification logic
  // Example: const isValid = verifyHmacSignature(signature, req.body, webhookSecret);
  
  next();
};

// Infinite Pay webhook endpoint
router.post('/infinite-pay', verifyWebhookSignature, webhookController.infinitePay);

module.exports = router;
