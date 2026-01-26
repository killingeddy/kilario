const express = require('express');
const deliveryController = require('../controllers/delivery.controller');
const authAdmin = require('../middlewares/authAdmin');
const { validate, validateQuery } = require('../middlewares/validate');
const {
  updateDeliveryStatusSchema,
  deliveryQuerySchema,
} = require('../validations/delivery.validation');

const router = express.Router();

// All routes require admin authentication
router.use(authAdmin);

// List deliveries
router.get('/', validateQuery(deliveryQuerySchema), deliveryController.list);

// Get single delivery with details
router.get('/:id', deliveryController.getById);

// Update delivery status
router.patch('/:id/status', validate(updateDeliveryStatusSchema), deliveryController.updateStatus);

module.exports = router;
