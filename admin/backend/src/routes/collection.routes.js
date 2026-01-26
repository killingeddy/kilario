const express = require('express');
const collectionController = require('../controllers/collection.controller');
const authAdmin = require('../middlewares/authAdmin');
const { validate, validateQuery } = require('../middlewares/validate');
const {
  createCollectionSchema,
  updateCollectionSchema,
  collectionQuerySchema,
} = require('../validations/collection.validation');

const router = express.Router();

// All routes require admin authentication
router.use(authAdmin);

// Get active collections (useful for dropdowns)
router.get('/active', collectionController.getActive);

// List collections
router.get('/', validateQuery(collectionQuerySchema), collectionController.list);

// Get single collection
router.get('/:id', collectionController.getById);

// Create collection
router.post('/', validate(createCollectionSchema), collectionController.create);

// Update collection
router.put('/:id', validate(updateCollectionSchema), collectionController.update);

// Toggle active status
router.patch('/:id/toggle', collectionController.toggleActive);

// Delete collection
router.delete('/:id', collectionController.delete);

module.exports = router;
