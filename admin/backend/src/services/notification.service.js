const { notificationRepository, NOTIFICATION_TYPES } = require('../repositories/notification.repository');
const { AppError } = require('../middlewares/errorHandler');
const { paginate, paginationResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

const notificationService = {
  async list(queryParams) {
    const { page, limit, offset } = paginate(queryParams.page, queryParams.limit);
    
    const [notifications, total] = await Promise.all([
      notificationRepository.findAll({
        limit,
        offset,
        unread_only: queryParams.unread_only,
      }),
      notificationRepository.count({
        unread_only: queryParams.unread_only,
      }),
    ]);
    
    const unreadCount = await notificationRepository.countUnread();
    
    return {
      ...paginationResponse(notifications, total, page, limit),
      unread_count: unreadCount,
    };
  },

  async markAsRead(id, adminId) {
    const notification = await notificationRepository.findById(id);
    
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }
    
    if (notification.is_read) {
      return notification;
    }
    
    const updated = await notificationRepository.markAsRead(id);
    
    logger.debug('Notification marked as read', { id, adminId });
    
    return updated;
  },

  async markAllAsRead(adminId) {
    const count = await notificationRepository.markAllAsRead();
    
    logger.audit('ALL_NOTIFICATIONS_READ', adminId, { count });
    
    return { marked_count: count };
  },

  async getUnreadCount() {
    return notificationRepository.countUnread();
  },

  async getRecent(limit = 5) {
    return notificationRepository.getRecent(limit);
  },

  // Helper to create notifications (used by other services)
  async createNotification(type, title, message, data = null, client = null) {
    const notification = await notificationRepository.create(
      { type, title, message, data },
      client
    );
    
    logger.info('Notification created', { type, title });
    
    return notification;
  },

  // Specific notification creators
  async notifyNewOrder(order, client = null) {
    return this.createNotification(
      NOTIFICATION_TYPES.NEW_ORDER,
      'Novo Pedido',
      `Novo pedido #${order.reference_code} de ${order.customer_name}`,
      { order_id: order.id, reference_code: order.reference_code },
      client
    );
  },

  async notifyPaymentReceived(order, client = null) {
    return this.createNotification(
      NOTIFICATION_TYPES.PAYMENT_RECEIVED,
      'Pagamento Recebido',
      `Pagamento confirmado para pedido #${order.reference_code}`,
      { order_id: order.id, reference_code: order.reference_code, total: order.total },
      client
    );
  },

  async notifyDeliveryCompleted(delivery, order, client = null) {
    return this.createNotification(
      NOTIFICATION_TYPES.DELIVERY_COMPLETED,
      'Entrega Realizada',
      `Pedido #${order.reference_code} foi entregue`,
      { delivery_id: delivery.id, order_id: order.id },
      client
    );
  },
};

module.exports = notificationService;
