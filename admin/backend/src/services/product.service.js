const productRepository = require("../repositories/product.repository");
const { AppError } = require("../middlewares/errorHandler");
const { paginate, paginationResponse } = require("../utils/helpers");
const { transaction } = require("../database/connection");
const { uploadBase64ToFirebase } = require("../utils/uploadImageBase64"); // Supondo este caminho
const logger = require("../utils/logger");

const productService = {
  async list(queryParams) {
    const { page, limit, offset } = paginate(
      queryParams.page,
      queryParams.limit,
    );

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
    console.log('product 2', product);
    
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return product;
  },

  async create(data, adminId) {
    return await transaction(async (client) => {
      // 1. Tratar Upload de Imagens (se houver base64)
      const imageUrls = [];
      if (data.images && data.images.length > 0) {
        for (const img of data.images) {
          if (img.startsWith("data:image")) {
            const url = await uploadBase64ToFirebase(img, "products");
            imageUrls.push(url);
          } else {
            imageUrls.push(img);
          }
        }
      }

      // 2. Criar Produto
      const product = await productRepository.create(data, client);
      console.log('product created', product);
      

      // 3. Salvar Imagens na tabela separada
      await productRepository.saveImages(product.id, imageUrls, client);

      // 4. Salvar Medidas na tabela separada
      if (data.measurements) {
        await productRepository.saveMeasurements(
          product.id,
          data.measurements,
          client,
        );
      }

      logger.audit("PRODUCT_CREATED", adminId, {
        productId: product.id,
        title: product.title,
      });
      console.log('product', product);
      

      return this.getById(product.id);
    });
  },

  async update(id, data, adminId) {
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    if (existingProduct.status === "sold" && data.price !== undefined) {
      throw new AppError("Cannot modify price of sold product", 400);
    }

    return await transaction(async (client) => {
      // 1. Tratar Upload de novas Imagens
      let imageUrls = undefined;
      if (data.images !== undefined) {
        imageUrls = [];
        for (const img of data.images) {
          if (img.startsWith("data:image")) {
            const url = await uploadBase64ToFirebase(img, "products");
            imageUrls.push(url);
          } else {
            imageUrls.push(img);
          }
        }
      }

      // 2. Atualizar Produto
      const product = await productRepository.update(id, data, client);

      // 3. Atualizar Imagens se enviadas
      if (imageUrls !== undefined) {
        await productRepository.saveImages(id, imageUrls, client);
      }

      // 4. Atualizar Medidas se enviadas
      if (data.measurements !== undefined) {
        await productRepository.saveMeasurements(id, data.measurements, client);
      }

      logger.audit("PRODUCT_UPDATED", adminId, {
        productId: id,
        changes: Object.keys(data),
      });

      return this.getById(id);
    });
  },

  async updateStatus(id, newStatus, adminId) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const updatedProduct = await productRepository.updateStatus(id, newStatus);

    logger.audit("PRODUCT_STATUS_CHANGED", adminId, {
      productId: id,
      to: newStatus,
    });

    return updatedProduct;
  },

  async delete(id, adminId) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.status === "sold") {
      throw new AppError("Cannot delete sold product", 400);
    }

    const deleted = await productRepository.delete(id);
    if (deleted) {
      logger.audit("PRODUCT_DELETED", adminId, {
        productId: id,
      });
    }
    return deleted;
  },

  async getSizes() {
    return productRepository.getSizes();
  },

  async getConditions() {
    return productRepository.getConditions();
  }
};

module.exports = productService;
