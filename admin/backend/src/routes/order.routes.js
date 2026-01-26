const express = require('express');
const orderController = require('../controllers/order.controller');
const authAdmin = require('../middlewares/authAdmin');
const { validate, validateQuery } = require('../middlewares/validate');
const {
  updateOrderStatusSchema,
  orderQuerySchema,
} = require('../validations/order.validation');

const router = express.Router();

// All routes require admin authentication
router.use(authAdmin);

// List orders
router.get('/', validateQuery(orderQuerySchema), orderController.list);

// Get single order with details
router.get('/:id', orderController.getById);

// Update order status
router.patch('/:id/status', validate(updateOrderStatusSchema), orderController.updateStatus);

module.exports = router;
