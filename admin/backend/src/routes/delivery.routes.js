const express = require("express");
const deliveryController = require("../controllers/delivery.controller");
const authAdmin = require("../middlewares/authAdmin");
const { validate, validateQuery } = require("../middlewares/validate");
const {
  updateDeliveryStatusSchema,
  deliveryQuerySchema,
} = require("../validations/delivery.validation");

const router = express.Router();

router.use(authAdmin);
router.get("/", validateQuery(deliveryQuerySchema), deliveryController.list);
router.get("/:id", deliveryController.getById);
router.patch(
  "/:id/status",
  validate(updateDeliveryStatusSchema),
  deliveryController.updateStatus,
);

module.exports = router;
