const webhookService = require('../services/webhook.service');
const responses = require('../utils/responses');
const { asyncHandler } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

const webhookController = {
  infinitePay: asyncHandler(async (req, res) => {
    const payload = req.body;
    
    // Basic validation
    if (!payload.event_id || !payload.event_type) {
      logger.warn('Invalid webhook payload received', { payload });
      return responses.badRequest(res, 'Invalid webhook payload');
    }
    
    logger.info('Infinite Pay webhook received', {
      event_id: payload.event_id,
      event_type: payload.event_type,
    });
    
    try {
      const result = await webhookService.processInfinitePayWebhook(payload);
      
      // Always return 200 to acknowledge receipt
      // Even if processing fails, we don't want retries for already-stored events
      return responses.success(res, result, 'Webhook processed');
      
    } catch (error) {
      // Log the error but still return 200 to prevent retries
      // The error is already logged and stored in the webhook_events table
      logger.error('Webhook processing error', { error: error.message });
      
      return responses.success(res, {
        status: 'error',
        message: 'Webhook received but processing failed',
      });
    }
  }),
};

module.exports = webhookController;
