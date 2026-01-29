const collectionService = require("../services/collection.service");
const responses = require("../utils/responses");
const { asyncHandler } = require("../middlewares/errorHandler");

const collectionController = {
  list: asyncHandler(async (req, res) => {
    const result = await collectionService.list(req.query);
    return responses.success(res, result.data);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const includeProducts = req.query.include_products === "true";
    const collection = await collectionService.getById(
      id,
      includeProducts,
    );
    return responses.success(res, collection);
  }),

  getActive: asyncHandler(async (req, res) => {
    const collections = await collectionService.getActive();
    return responses.success(res, { collections });
  }),
};

module.exports = collectionController;
