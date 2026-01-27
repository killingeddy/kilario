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
router.post("/", validate(createProductSchema), productController.create);
router.put("/:id", validate(updateProductSchema), productController.update);
router.patch(
  "/:id/status",
  validate(updateStatusSchema),
  productController.updateStatus,
);
router.delete("/:id", productController.delete);

module.exports = router;
