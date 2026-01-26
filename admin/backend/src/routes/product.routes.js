const express = require('express');
const productController = require('../controllers/product.controller');
const authAdmin = require('../middlewares/authAdmin');
const { validate, validateQuery } = require('../middlewares/validate');
const {
  createProductSchema,
  updateProductSchema,
  updateStatusSchema,
  productQuerySchema,
} = require('../validations/product.validation');

const router = express.Router();

// All routes require admin authentication
router.use(authAdmin);

// List products
router.get('/', validateQuery(productQuerySchema), productController.list);

// Get single product
router.get('/:id', productController.getById);

// Create product
router.post('/', validate(createProductSchema), productController.create);

// Update product
router.put('/:id', validate(updateProductSchema), productController.update);

// Update product status
router.patch('/:id/status', validate(updateStatusSchema), productController.updateStatus);

// Delete product
router.delete('/:id', productController.delete);

module.exports = router;
