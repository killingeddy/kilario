const orderRepository = require("../repositories/order.repository");
const { AppError } = require("../middlewares/errorHandler");
const { paginate, paginationResponse } = require("../utils/helpers");
const logger = require("../utils/logger");

const STATUS_TRANSITIONS = {
  pending: ["paid", "cancelled"],
  paid: ["refunded"],
  refunded: [],
  cancelled: [],
};

const orderService = {
  async list(queryParams) {
    const { page, limit, offset } = paginate(
      queryParams.page,
      queryParams.limit,
    );

    const [orders, total] = await Promise.all([
      orderRepository.findAll({
        limit,
        offset,
        status: queryParams.status,
        customer_email: queryParams.customer_email,
        date_from: queryParams.date_from,
        date_to: queryParams.date_to,
        sort_by: queryParams.sort_by,
        sort_order: queryParams.sort_order,
      }),
      orderRepository.count({
        status: queryParams.status,
        customer_email: queryParams.customer_email,
        date_from: queryParams.date_from,
        date_to: queryParams.date_to,
      }),
    ]);

    return paginationResponse(orders, total, page, limit);
  },

  async getById(id) {
    const order = await orderRepository.findByIdWithItems(id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return order;
  },

  async updateStatus(id, newStatus, reason, adminId) {
    const order = await orderRepository.findById(id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const currentStatus = order.status;
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedTransitions.includes(newStatus)) {
      throw new AppError(
        `Cannot change status from '${currentStatus}' to '${newStatus}'. Allowed: ${allowedTransitions.join(", ") || "none"}`,
        400,
      );
    }
    if (newStatus === "refunded" && !reason) {
      throw new AppError("Refund reason is required", 400);
    }

    const updatedOrder = await orderRepository.updateStatus(id, newStatus);

    logger.audit("ORDER_STATUS_CHANGED", adminId, {
      orderId: id,
      from: currentStatus,
      to: newStatus,
      reason: reason || null,
    });

    return updatedOrder;
  },

  async getRecentOrders(limit = 5) {
    return orderRepository.getRecentOrders(limit);
  },

  async getSalesStats(dateFrom = null, dateTo = null) {
    return orderRepository.getTotalSales(dateFrom, dateTo);
  },

  async getStatusCounts() {
    return orderRepository.countByStatus();
  },
};

module.exports = orderService;
