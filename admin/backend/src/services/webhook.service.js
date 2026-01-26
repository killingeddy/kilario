const { transaction } = require('../database/connection');
const webhookEventRepository = require('../repositories/webhookEvent.repository');
const orderRepository = require('../repositories/order.repository');
const productRepository = require('../repositories/product.repository');
const deliveryRepository = require('../repositories/delivery.repository');
const notificationService = require('./notification.service');
const { AppError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

const webhookService = {
  /**
   * Process Infinite Pay webhook event
   * This is idempotent - processing the same event twice will not cause issues
   */
  async processInfinitePayWebhook(payload) {
    const { event_id, event_type, data } = payload;
    
    // Check if event was already processed (idempotency)
    const existingEvent = await webhookEventRepository.findByEventId(event_id);
    
    if (existingEvent) {
      logger.info('Webhook event already processed', { event_id });
      return { status: 'already_processed', event: existingEvent };
    }
    
    // Store the event first
    const webhookEvent = await webhookEventRepository.create({
      event_id,
      event_type,
      payload,
      status: 'processing',
    });
    
    try {
      let result;
      
      switch (event_type) {
        case 'payment.approved':
        case 'payment.confirmed':
          result = await this.handlePaymentConfirmed(data);
          break;
          
        case 'payment.failed':
        case 'payment.declined':
          result = await this.handlePaymentFailed(data);
          break;
          
        case 'payment.refunded':
          result = await this.handlePaymentRefunded(data);
          break;
          
        default:
          logger.warn('Unknown webhook event type', { event_type });
          result = { status: 'ignored', reason: 'Unknown event type' };
      }
      
      // Mark event as processed
      await webhookEventRepository.updateStatus(webhookEvent.id, 'processed');
      
      logger.audit('WEBHOOK_PROCESSED', null, { event_id, event_type });
      
      return { status: 'processed', result };
      
    } catch (error) {
      // Mark event as failed
      await webhookEventRepository.updateStatus(
        webhookEvent.id,
        'failed',
        error.message
      );
      
      logger.error('Webhook processing failed', {
        event_id,
        event_type,
        error: error.message,
      });
      
      throw error;
    }
  },

  /**
   * Handle confirmed payment
   * Updates order to paid, products to sold, creates delivery and notification
   */
  async handlePaymentConfirmed(data) {
    const { payment_id, order_reference, amount } = data;
    
    // Find order by payment_id or reference
    let order = await orderRepository.findByPaymentId(payment_id);
    
    if (!order && order_reference) {
      order = await orderRepository.findByReferenceCode(order_reference);
    }
    
    if (!order) {
      throw new AppError(`Order not found for payment ${payment_id}`, 404);
    }
    
    // Skip if already paid
    if (order.status === 'paid') {
      logger.info('Order already paid, skipping', { orderId: order.id });
      return { status: 'skipped', reason: 'Order already paid' };
    }
    
    // Process everything in a transaction
    const result = await transaction(async (client) => {
      // 1. Update order to paid
      await client.query(
        `UPDATE orders SET status = 'paid', paid_at = NOW(), updated_at = NOW() WHERE id = $1`,
        [order.id]
      );
      
      // 2. Get order items and update products to sold
      const itemsResult = await client.query(
        `SELECT product_id FROM order_items WHERE order_id = $1`,
        [order.id]
      );
      
      const productIds = itemsResult.rows.map(row => row.product_id);
      
      if (productIds.length > 0) {
        await productRepository.updateStatusBulk(productIds, 'sold', client);
      }
      
      // 3. Create delivery record
      const delivery = await deliveryRepository.create(
        { order_id: order.id, status: 'pending' },
        client
      );
      
      // 4. Create notification
      await notificationService.notifyPaymentReceived(order, client);
      
      return {
        order_id: order.id,
        products_updated: productIds.length,
        delivery_id: delivery.id,
      };
    });
    
    logger.info('Payment confirmed processed', result);
    
    return result;
  },

  /**
   * Handle failed payment
   */
  async handlePaymentFailed(data) {
    const { payment_id, order_reference, reason } = data;
    
    let order = await orderRepository.findByPaymentId(payment_id);
    
    if (!order && order_reference) {
      order = await orderRepository.findByReferenceCode(order_reference);
    }
    
    if (!order) {
      logger.warn('Order not found for failed payment', { payment_id });
      return { status: 'skipped', reason: 'Order not found' };
    }
    
    // If order is still pending, we might want to release reserved products
    if (order.status === 'pending') {
      await transaction(async (client) => {
        // Get order items
        const itemsResult = await client.query(
          `SELECT product_id FROM order_items WHERE order_id = $1`,
          [order.id]
        );
        
        const productIds = itemsResult.rows.map(row => row.product_id);
        
        // Release products back to available
        if (productIds.length > 0) {
          await productRepository.updateStatusBulk(productIds, 'available', client);
        }
        
        // Update order status
        await client.query(
          `UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1`,
          [order.id]
        );
      });
    }
    
    logger.info('Payment failed processed', { orderId: order.id, reason });
    
    return { order_id: order.id, status: 'cancelled' };
  },

  /**
   * Handle refunded payment
   */
  async handlePaymentRefunded(data) {
    const { payment_id, order_reference } = data;
    
    let order = await orderRepository.findByPaymentId(payment_id);
    
    if (!order && order_reference) {
      order = await orderRepository.findByReferenceCode(order_reference);
    }
    
    if (!order) {
      logger.warn('Order not found for refund', { payment_id });
      return { status: 'skipped', reason: 'Order not found' };
    }
    
    // Update order status to refunded
    await orderRepository.updateStatus(order.id, 'refunded');
    
    logger.info('Refund processed', { orderId: order.id });
    
    return { order_id: order.id, status: 'refunded' };
  },
};

module.exports = webhookService;
