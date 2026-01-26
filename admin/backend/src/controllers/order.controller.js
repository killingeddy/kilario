const orderService = require("../services/order.service");
const responses = require("../utils/responses");
const { asyncHandler } = require("../middlewares/errorHandler");

const orderController = {
  list: asyncHandler(async (req, res) => {
    const result = await orderService.list(req.query);
    return responses.success(res, result);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await orderService.getById(parseInt(id, 10));
    return responses.success(res, { order });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;
    const order = await orderService.updateStatus(
      parseInt(id, 10),
      status,
      reason,
      req.admin.id,
    );
    return responses.success(
      res,
      { order },
      "Order status updated successfully",
    );
  }),
};

module.exports = orderController;
