const collectionService = require("../services/collection.service");
const responses = require("../utils/responses");
const { asyncHandler } = require("../middlewares/errorHandler");

const collectionController = {
  list: asyncHandler(async (req, res) => {
    const result = await collectionService.list(req.query);
    return responses.success(res, result);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const includeProducts = req.query.include_products === "true";
    const collection = await collectionService.getById(
      parseInt(id, 10),
      includeProducts,
    );
    return responses.success(res, { collection });
  }),

  create: asyncHandler(async (req, res) => {
    const collection = await collectionService.create(req.body, req.admin.id);
    return responses.created(
      res,
      { collection },
      "Collection created successfully",
    );
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const collection = await collectionService.update(
      parseInt(id, 10),
      req.body,
      req.admin.id,
    );
    return responses.success(
      res,
      { collection },
      "Collection updated successfully",
    );
  }),

  toggleActive: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const collection = await collectionService.toggleActive(
      parseInt(id, 10),
      req.admin.id,
    );
    const message = collection.is_active
      ? "Collection activated"
      : "Collection deactivated";
    return responses.success(res, { collection }, message);
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await collectionService.delete(parseInt(id, 10), req.admin.id);
    return responses.success(res, null, "Collection deleted successfully");
  }),

  getActive: asyncHandler(async (req, res) => {
    const collections = await collectionService.getActive();
    return responses.success(res, { collections });
  }),
};

module.exports = collectionController;
