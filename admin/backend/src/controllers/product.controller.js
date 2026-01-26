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
    const product = await productService.getById(parseInt(id, 10));
    return responses.success(res, { product });
  }),

  create: asyncHandler(async (req, res) => {
    const product = await productService.create(req.body, req.admin.id);
    return responses.created(res, { product }, "Product created successfully");
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await productService.update(
      parseInt(id, 10),
      req.body,
      req.admin.id,
    );
    return responses.success(res, { product }, "Product updated successfully");
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const product = await productService.updateStatus(
      parseInt(id, 10),
      status,
      req.admin.id,
    );
    return responses.success(
      res,
      { product },
      "Product status updated successfully",
    );
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await productService.delete(parseInt(id, 10), req.admin.id);
    return responses.success(res, null, "Product deleted successfully");
  }),
};

module.exports = productController;
