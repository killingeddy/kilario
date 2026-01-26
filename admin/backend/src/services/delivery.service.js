const deliveryRepository = require('../repositories/delivery.repository');
const { AppError } = require('../middlewares/errorHandler');
const { paginate, paginationResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

// Valid status transitions
const STATUS_TRANSITIONS = {
  pending: ['scheduled', 'in_transit', 'delivered', 'failed'],
  scheduled: ['in_transit', 'delivered', 'failed', 'pending'],
  in_transit: ['delivered', 'failed'],
  delivered: [],
  failed: ['pending', 'scheduled'],
};

const deliveryService = {
  async list(queryParams) {
    const { page, limit, offset } = paginate(queryParams.page, queryParams.limit);
    
    const [deliveries, total] = await Promise.all([
      deliveryRepository.findAll({
        limit,
        offset,
        status: queryParams.status,
        date_from: queryParams.date_from,
        date_to: queryParams.date_to,
      }),
      deliveryRepository.count({
        status: queryParams.status,
        date_from: queryParams.date_from,
        date_to: queryParams.date_to,
      }),
    ]);
    
    return paginationResponse(deliveries, total, page, limit);
  },

  async getById(id) {
    const delivery = await deliveryRepository.findById(id);
    
    if (!delivery) {
      throw new AppError('Delivery not found', 404);
    }
    
    return delivery;
  },

  async updateStatus(id, newStatus, additionalData, adminId) {
    const delivery = await deliveryRepository.findById(id);
    
    if (!delivery) {
      throw new AppError('Delivery not found', 404);
    }
    
    // Validate status transition
    const currentStatus = delivery.status;
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
    
    if (!allowedTransitions.includes(newStatus)) {
      throw new AppError(
        `Cannot change status from '${currentStatus}' to '${newStatus}'. Allowed: ${allowedTransitions.join(', ') || 'none'}`,
        400
      );
    }
    
    // If scheduling, require scheduled_at
    if (newStatus === 'scheduled' && !additionalData.scheduled_at && !delivery.scheduled_at) {
      throw new AppError('Scheduled date is required when scheduling delivery', 400);
    }
    
    const updatedDelivery = await deliveryRepository.updateStatus(id, newStatus, additionalData);
    
    logger.audit('DELIVERY_STATUS_CHANGED', adminId, {
      deliveryId: id,
      orderId: delivery.order_id,
      from: currentStatus,
      to: newStatus,
    });
    
    return updatedDelivery;
  },

  async getPendingCount() {
    return deliveryRepository.countPending();
  },

  async getStatusCounts() {
    return deliveryRepository.countByStatus();
  },
};

module.exports = deliveryService;
