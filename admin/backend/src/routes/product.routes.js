const express = require("express");
const productController = require("../controllers/product.controller");
const authAdmin = require("../middlewares/authAdmin");
const { validate, validateQuery } = require("../middlewares/validate");
const {
  createProductSchema,
  updateProductSchema,
  updateStatusSchema,
  productQuerySchema,
} = require("../validations/product.validation");

const router = express.Router();

router.use(authAdmin);

router.get("/", productController.list);
router.get("/:id", productController.getById);
router.post("/", productController.create);
router.put("/:id", productController.update);
router.patch("/:id/status", productController.updateStatus);
router.delete("/:id", productController.delete);

// SIZES AND CONDITIONS ENDPOINTS
router.get("/sizes/list", productController.getSizes);
router.get("/conditions/list", productController.getConditions);

module.exports = router;
