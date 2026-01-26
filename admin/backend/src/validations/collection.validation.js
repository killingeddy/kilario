const { z } = require('zod');

const createCollectionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  cover_image: z.string().url().optional(),
  is_active: z.boolean().default(true),
  starts_at: z.string().datetime().optional(),
  ends_at: z.string().datetime().optional(),
});

const updateCollectionSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  cover_image: z.string().url().optional(),
  is_active: z.boolean().optional(),
  starts_at: z.string().datetime().nullable().optional(),
  ends_at: z.string().datetime().nullable().optional(),
});

const collectionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  is_active: z.coerce.boolean().optional(),
  search: z.string().optional(),
});

module.exports = {
  createCollectionSchema,
  updateCollectionSchema,
  collectionQuerySchema,
};
