const { z } = require('zod');

const PRODUCT_STATUS = ['available', 'reserved', 'sold'];
const PRODUCT_CONDITIONS = ['new', 'like_new', 'good', 'fair'];
const PRODUCT_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG', 'unique'];

const createProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  original_price: z.number().positive('Original price must be positive').optional(),
  size: z.enum(PRODUCT_SIZES).optional(),
  brand: z.string().optional(),
  color: z.string().optional(),
  condition: z.enum(PRODUCT_CONDITIONS).default('good'),
  collection_id: z.number().int().positive().optional(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
});

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  original_price: z.number().positive().optional(),
  size: z.enum(PRODUCT_SIZES).optional(),
  brand: z.string().optional(),
  color: z.string().optional(),
  condition: z.enum(PRODUCT_CONDITIONS).optional(),
  collection_id: z.number().int().positive().nullable().optional(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(PRODUCT_STATUS, {
    errorMap: () => ({ message: `Status must be one of: ${PRODUCT_STATUS.join(', ')}` }),
  }),
});

const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(PRODUCT_STATUS).optional(),
  collection_id: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'price', 'name']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  updateStatusSchema,
  productQuerySchema,
  PRODUCT_STATUS,
  PRODUCT_CONDITIONS,
  PRODUCT_SIZES,
};
