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

  create: asyncHandler(async (req, res) => {
    const product = await productService.create(req.body, req.admin.id);
    return responses.created(res, product, "Product created successfully");
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await productService.update(id, req.body, req.admin.id);
    return responses.success(res, product, "Product updated successfully");
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const product = await productService.updateStatus(id, status, req.admin.id);
    return responses.success(
      res,
      product,
      "Product status updated successfully",
    );
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await productService.delete(id, req.admin.id);
    return responses.success(res, null, "Product deleted successfully");
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
