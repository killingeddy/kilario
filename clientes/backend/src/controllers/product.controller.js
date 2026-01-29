const productService = require("../services/product.service");
const responses = require("../utils/responses");
const { asyncHandler } = require("../middlewares/errorHandler");

const productController = {
  list: asyncHandler(async (req, res) => {
    const result = await productService.list(req.query);
    return responses.success(res, result);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await productService.getById(id);
    return responses.success(res, product);
  }),

  getSizes: asyncHandler(async (req, res) => {
    const sizes = await productService.getSizes();
    return responses.success(res, sizes);
  }),

  getConditions: asyncHandler(async (req, res) => {
    const conditions = await productService.getConditions();
    return responses.success(res, conditions);
  }),
};

module.exports = productController;
