const productRepository = require('../repositories/product.repository');
const { AppError } = require('../middlewares/errorHandler');
const { paginate, paginationResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

// Valid status transitions
const STATUS_TRANSITIONS = {
  available: ['reserved', 'sold'],
  reserved: ['available', 'sold'],
  sold: [], // Cannot transition from sold
};

const productService = {
  async list(queryParams) {
    const { page, limit, offset } = paginate(queryParams.page, queryParams.limit);
    
    const [products, total] = await Promise.all([
      productRepository.findAll({
        limit,
        offset,
        status: queryParams.status,
        collection_id: queryParams.collection_id,
        search: queryParams.search,
        sort_by: queryParams.sort_by,
        sort_order: queryParams.sort_order,
      }),
      productRepository.count({
        status: queryParams.status,
        collection_id: queryParams.collection_id,
        search: queryParams.search,
      }),
    ]);
    
    return paginationResponse(products, total, page, limit);
  },

  async getById(id) {
    const product = await productRepository.findById(id);
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    
    return product;
  },

  async create(data, adminId) {
    const product = await productRepository.create(data);
    
    logger.audit('PRODUCT_CREATED', adminId, {
      productId: product.id,
      name: product.name,
      price: product.price,
    });
    
    return product;
  },

  async update(id, data, adminId) {
    const existingProduct = await productRepository.findById(id);
    
    if (!existingProduct) {
      throw new AppError('Product not found', 404);
    }
    
    // Don't allow updating sold products (except for minor edits)
    if (existingProduct.status === 'sold' && data.price !== undefined) {
      throw new AppError('Cannot modify price of sold product', 400);
    }
    
    const product = await productRepository.update(id, data);
    
    logger.audit('PRODUCT_UPDATED', adminId, {
      productId: id,
      changes: Object.keys(data),
    });
    
    return product;
  },

  async updateStatus(id, newStatus, adminId) {
    const product = await productRepository.findById(id);
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    
    // Validate status transition
    const currentStatus = product.status;
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
    
    if (!allowedTransitions.includes(newStatus)) {
      throw new AppError(
        `Cannot change status from '${currentStatus}' to '${newStatus}'. Allowed: ${allowedTransitions.join(', ') || 'none'}`,
        400
      );
    }
    
    const updatedProduct = await productRepository.updateStatus(id, newStatus);
    
    logger.audit('PRODUCT_STATUS_CHANGED', adminId, {
      productId: id,
      from: currentStatus,
      to: newStatus,
    });
    
    return updatedProduct;
  },

  async delete(id, adminId) {
    const product = await productRepository.findById(id);
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    
    // Don't allow deleting sold products
    if (product.status === 'sold') {
      throw new AppError('Cannot delete sold product', 400);
    }
    
    const deleted = await productRepository.delete(id);
    
    if (deleted) {
      logger.audit('PRODUCT_DELETED', adminId, {
        productId: id,
        name: product.name,
      });
    }
    
    return deleted;
  },

  async getStatusCounts() {
    return productRepository.countByStatus();
  },
};

module.exports = productService;
