const deliveryService = require('../services/delivery.service');
const responses = require('../utils/responses');
const { asyncHandler } = require('../middlewares/errorHandler');

const deliveryController = {
  list: asyncHandler(async (req, res) => {
    const result = await deliveryService.list(req.query);
    return responses.success(res, result);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const delivery = await deliveryService.getById(parseInt(id, 10));
    return responses.success(res, { delivery });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, notes, scheduled_at, delivered_at } = req.body;
    const delivery = await deliveryService.updateStatus(
      parseInt(id, 10),
      status,
      { notes, scheduled_at, delivered_at },
      req.admin.id
    );
    return responses.success(res, { delivery }, 'Delivery status updated successfully');
  }),
};

module.exports = deliveryController;
