const notificationService = require("../services/notification.service");
const responses = require("../utils/responses");
const { asyncHandler } = require("../middlewares/errorHandler");

const notificationController = {
  list: asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, unread_only } = req.query;
    const result = await notificationService.list({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      unread_only: unread_only === "true",
    });
    return responses.success(res, result);
  }),

  markAsRead: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(
      id,
      req.admin.id,
    );
    return responses.success(
      res,
      { notification },
      "Notification marked as read",
    );
  }),

  markAllAsRead: asyncHandler(async (req, res) => {
    const result = await notificationService.markAllAsRead(req.admin.id);
    return responses.success(res, result, "All notifications marked as read");
  }),

  getUnreadCount: asyncHandler(async (req, res) => {
    const count = await notificationService.getUnreadCount();
    return responses.success(res, { unread_count: count });
  }),
};

module.exports = notificationController;
