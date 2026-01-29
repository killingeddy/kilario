const collectionRepository = require("../repositories/collection.repository");
const { AppError } = require("../middlewares/errorHandler");
const { paginate, paginationResponse } = require("../utils/helpers");
const logger = require("../utils/logger");
const slugify = require("slugify");

const collectionService = {
  async list(queryParams) {
    const { page, limit, offset } = paginate(
      queryParams.page,
      queryParams.limit,
    );

    const [collections, total] = await Promise.all([
      collectionRepository.findAll({
        limit,
        offset,
        is_active:
          queryParams.is_active !== undefined
            ? queryParams.is_active === "true"
            : undefined,
        search: queryParams.search,
      }),
      collectionRepository.count({
        is_active:
          queryParams.is_active !== undefined
            ? queryParams.is_active === "true"
            : undefined,
        search: queryParams.search,
      }),
    ]);

    return paginationResponse(collections, total, page, limit);
  },

  async getById(id, includeProducts = false) {
    const collection = includeProducts
      ? await collectionRepository.findByIdWithProducts(id)
      : await collectionRepository.findById(id);

    if (!collection) {
      throw new AppError("Collection not found", 404);
    }

    return collection;
  },

  async create(data, adminId) {
    if (!data.title) {
      throw new AppError("Title is required", 400);
    }

    const slug = slugify(data.title, {
      lower: true,
      strict: true,
    });

    const collection = await collectionRepository.create({
      ...data,
      slug,
    });

    logger.audit("COLLECTION_CREATED", adminId, {
      collectionId: collection.id,
      title: collection.title,
    });

    return collection;
  },

  async update(id, data, adminId) {
    const collection = await collectionRepository.findById(id);

    if (!collection) {
      throw new AppError("Collection not found", 404);
    }

    const payload = { ...data };

    if (data.title) {
      payload.slug = slugify(data.title, {
        lower: true,
        strict: true,
      });
    }

    const updatedCollection = await collectionRepository.update(id, payload);

    logger.audit("COLLECTION_UPDATED", adminId, {
      collectionId: id,
      before: {
        title: collection.title,
        is_active: collection.is_active,
      },
      after: {
        title: updatedCollection.title,
        is_active: updatedCollection.is_active,
      },
    });

    return updatedCollection;
  },

  async toggleActive(id, adminId) {
    const collection = await collectionRepository.findById(id);

    if (!collection) {
      throw new AppError("Collection not found", 404);
    }

    const updatedCollection = await collectionRepository.toggleActive(
      id,
      !collection.is_active,
    );

    logger.audit("COLLECTION_TOGGLE_ACTIVE", adminId, {
      collectionId: id,
      from: collection.is_active,
      to: updatedCollection.is_active,
    });

    return updatedCollection;
  },

  async delete(id, adminId) {
    const deleted = await collectionRepository.delete(id);

    if (!deleted) {
      throw new AppError("Collection not found", 404);
    }

    logger.audit("COLLECTION_DELETED", adminId, {
      collectionId: id,
    });

    return true;
  },

  async getActive() {
    return collectionRepository.getActiveCollections();
  },
};

module.exports = collectionService;
