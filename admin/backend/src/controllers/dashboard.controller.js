const dashboardService = require("../services/dashboard.service");
const responses = require("../utils/responses");
const { asyncHandler } = require("../middlewares/errorHandler");

const dashboardController = {
  getDashboard: asyncHandler(async (req, res) => {
    const data = await dashboardService.getDashboardData();
    return responses.success(res, data);
  }),

  getSalesChart: asyncHandler(async (req, res) => {
    const days = parseInt(req.query.days, 10) || 30;
    const data = await dashboardService.getSalesChart(days);
    return responses.success(res, { chart_data: data });
  }),

  getTopProducts: asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 5;
    const data = await dashboardService.getTopProducts(limit);
    return responses.success(res, { top_products: data });
  }),
};

module.exports = dashboardController;
