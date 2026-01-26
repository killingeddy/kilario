const express = require("express");
const orderController = require("../controllers/order.controller");
const authAdmin = require("../middlewares/authAdmin");
const { validate, validateQuery } = require("../middlewares/validate");
const {
  updateOrderStatusSchema,
  orderQuerySchema,
} = require("../validations/order.validation");

const router = express.Router();

router.use(authAdmin);

router.get("/", validateQuery(orderQuerySchema), orderController.list);
router.get("/:id", orderController.getById);
router.patch(
  "/:id/status",
  validate(updateOrderStatusSchema),
  orderController.updateStatus,
);

module.exports = router;
